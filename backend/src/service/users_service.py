import asyncio
import logging
import uuid
import redis.exceptions
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from fastapi import status, HTTPException, Response, Cookie, Depends

from ..db.models import User
from ..schemas.user import UserCreate, LoginRequest
from ..db.redis_client import redis_client
from ..repository.users_repo import user_by_email, user_by_id
from ..db.db_connection import get_session
from ..core.security import pass_hash, verify_password


SESSION_TTL = 60 * 60 * 24
logger = logging.getLogger(__name__)


# create new account service
async def create_user(user_data: UserCreate, db: AsyncSession) -> dict:

    # Hash the plaintext password asynchronously
    hashed_pass = await asyncio.get_running_loop().run_in_executor(
        None, pass_hash, user_data.password
    )

    # Create a new User [ORM object]
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_pass,
    )
    try:
        # Add the new user to the current DB session
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)

        return {"detail": "account created!", "success": True}

    # handle duplicate entity
    except IntegrityError as err:
        await db.rollback()
        logger.exception(msg=f"error while creating new user: {err}")
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="user already exists!"
        )


# authenticate user
async def authenticate_user(
    user_data: LoginRequest, response: Response, db: AsyncSession
) -> dict:

    # Try to find a user in the database by email
    user = await user_by_email(email=user_data.email, db=db)

    # does the user exist? check
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    #  Verify the provided password matches the user's stored password (asynchronously)
    is_valid_pass = await asyncio.get_running_loop().run_in_executor(
        None, verify_password, user_data.password, user.password
    )

    # is the password correct? check
    if not is_valid_pass:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password",
        )

    try:
        session_id = str(uuid.uuid4())

        # Store the mapping of session_id to user_id in Redis with an expiry (24h)
        await redis_client.set(
            f"session:{session_id}", str(user.user_id), ex=SESSION_TTL
        )

        # Set a session cookie in the response to authenticate future requests
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            max_age=SESSION_TTL,
            secure=False,  # todo: set True in production (HTTPS)
            samesite="lax",
        )

        return {"detail": "Login successfully", "success": True}

    # Handle Redis errors (e.g., Redis service unavailable)
    except redis.exceptions.RedisError as err:
        logger.error(f"Redis error during login for user_id={user.user_id}:=> {err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Session service unavailable, please try again!",
        )

    except SQLAlchemyError as err:
        await db.rollback()
        logger.error(f"database error while authenticate user : {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something went wrong try later",
        )


# Get the current authenticated user
async def current_user(
    db: AsyncSession = Depends(get_session),
    session_id: str = Cookie(None),
) -> User:
    try:
        if not session_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
            )

        # Look up the user_id in Redis using the session_id
        redis_user_id = await redis_client.get(f"session:{session_id}")

        if not redis_user_id:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
            )
        try:
            user_id_cast = uuid.UUID(redis_user_id)
            # Handle when the user_id string from Redis can't be parsed into a UUID
        except ValueError as err:
            await redis_client.delete(f"session:{session_id}")
            logger.error(f"Failed to parse user_id from Redis. ValueError: {err}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
            )

        curr_user = await user_by_id(id=user_id_cast, db=db)

        # If the user is not found in the database, clean up and refuse authentication
        if not curr_user:
            await redis_client.delete(f"session:{session_id}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED, detail="Not authenticated"
            )

        # Extend session expiry time in Redis (sliding session expiration, set to 1 day)
        try:
            await redis_client.expire(name=f"session:{session_id}", time=SESSION_TTL)
        except redis.exceptions.RedisError:
            logger.warning(f"Failed to extend session TTL for session '{session_id}'")

        return curr_user

    except redis.exceptions.RedisError as err:
        logger.error(f"Redis error in current_user: {err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Authentication service unavailable, please try again.",
        )
    except SQLAlchemyError as err:
        await db.rollback()
        logger.error(f"Database error in current_user: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, please try again later.",
        )


# logout user
async def logout_user(response: Response, session_id: str | None) -> dict:

    if not session_id:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="No active session found."
        )

    try:
        # delete session from redis
        await redis_client.delete(f"session:{session_id}")
        # delete session from cookies
        response.delete_cookie("session_id", httponly=True)
        return {"detail": "Successfully logged out."}

    except redis.exceptions.RedisError as err:
        logger.error(f"Redis error during logout for session:{session_id}: {err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Logout failed, please try again.",
        )
