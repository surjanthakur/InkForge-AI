from pydantic import BaseModel
from typing import Optional
from datetime import datetime


# Request model for creating a new post
class PostCreate(BaseModel):
    title: str
    description: Optional[str]
    content: str
    post_type: str


# Response model for a single post
class PostResponse(BaseModel):
    title: str
    description: Optional[str]
    content: str
    post_type: str
    created_at: datetime

    class Config:
        from_attributes = True
