from uuid import UUID
from fastapi import APIRouter, Depends, status, Query
from ..db.db_connection import get_session
from sqlmodel.ext.asyncio.session import AsyncSession
from ..schemas.posts import PostCreate, PostResponse
from ..service.posts_service import (
    create_post,
    search_posts,
    delete_post_by_id,
    download_post_as_pdf,
)
from ..db.models import User
from ..service.users_service import current_user

post_router = APIRouter(prefix="/posts", tags=["posts"])


# posts by query
@post_router.get("/search", status_code=status.HTTP_200_OK)
async def search_posts_by_query(
    query: str = Query(..., min_length=1, description="Search query for posts"),
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await search_posts(db=session_db, query=query, user_id=curr_user.user_id)


# create post
@post_router.post(
    "/newStory",
    status_code=status.HTTP_201_CREATED,
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
@post_router.delete("/delete/{post_id}", status_code=status.HTTP_200_OK)
async def delete_post(
    post_id: UUID,
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await delete_post_by_id(
        post_id=post_id,
        db=session_db,
        user_id=curr_user.user_id,
    )


# download post as pdf
@post_router.get("/{post_id}/download/pdf")
async def download_as_pdf(
    post_id: UUID, session_db: AsyncSession = Depends(get_session)
):
    return await download_post_as_pdf(post_id=post_id, db=session_db)
