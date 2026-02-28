from fastapi import APIRouter, Depends, status
from ..db.db_connection import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from ..schemas.user import UserCreate
from ..service.users_service import create_user


user_router = APIRouter(prefix="/users", tags=["users"])


# create account
@user_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_account(
    req_form: UserCreate, session_db: AsyncSession = Depends(get_session)
):
    return await create_user(user_data=req_form, session=session_db)


@user_router.post("/login", status_code=status.HTTP_200_OK)
def login_account():
    pass
