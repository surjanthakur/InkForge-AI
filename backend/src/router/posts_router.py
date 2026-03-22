from uuid import UUID
from fastapi import APIRouter, Depends, status, Query, BackgroundTasks, HTTPException
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


# search query for posts
@post_router.get(
    "/search",
    status_code=status.HTTP_200_OK,
    description="Fetches posts matching the provided search query for the authenticated user.",
    response_description="A list of posts matching the provided search query.",
)
async def search_posts_by_query(
    query: str = Query(..., min_length=3, description="Search query for posts"),
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await search_posts(db=session_db, query=query, user_id=curr_user.user_id)


# create new posts
@post_router.post(
    "/newStory",
    status_code=status.HTTP_201_CREATED,
    description="Create a new story post for the authenticated user.",
    response_description="The created story post.",
)
async def create_new_post(
    req_form: PostCreate,
    session_db: AsyncSession = Depends(get_session),
    curr_user: User = Depends(current_user),
):
    return await create_post(
        post_data=req_form, user_id=curr_user.user_id, db=session_db
    )


# delete posts
@post_router.delete(
    "/delete/{post_id}",
    status_code=status.HTTP_204_NO_CONTENT,
    description="Delete a post by its ID for the authenticated user.",
    response_description="Confirmation of deleted post.",
)
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


# download posts as PDF format
@post_router.get(
    "/download/{post_id}/pdf",
    status_code=status.HTTP_200_OK,
    description="Download the specified post as a PDF file.",
    response_description="PDF file containing the specified post.",
)
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
