from pydantic import BaseModel, Field
from datetime import datetime
from enum import Enum
from uuid import UUID


class PostType(str, Enum):
    article = "article"
    blog = "blog"


# Request model for creating a new post
class PostCreate(BaseModel):
    title: str = Field(..., min_length=5, max_length=400)
    content: str = Field(..., min_length=10)
    post_type: PostType


# Response model for a single post
class PostResponse(BaseModel):
    post_id: UUID
    title: str
    content: str
    post_type: PostType
    created_at: datetime

    class Config:
        from_attributes = True
