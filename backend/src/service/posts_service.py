import logging
import tempfile
import os
from uuid import UUID
from fastapi import status, HTTPException, BackgroundTasks
from fastapi.responses import FileResponse
from sqlalchemy.exc import SQLAlchemyError, IntegrityError
from sqlmodel.ext.asyncio.session import AsyncSession
from playwright.async_api import async_playwright
from typing import List


from ..db.models import Post, postType
from ..schemas.posts import PostCreate
from ..repository.posts_repo import post_by_id, get_posts_by_query
from ..db.models import Post
from ..core.pdf_template import pdf_template_structure


logger = logging.getLogger(__name__)


#  Search posts by query
async def search_posts(db: AsyncSession, query: str, user_id: UUID) -> List[Post]:
    try:
        post = await get_posts_by_query(db=db, query=query, user_id=user_id)

        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="posts not found"
            )
        return post

    except SQLAlchemyError as error:
        await db.rollback()
        logger.error(msg=f"db error while searching posts query: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something went wrong please try again later.",
        )


#  Create a new post
async def create_post(post_data: PostCreate, user_id: UUID, db: AsyncSession) -> dict:
    try:
        new_post = Post(user_id=user_id, **post_data.model_dump())
        db.add(new_post)
        await db.commit()
        await db.refresh(new_post)
        return {"detail": "Post created successfully", "success": True}

    except IntegrityError as err:
        await db.rollback()
        error_msg = str(err.orig)
        if "unique" in error_msg.lower():
            raise HTTPException(status_code=409, detail="Post already exists.")
        elif "foreign key" in error_msg.lower():
            raise HTTPException(
                status_code=400, detail="Referenced resource not found."
            )
        elif "not null" in error_msg.lower():
            raise HTTPException(status_code=400, detail="Missing required field.")
        else:
            logger.exception(f"Unhandled integrity error: {err}")
        raise HTTPException(status_code=400, detail="Data conflict.")

    except SQLAlchemyError as err:
        await db.rollback()
        logger.exception(f"DB error creating post: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, please try again later.",
        )


# Delete a post by its ID and user ID
async def delete_post_by_id(post_id: UUID, user_id: UUID, db: AsyncSession) -> dict:
    try:
        post = await post_by_id(post_id=post_id, db=db)
        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="posts not found"
            )

        if post.user_id != user_id:
            raise PermissionError("Not authorized.")

        await db.delete(post)
        await db.commit()

    except SQLAlchemyError as error:
        await db.rollback()
        logger.error(f"DB error deleting post {post_id}: {error}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Something went wrong, please try again later.",
        )


# generate pdf from post
async def generate_pdf(
    post_id: UUID,
    curr_username: str,
    background_task: BackgroundTasks,
    db: AsyncSession,
):
    try:
        post = await post_by_id(post_id=post_id, db=db)

        if not post:
            raise HTTPException(
                status_code=status.HTTP_404_NOT_FOUND, detail="post not found!"
            )

        # Generate the HTML template for the PDF using post data
        html_template = pdf_template_structure(
            post_content=post.content,
            post_title=post.title,
            post_created_fmt=post.created_at.strftime("%-d-%b-%Y"),
            post_user=curr_username,
        )

        # Create a temporary file to save the generated PDF
        temp_file = tempfile.NamedTemporaryFile(delete=False, suffix=".pdf")
        pdf_path = temp_file.name
        temp_file.close()

        # Use Playwright to launch a headless browser and generate the PDF from the HTML
        async with async_playwright() as playwrite:
            browser = await playwrite.chromium.launch()
            pdf_page = await browser.new_page()

            # Set the HTML content and wait until network is idle
            await pdf_page.set_content(html=html_template, wait_until="networkidle")

            # Generate the PDF and save it to the temporary file location
            await pdf_page.pdf(path=pdf_path, format="A4", print_background=True)

            # Close the browser after PDF generation
            await browser.close()

        background_task.add_task(os.remove, pdf_path)

        #  Return the generated PDF as a file response to the client
        return FileResponse(
            path=pdf_path,
            status_code=200,
            media_type="application/pdf",
            filename=f"{post.post_id}.pdf",
        )
    except SQLAlchemyError as err:
        await db.rollback()
        logger.error(f"Database error occurred while generating PDF: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="database error occurred. Please try again later.",
        )
    except Exception as err:
        await db.rollback()
        logger.error(f"unexpected error accour while generating pdf:=> {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="something wrong try again",
        )
