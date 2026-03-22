from fastapi import APIRouter, status, Depends, HTTPException
import logging

from ..service.users_service import current_user
from ..db.models import User
from ..service.ai_service import ai_stream_response
from ..schemas.chatbot import ChatRequest


aiRouter = APIRouter(tags=["Chatbot"], prefix="/chatbot")


# api to generate ai response for req
@aiRouter.post(
    "/msg/stream",
    status_code=status.HTTP_200_OK,
    description="Generate an AI-powered response to a user message by streaming interaction to the chatbot. Requires authentication.",
    response_description="Returns the chatbot's AI response to the provided user message.",
)
async def ai_chatbot(
    user_query: ChatRequest,
    curr_user: User = Depends(current_user),
):
    try:
        response = await ai_stream_response(
            user_input=user_query.message,
            username=curr_user.username,
            content_context=user_query.context,
        )

        return {"role": "ai", "content": response}
    except Exception as err:
        logging.error(msg=f"Chatbot error: {err}")
        raise HTTPException(status_code=500, detail="AI response error")
