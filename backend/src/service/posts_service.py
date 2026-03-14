import logging
from uuid import UUID
from ..db.models import Post, postType
from ..schemas.posts import PostCreate
from sqlmodel.ext.asyncio.session import AsyncSession
from fastapi import status, HTTPException
from fastapi.responses import FileResponse
from sqlalchemy.exc import SQLAlchemyError
from ..repository.posts_repo import post_by_id, get_posts_by_query
from ..db.models import Post
from .pdf_template import pdf_template_structure
from playwright.async_api import async_playwright
import tempfile


logger = logging.getLogger(__name__)


#  Search posts by query string
async def search_posts(db: AsyncSession, query: str, user_id: UUID) -> Post:
    try:
        # Step 1: Use the posts repository to find posts matching the query and user ID
        posts = await get_posts_by_query(db=db, query=query, user_id=user_id)
        # Step 2: If no posts are found, raise a 404 Not Found HTTPException
        if not posts:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND,
                detail=f"No posts found for query: '{query}'",
            )
        # Step 3: Return the list of found posts
        return posts

    except SQLAlchemyError as error:
        # Step 4: Handle database/SQL errors by rolling back and logging, then raise 500 error
        await db.rollback()
        logger.error(f"SQLAlchemyError while searching posts: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Database error occurred while searching posts, please try again later.",
        )
    except Exception as error:
        # Step 5: Handle any other unexpected errors by rolling back and logging, then raise a generic 500 error
        await db.rollback()
        logger.error(f"Failed to search posts: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error searching posts, please try again later.",
        )


#  Create a new post
async def create_post(post_data: PostCreate, user_id: UUID, db: AsyncSession) -> dict:

    # Step 1: Create a new Post ORM object from the provided PostCreate schema and user_id
    new_post = Post(
        user_id=user_id,
        title=post_data.title,
        content=post_data.content,
        post_type=postType(post_data.post_type.value),
    )
    try:
        # Step 2: Add the new post to the session and commit transaction to save in database
        db.add(new_post)
        await db.commit()
        # Step 3: Refresh the instance with DB state (e.g., to get DB-generated values)
        await db.refresh(new_post)

        # Step 4: Return a success confirmation as a dict
        return {"detail": "post created sucessfully", "success": True}

    except SQLAlchemyError as error:
        # Step 5: Handle DB integrity or commit errors by rolling back, logging, and raising 500 error
        await db.rollback()
        logger.error(f"create_post failed for user_id={user_id}:=> {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, please try again!",
        )
    except Exception as error:
        # Step 6: Handle unexpected errors by rolling back, logging, and raising a generic 500 error
        await db.rollback()
        logger.error(f"Unexpected error in create_post for user_id={user_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error occurred while creating the post. Please try again later.",
        )


# get post by ID
async def fetch_single_post(post_id: UUID, db: AsyncSession):
    try:
        post = await post_by_id(post_id=post_id, db=db)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="post not found!"
            )
        return post
    except SQLAlchemyError as err:
        await db.rollback()
        logging.error(f"fething post failed for id {post_id} : => {err}")
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Something went wrong, please try again!",
        )
    except Exception as err:
        await db.rollback()
        logger.error(f"unexpected error in fetching post: {post_id} :=> {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="error occurred while fetching the post. Please try again later.",
        )


# Delete a post by its ID and user ID
async def delete_post_by_id(post_id: UUID, db: AsyncSession, user_id: UUID) -> dict:
    try:

        # Step 1: Fetch the post by its ID using the posts repository
        post = await post_by_id(post_id=post_id, db=db)

        # Step 2: If the post is not found, raise a 404 Not Found HTTPException
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="Post not found."
            )

        # Step 3: Check that the requesting user is the owner of the post; otherwise, raise 403
        if post.user_id != user_id:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Not authorized to delete this post.",
            )

        # Step 4: Delete the post and commit the transaction
        await db.delete(post)
        await db.commit()

        # Step 5: Return a success confirmation as a dict
        return {"detail": "Post deleted successfully", "success": True}

    except SQLAlchemyError as error:
        # Step 6: Handle DB errors, log the error, rollback, and raise a 500 error
        logger.error(f"SQLAlchemyError while deleting post {post_id}: {error}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="A database error occurred while deleting the post. Please try again later.",
        )
    except Exception as error:
        # Step 7: Handle unexpected errors, log, rollback, and raise a generic 500 error
        logger.error(f"Failed to delete post {post_id}: {error}")
        await db.rollback()
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="An error occurred while deleting the post. Please try again later.",
        )


# generate pdf from post
async def generate_pdf_from_html(post_id: UUID, db: AsyncSession, curr_username: str):
    try:
        post = await post_by_id(post_id=post_id, db=db)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="post not found!"
            )

        html_template = pdf_template_structure(
            post_content=post.content,
            post_title=post.title,
            post_created_fmt=post.created_at.strftime("%-d-%b-%Y"),
            post_user=curr_username,
        )

        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        pdf_path = temp_file.name
        temp_file.close()

        async with async_playwright() as playwrite:
            browser = await playwrite.chromium.launch()
            pdf_page = await browser.new_page()

            await pdf_page.set_content(html=html_template, wait_until="networkidle")
            await pdf_page.pdf(path=pdf_path, format="A4", print_background=True)
            await browser.close()

        return FileResponse(
            path=pdf_path,
            status_code=200,
            media_type="application/pdf",
            filename=f"{post.post_id}.pdf",
        )
    except HTTPException:
        raise
    except Exception as err:
        await db.rollback()
        logger.error(f"unexpected error accour while generating pdf:=> {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something wrong try again",
        )
