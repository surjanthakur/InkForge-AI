from pydantic import BaseModel, Field, EmailStr, field_validator
from typing import List
from .posts import PostResponse
import re


class UserCreate(BaseModel):
    username: str = Field(
        ...,
        min_length=3,
        max_length=30,
        description="Username between 3 and 30 characters",
    )
    email: EmailStr
    password: str = Field(
        ..., min_length=4, max_length=128, description="Password must be strong"
    )

    @field_validator("username")
    @classmethod
    def validate_username(cls, v: str):
        v = v.strip()
        if not re.match(r"^[a-zA-Z0-9_]+$", v):
            raise ValueError(
                "Username can only contain letters, numbers, and underscores"
            )
        return v

    @field_validator("password")
    @classmethod
    def validate_password(cls, v: str):
        if not re.search(r"[A-Z]", v):
            raise ValueError("Password must contain at least one uppercase letter")
        if not re.search(r"[a-z]", v):
            raise ValueError("Password must contain at least one lowercase letter")
        if not re.search(r"\d", v):
            raise ValueError("Password must contain at least one number")
        return v


class LoginRequest(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=4, description="enter your password")


class currentUserResponse(BaseModel):
    username: str
    email: EmailStr
    posts: List[PostResponse] = []
    created_at: str
