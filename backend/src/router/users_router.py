from fastapi import APIRouter, Depends
from db.db_connection import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from schemas.user import UserCreate, UserResponse


user_router = APIRouter(prefix="/users", tags=["users"])


# create account
@user_router.post("/signup")
async def create_account(
    req_form: UserCreate, session_db: AsyncSession = Depends(get_session)
):
    pass
