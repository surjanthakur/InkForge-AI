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


# create new user
async def create_user(user_data: UserCreate, db: AsyncSession):
    user = await user_by_email(email=user_data.email, db=db)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="user already exists"
        )
    hashed_pass = await asyncio.get_running_loop().run_in_executor(
        None, pass_hash, user_data.password
    )
    new_user = User(
        username=user_data.username,
        email=user_data.email,
        password=hashed_pass,
    )
    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return {"detail": "account created!", "success": True}
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="user already exists!"
        )
    except Exception as error:
        await db.rollback()
        logger.error(f"create_user failed for email: {user_data.email}:=> {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, please try again!",
        )


# authenticate user
async def authenticate_user(
    user_data: LoginRequest,
    response: Response,
    db: AsyncSession,
):
    user = await user_by_email(email=user_data.email, db=db)
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid email"
        )
    is_valid_pass = await asyncio.get_running_loop().run_in_executor(
        None, verify_password, user_data.password, user.password
    )
    if not is_valid_pass:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid password"
        )
    try:
        session_id = str(uuid.uuid4())
        await redis_client.set(
            f"session:{session_id}",
            str(user.user_id),
            ex=60 * 60 * 24,
        )
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            max_age=60 * 60 * 24,
            secure=False,  # todo: set True in production (HTTPS)
            samesite="lax",
        )
        return {"detail": "Login successful!", "success": True}

    except redis.exceptions.RedisError as e:
        logger.error(f"Redis error during login for {user_data.email}:=> {e}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="Session service unavailable, please try again!",
        )
    except Exception as e:
        logger.error(f"Unexpected error during login for {user_data.email}:=> {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"something went wrong try again!",
        )


# get curr user info
async def current_user(
    db: AsyncSession = Depends(get_session), session_id: str = Cookie(None)
):
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        user_id = await redis_client.get(f"session:{session_id}")
    except redis.exceptions.RedisError as err:
        logger.error(f"Redis error in current_user: {err}")
        raise HTTPException(status_code=503, detail="Session service unavailable")

    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    try:
        user_id_cast = uuid.UUID(user_id)
    except ValueError:
        logger.warning(
            f"Malformed user_id in Redis for session {session_id}: {user_id}"
        )
        raise HTTPException(status_code=401, detail="Not authenticated")
    try:
        curr_user = await user_by_id(id=user_id_cast, db=db)
    except Exception as err:
        logger.error(
            f"Database error in current_user for user_id {user_id_cast}: {err}"
        )
        raise HTTPException(
            status_code=500, detail="Internal server error while fetching user"
        )
    if not curr_user:
        await redis_client.delete(f"session:{session_id}")
        raise HTTPException(status_code=401, detail="Not authenticated")

    await redis_client.expire(
        f"session:{session_id}", 60 * 60 * 24
    )  # 1 day expirey of session_id

    return curr_user
