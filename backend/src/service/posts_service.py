import logging
from sqlite3 import dbapi2
from uuid import UUID
from ..db.models import Post, postType
from ..schemas.posts import PostCreate
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import status, HTTPException
from sqlalchemy.exc import IntegrityError, SQLAlchemyError
from ..repository.posts_repo import get_all_posts, post_by_id

logger = logging.getLogger(__name__)


# get all posts
async def all_posts(db: AsyncSession):
    try:
        posts = await get_all_posts(db=db)
    except Exception as error:
        logger.error(f"Failed to fetch posts: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error fetching posts, please try again later.",
        )
    if not posts:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="No posts found.",
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
    except IntegrityError:
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_409_CONFLICT,
            detail="Post already exists for this user!",
        )
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
