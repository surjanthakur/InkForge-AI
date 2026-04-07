from pydantic import BaseModel
from typing import Optional


class ChatRequest(BaseModel):
    title: str[Optional]
    post_type: str[Optional]
    context: str[Optional]
    user_query: str[Optional]
