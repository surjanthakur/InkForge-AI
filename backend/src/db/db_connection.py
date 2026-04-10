from fastapi import status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, async_sessionmaker
import logging
from typing import AsyncGenerator
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import SQLModel
from ..core.settings import settings

logger = logging.getLogger(__name__)

engine_connect_args = {"ssl": True} if settings.DB_SSL else {}

# engine for the database connection
async_engine: AsyncEngine = create_async_engine(
    settings.DB_URL,
    echo=False,
    pool_size=5,
    max_overflow=10,
    pool_recycle=1800,
    pool_timeout=30,
    connect_args=engine_connect_args,
)

# session factory for managing database sessions
async_session_factory = async_sessionmaker[AsyncSession](
    async_engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
)


async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory() as session:
        try:
            yield session
        except SQLAlchemyError as err:
            await session.rollback()
            logger.error(f"Error while creating session: {err}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="database connection error!",
            )
        finally:
            await session.close()


async def create_db_tables():
    try:
        async with async_engine.begin() as connection:
            await connection.run_sync(SQLModel.metadata.create_all)
    except SQLAlchemyError as err:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating database tables: {err}",
        )
