from fastapi import status, HTTPException
from sqlmodel.ext.asyncio.session import AsyncSession
from sqlalchemy.ext.asyncio import AsyncEngine, create_async_engine, async_sessionmaker
import logging
from pydantic_settings import BaseSettings, SettingsConfigDict
from typing import AsyncGenerator
from sqlalchemy.exc import SQLAlchemyError
from sqlmodel import SQLModel

logger = logging.getLogger(__name__)


# Database connection and session management
class Settings(BaseSettings):
    db_url: str

    model_config = SettingsConfigDict(
        env_file=".env",
        case_sensitive=False,
        extra="allow",
    )


settings = Settings()

# Create an asynchronous engine for the database connection
async_engine: AsyncEngine = create_async_engine(
    settings.db_url,
    echo=False,
    connect_args={"timeout": 60, "ssl": True},
)

# Create an asynchronous session factory for managing database sessions
async_session_factory = async_sessionmaker(
    async_engine,
    class_=AsyncSession,
    autoflush=False,
    expire_on_commit=False,
)


# Dependency function to get an asynchronous database session for use in FastAPI endpoints.
# it ensures that the session is properly closed after use and handles any database errors by rolling back the transaction and returning an appropriate HTTP response.
async def get_session() -> AsyncGenerator[AsyncSession, None]:
    async with async_session_factory().begin() as session:
        try:
            yield session
        except SQLAlchemyError as e:
            logger.error(f"Database error: {e}")
            raise HTTPException(
                status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                detail="Database error",
            )


# Function to create database tables based on the defined SQLModel models.
# It uses the asynchronous engine to execute the table creation and logs the success or any errors that occur during the process.
# If an error occurs, it raises an HTTPException with a 500 status code.
async def create_db_tables():
    try:
        async with async_engine.begin() as conn:
            await conn.run_sync(SQLModel.metadata.create_all)
            logger.info("Database tables created successfully.")
    except SQLAlchemyError as e:
        logger.error(f"Error creating database tables: {e}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Error creating database tables",
        )
