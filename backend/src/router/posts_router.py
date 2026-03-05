from uuid import UUID
from fastapi import APIRouter, Depends, status, HTTPException
from db.db_connection import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from ..schemas.posts import PostCreate, PostResponse
from ..service.posts_service import create_post, all_posts, delete_post_by_id
from ..db.models import User
from ..service.users_service import current_user

post_router = APIRouter(prefix="/posts", tags=["posts"])


# all post
@post_router.get("/all", status_code=status.HTTP_200_OK)
async def get_all_posts(session_db: AsyncSession = Depends(get_session)):
    return await all_posts(db=session_db)


# create post
@post_router.post(
    "/newStory",
    status_code=status.HTTP_201_CREATED,
    response_model=PostResponse,
)
async def create_new_post(
    req_form: PostCreate,
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await create_post(
        post_data=req_form, user_id=curr_user.user_id, db=session_db
    )


# delete post
@post_router.delete("/{post_id}")
async def delete_post(post_id: UUID, session_db: AsyncSession = Depends(get_session)):
    return await delete_post_by_id(post_id=post_id, db=session_db)
