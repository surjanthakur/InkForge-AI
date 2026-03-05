from uuid import UUID
from ..db.models import Post
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import Uuid, select
from sqlalchemy.orm import selectinload


async def get_all_posts(db: AsyncSession):
    query = await db.exec(select(Post))
    return query.all()


async def post_by_id(post_id: UUID, db: AsyncSession):
    query = await db.exec(select(Post).where(Post.post_id == post_id))
    return query.first()
