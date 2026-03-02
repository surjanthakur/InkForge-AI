from fastapi import status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, async_sessionmaker
import logging
from typing import AsyncGenerator
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import SQLModel
from dotenv import load_dotenv
import os

load_dotenv()

db_url = os.getenv("DB_URL")

# engine for the database connection
async_engine: AsyncEngine = create_async_engine(
    db_url,
    echo=False,
    connect_args={"timeout": 60, "ssl": True},
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
        except SQLAlchemyError as e:
            await session.rollback()
            logging.error(f"Database error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error",
            )


async def create_db_tables():
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
    except SQLAlchemyError as e:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail=f"Error creating database tables: {e}",
        )
