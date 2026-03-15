import asyncio
import logging
import uuid
import redis.exceptions
from ..db.models import User
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import IntegrityError
from ..schemas.user import UserCreate, LoginRequest
from ..db.redis_client import redis_client
from fastapi import status, HTTPException, Response, Cookie, Depends
from ..repository.users_repo import user_by_email, user_by_id
from ..db.db_connection import get_session
from ..core.security import pass_hash, verify_password


logger = logging.getLogger(__name__)


#! create new user
async def create_user(user_data: UserCreate, db: AsyncSession) -> dict:

    # Step 1: Check if a user with the given email already exists in the database
    user = await user_by_email(email=user_data.email, db=db)
    if user:
        # If user exists, raise conflict HTTP exception (409)
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="user already exists"
        )

    # Step 2: Hash the plaintext password asynchronously
    hashed_pass = await asyncio.get_running_loop().run_in_executor(
        None, pass_hash, user_data.password
    )

    # Step 3: Create a new User [ORM object]
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_pass,
    )
    try:

        # Step 4: Add the new user to the current DB session
        db.add(new_user)
        # Step 5: Commit the transaction to save the new user
        await db.commit()
        # Step 6: Refresh the new_user instance with updated database state (e.g., user_id)
        await db.refresh(new_user)

        # Step 7: Return success message upon successful creation
        return {"detail": "account created!", "success": True}

    except IntegrityError:
        # Step 8: If an integrity error occurs (e.g., unique constraint), rollback and notify client
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="user already exists!"
        )
    except Exception as error:
        # Step 9: For any other exception, rollback and log the error, then raise generic server error
        await db.rollback()
        logger.error(f"create_user failed for email: {user_data.email}:=> {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, please try again!",
        )


#! authenticate user
async def authenticate_user(
    user_data: LoginRequest, response: Response, db: AsyncSession
) -> dict:

    # Step 1: Try to find a user in the database by email
    user = await user_by_email(email=user_data.email, db=db)

    # Step 2: If user not found, raise HTTP 401 Unauthorized (invalid email)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email"
        )

    # Step 3: Verify the provided password matches the user's stored password (asynchronously)
    is_valid_pass = await asyncio.get_running_loop().run_in_executor(
        None, verify_password, user_data.password, user.password
    )

    # Step 4: If password is invalid, raise HTTP 401 Unauthorized
    if not is_valid_pass:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password"
        )
    try:

        # Step 5: Generate a unique session ID for this login session
        session_id = str(uuid.uuid4())

        # Step 6: Store the mapping of session_id to user_id in Redis with an expiry (24h)
        await redis_client.set(
            f"session:{session_id}",
            str(user.user_id),
            ex=60 * 60 * 24,
        )

        # Step 7: Set a session cookie in the response to authenticate future requests
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            max_age=60 * 60 * 24,
            secure=False,  # todo: set True in production (HTTPS)
            samesite="lax",
        )

        # Step 8: Return a success message to the client
        return {"detail": "Login successful!", "success": True}

    # Step 9: Handle Redis errors (e.g., Redis service unavailable)
    except redis.exceptions.RedisError as e:
        await db.rollback()
        logger.error(f"Redis error during login for {user_data.email}:=> {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Session service unavailable, please try again!",
        )

    # Step 10: Handle any other unexpected errors
    except Exception as e:
        await db.rollback()
        logger.error(f"Unexpected error during login for {user_data.email}:=> {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something went wrong try again!",
        )


#! Get the currently authenticated user using session ID stored in the cookie
async def current_user(
    db: AsyncSession = Depends(get_session),
    session_id: str = Cookie(None),
) -> User:
    try:

        # Step 1: Ensure the session_id cookie is present
        if not session_id:
            raise HTTPException(status_code=401, detail="Not authenticated")

        # Step 2: Look up the user_id in Redis using the session_id
        user_id = await redis_client.get(f"session:{session_id}")

        # Step 3: If no user_id found in Redis, the session is invalid or expired
        if not user_id:
            raise HTTPException(status_code=401, detail="Not authenticated")

        # Step 4: Convert the string user_id from Redis to a UUID object
        user_id_cast = uuid.UUID(user_id)

        # Step 5: Fetch the User database object by user_id
        curr_user = await user_by_id(id=user_id_cast, db=db)

        # Step 6: If the user is not found in the database, clean up and refuse authentication
        if not curr_user:
            await redis_client.delete(f"session:{session_id}")
            raise HTTPException(status_code=401, detail="Not authenticated")

        # Step 7: Extend session expiry time in Redis (sliding session expiration, set to 1 day)
        await redis_client.expire(
            f"session:{session_id}", 60 * 60 * 24
        )  # 1 day expiry of session_id

        # Step 8: Return the current authenticated User object
        return curr_user

    # Handle when the user_id string from Redis can't be parsed into a UUID
    except ValueError:
        await db.rollback()
        logger.warning(
            f"Malformed user_id in Redis for session {session_id}: {user_id}"
        )
        raise HTTPException(status_code=401, detail="Not authenticated")

    # Handle Redis connection or query errors
    except redis.exceptions.RedisError as err:
        await db.rollback()
        logger.error(f"Redis error in current_user: {err}")
        raise HTTPException(status_code=503, detail="Session service unavailable")

    # Handle any other unexpected errors (e.g., database exceptions)
    except Exception as err:
        await db.rollback()
        logger.error(f"Database error in current_user: {err}")
        raise HTTPException(
            status_code=500, detail="Internal server error while fetching user"
        )


#! logout user
async def logout_user(session_id: str | None) -> dict:

    # Step 1: Check if a session ID was provided; if not, there is no session to log out from.
    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="No active session found."
        )
    try:

        # Step 2: Attempt to delete the session from Redis (invalidate session).
        await redis_client.delete(f"session:{session_id}")

        # Step 3: If deletion successful, return logout confirmation.
        return {"detail": "Successfully logged out."}

    # Step 4: Handle errors related to Redis connection or command issues.
    except redis.exceptions.RedisError as err:
        logger.error(f"Redis error while logging out for session {session_id}: {err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Logout failed due to session service error.",
        )
    # Step 5: Handle any unexpected errors during the logout process.
    except Exception as err:
        logger.error(f"Error while logging out for session {session_id}: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Logout failed due to server error.",
        )
