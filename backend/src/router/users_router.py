from fastapi import APIRouter, Depends, status, Response, Cookie
from sqlmodel import desc
from ..db.db_connection import get_session
from sqlmodel.ext.asyncio.session import AsyncSession

from ..db.models import User
from ..schemas.user import UserCreate, LoginRequest, currentUserResponse
from ..service.users_service import (
    create_user,
    authenticate_user,
    current_user,
    logout_user,
)

# router
user_router = APIRouter(prefix="/users", tags=["users"])


# create accounts
@user_router.post(
    "/signup",
    status_code=status.HTTP_201_CREATED,
    description="Create a new user account.",
    response_description="Returns the created user account information.",
)
async def create_account(
    req_form: UserCreate, session_db: AsyncSession = Depends(get_session)
):
    return await create_user(user_data=req_form, db=session_db)


# login accounts
@user_router.post(
    "/login",
    status_code=status.HTTP_200_OK,
    description="Authenticates a user with their email and password. If successful, creates a session and returns authentication cookies.",
    response_description="Session is established and the user is authenticated.",
)
async def login_account(
    req_form: LoginRequest,
    response: Response,
    session_db: AsyncSession = Depends(get_session),
):
    return await authenticate_user(user_data=req_form, response=response, db=session_db)


#  get current authenticated user
@user_router.get(
    "/me",
    status_code=status.HTTP_200_OK,
    response_model=currentUserResponse,
    description="Get information about the currently authenticated user.",
    response_description="Returns the currently authenticated user's profile, including their username, email, posts, and account creation date.",
)
async def get_current_user(curr_user: User = Depends(current_user)):
    return curr_user


# logout accounts
@user_router.post(
    "/logout",
    status_code=status.HTTP_200_OK,
    description="Logs out the currently authenticated user by ending their session.",
    response_description="User session terminated and authentication cookies revoked.",
)
async def logout_account(session_id: str = Cookie(None)):
    return await logout_user(session_id=session_id)
