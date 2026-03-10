from uuid import UUID
from ..db.models import Post
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from uuid import UUID


# get posts by search query for current user
async def get_posts_by_query(db: AsyncSession, query: str, user_id: UUID):
    stmt = select(Post).where(Post.user_id == user_id)

    if query and query.lower() != "all":
        query_lower = query.lower()

        if query_lower in ["blog", "article"]:
            stmt = stmt.where(Post.post_type == query_lower)

    result = await db.exec(stmt.order_by(Post.created_at.desc()))
    return result.all()


# get posts by post id
async def post_by_id(post_id: UUID, db: AsyncSession):
    query = await db.exec(select(Post).where(Post.post_id == post_id))
    return query.first()
