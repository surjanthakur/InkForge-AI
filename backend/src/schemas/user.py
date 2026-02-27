from pydantic import BaseModel
from typing import List, Optional
from datetime import datetime


# * request model for creating a new user
class UserCreate(BaseModel):
    username: str
    email: str
    password: str


# * response model for user data (excluding password)
class UserResponse(BaseModel):
    username: str
    email: str
    created_at: datetime

    class Config:
        from_attributes = True
