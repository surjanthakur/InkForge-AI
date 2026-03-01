from ..db.models import User
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlmodel import select
from sqlalchemy.orm import selectinload


# get user by email
async def user_by_email(email, db: AsyncSession):
    query = await db.exec(select(User).where(User.email == email))
    return query.first()


async def user_by_id(id, db: AsyncSession):
    query = await db.exec(
        select(User).options(selectinload(User.posts)).where(User.user_id == id)
    )
    return query.first()
