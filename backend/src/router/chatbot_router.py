from fastapi import APIRouter, status, Depends

from ..service.users_service import current_user
from ..db.models import User
from ..service.chatbot_service import chatbot_response
from ..schemas.chatbot import ChatRequest

ai_router = APIRouter(tags=["Chatbot"], prefix="/chatbot")


# api to generate ai response for req
@ai_router.post("/messages", status_code=status.HTTP_200_OK)
async def ai_chatbot(
    user_data: ChatRequest,
    curr_user: User = Depends(current_user),
):
    return await chatbot_response(
        title=user_data.title,
        content=user_data.context,
        user_input=user_data.user_query,
        post_type=user_data.post_type,
        username=curr_user.username,
    )
