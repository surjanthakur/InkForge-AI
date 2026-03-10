from sqlmodel import SQLModel, Relationship, Field
from uuid import UUID
import uuid
from sqlalchemy import Column, Text
from datetime import datetime
from pydantic import field_validator
from sqlalchemy.dialects.postgresql import JSONB
from enum import Enum
from typing import List, Optional
from datetime import datetime


# user table
class User(SQLModel, table=True):
    """
    User model representing a user in the system.
    """

    user_id: UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    username: str = Field(unique=True, index=True, min_length=3, max_length=50)
    email: str = Field(unique=True, min_length=5, max_length=255, index=True)
    password: str
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    posts: Optional[List["Post"]] = Relationship(back_populates="owner")

    @field_validator("email")
    @classmethod
    def validate_email(cls, value):
        if "@" not in value:
            raise ValueError("Invalid email address")
        return value


class postType(str, Enum):
    blog = "blog"
    article = "article"


# post table
class Post(SQLModel, table=True):
    """
    Post model representing a post created by a user.
    """

    post_id: UUID = Field(default_factory=uuid.uuid4, primary_key=True, index=True)
    user_id: UUID = Field(
        foreign_key="user.user_id",
        ondelete="CASCADE",
        nullable=False,
        index=True,
    )
    title: str = Field(..., min_length=1, max_length=255)
    content: str = Field(sa_column=Column(Text))
    post_type: postType = Field(index=True)
    created_at: datetime = Field(default_factory=datetime.utcnow, index=True)
    owner: Optional["User"] = Relationship(back_populates="posts")
