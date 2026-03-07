import logging
from uuid import UUID
from ..db.models import Post, postType
from ..schemas.posts import PostCreate
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import status, HTTPException
from sqlalchemy.exc import SQLAlchemyError
from ..repository.posts_repo import post_by_id, get_posts_by_query

logger = logging.getLogger(__name__)


# search posts by query
async def search_posts(db: AsyncSession, query: str, user_id: UUID):
    try:
        posts = await get_posts_by_query(db=db, query=query, user_id=user_id)
    except Exception as error:
        logger.error(f"Failed to search posts: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error searching posts, please try again later.",
        )
    if not posts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"No posts found for query: '{query}'",
        )
    return posts


# get posts
async def get_single_post(post_id: UUID, db: AsyncSession):
    try:
        post = await post_by_id(post_id=post_id, db=db)
    except Exception as error:
        logger.error(f"Failed to fetch post {post_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching post, please try again later.",
        )
    if not post:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Post not found.",
        )
    return post


# create new post
async def create_post(post_data: PostCreate, user_id: UUID, db: AsyncSession) -> Post:
    try:
        new_post = Post(
            user_id=user_id,
            title=post_data.title,
            content=post_data.content,
            post_type=postType(post_data.post_type.value),
        )
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        return {"detail": "post created sucessfully", "success": True}
    except SQLAlchemyError as error:
        await db.rollback()
        logger.error(f"create_post failed for user_id={user_id}:=> {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, please try again!",
        )


# delete post
async def delete_post_by_id(post_id: UUID, db: AsyncSession, user_id: UUID):
    try:
        post = await post_by_id(post_id=post_id, db=db)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Post not found."
            )
        if post.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this post.",
            )
        await db.delete(post)
        await db.commit()
        return {"detail": "Post deleted successfully", "success": True}
    except SQLAlchemyError as error:
        logger.error(f"SQLAlchemyError while deleting post {post_id}: {error}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A database error occurred while deleting the post. Please try again later.",
        )
    except Exception as error:
        logger.error(f"Failed to delete post {post_id}: {error}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the post. Please try again later.",
        )
