from fastapi import status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
import jwt
from ..schemas.user import UserCreate
from ..repository.users_repo import get_user_by_username
from ..db.models import User
from .security import pass_hash, verify_password
import asyncio


# create new user
async def create_user(user_data: UserCreate, session: AsyncSession):
    user = await get_user_by_username(username=user_data.username, db=session)

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
        session.add(new_user)
        await session.commit()
        await session.refresh(new_user)
        return {"detail": "user created ✌🏻"}
    except Exception:
        await session.rollback()
        return HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something went wrong try again!",
        )
