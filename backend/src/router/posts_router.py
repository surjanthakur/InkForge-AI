from uuid import UUID
from fastapi import APIRouter, Depends, status, BackgroundTasks
from sqlmodel.ext.asyncio.session import AsyncSession

from ..db.models import User
from ..service.users_service import current_user
from ..db.db_connection import get_session
from ..schemas.posts import PostCreate
from ..service.posts_service import (
    create_post,
    search_posts,
    delete_post_by_id,
    generate_pdf,
)

# router
post_router = APIRouter(prefix="/posts", tags=["posts"])


# get all posts of user
@post_router.get("/all", status_code=status.HTTP_200_OK)
async def search_posts_by_query(
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await search_posts(db=session_db, user_id=curr_user.user_id)


# create new posts
@post_router.post("/newStory", status_code=status.HTTP_201_CREATED)
async def create_new_post(
    req_form: PostCreate,
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await create_post(
        post_data=req_form, user_id=curr_user.user_id, db=session_db
    )


# delete posts
@post_router.delete("/delete/{post_id}", status_code=status.HTTP_204_NO_CONTENT)
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


# download posts fPDF format
@post_router.get("/download/{post_id}/pdf", status_code=status.HTTP_200_OK)
async def download_as_pdf(
    background_task: BackgroundTasks,
    post_id: UUID,
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await generate_pdf(
        post_id=post_id,
        db=session_db,
        curr_username=curr_user.username,
        background_task=background_task,
    )
