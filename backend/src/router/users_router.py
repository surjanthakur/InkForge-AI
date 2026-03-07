from fastapi import APIRouter, Depends, status, Response, Cookie
from ..db.db_connection import get_session
from ..db.models import User
from sqlmodel.ext.asyncio.session import AsyncSession
from ..schemas.user import UserCreate, LoginRequest, currentUserResponse
from ..service.users_service import (
    create_user,
    authenticate_user,
    current_user,
    logout_user,
)

user_router = APIRouter(prefix="/users", tags=["users"])


# create account
@user_router.post("/signup", status_code=status.HTTP_201_CREATED)
async def create_account(
    req_form: UserCreate, session_db: AsyncSession = Depends(get_session)
):
    return await create_user(user_data=req_form, db=session_db)


# login account
@user_router.post("/login", status_code=status.HTTP_200_OK)
async def login_account(
    req_form: LoginRequest,
    response: Response,
    session_db: AsyncSession = Depends(get_session),
):
    return await authenticate_user(user_data=req_form, response=response, db=session_db)


# get account
@user_router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=currentUserResponse,
)
async def get_current_user(curr_user: User = Depends(current_user)):
    return curr_user


# logout account
@user_router.post("/logout", status_code=status.HTTP_200_OK)
async def logout_account(session_id: str = Cookie(None)):
    return await logout_user(session_id=session_id)
