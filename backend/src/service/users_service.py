from fastapi import status, HTTPException, Response, Cookie, Depends
from sqlmodel.ext.asyncio.session import AsyncSession
from ..schemas.user import UserCreate, LoginRequest
from ..repository.users_repo import get_user_by_username, user_by_id
from ..db.models import User
from ..db.db_connection import get_session
from ..db.redis_client import redis_client
from .security import pass_hash, verify_password
import asyncio
import uuid


# create new user
async def create_user(user_data: UserCreate, db: AsyncSession):
    user = await get_user_by_username(username=user_data.username, db=db)
    if user:
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT, detail="user already exists"
        )
    hashed_pass = await asyncio.get_event_loop().run_in_executor(
        None, pass_hash, user_data.password
    )
    new_user = User(
        username=user_data.username, email=user_data.email, password=hashed_pass
    )
    try:
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return {"detail": "user created ✌🏻"}
    except Exception:
        await db.rollback()
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something went wrong try again!",
        )


# authenticate user
async def authenticate_user(
    user_data: LoginRequest, response: Response, db: AsyncSession
):
    # Check if user exists
    user = await get_user_by_username(username=user_data.username, db=db)

    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    # Verify password
    if not verify_password(plain_pass=user_data.password, hash_pass=user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials"
        )
    try:
        # Create session_id
        session_id = str(uuid.uuid4())

        # Store session in Redis
        await redis_client.set(
            f"session:{session_id}",
            user.user_id,
            ex=60 * 60 * 24,
        )
        # Set cookie in response
        response.set_cookie(
            key="session_id",
            value=session_id,
            httponly=True,
            max_age=60 * 60 * 24,
            secure=False,  # todo: set True in production (HTTPS)
            samesite="lax",
        )

        return {"message": "Login successful"}
    except Exception as e:
        print(f"Login error: {str(e)}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something went wrong try again!",
        )


# get curr user info
async def current_user(
    db: AsyncSession = Depends(get_session), session_id: str = Cookie(None)
):
    if not session_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    user_id = await redis_client.get(f"session:{session_id}")

    if not user_id:
        raise HTTPException(status_code=401, detail="Not authenticated")

    curr_user = await user_by_id(id=user_id, db=db)
    return curr_user
