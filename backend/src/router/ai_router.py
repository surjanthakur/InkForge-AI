from fastapi import APIRouter, status, Depends, HTTPException
from ..service.users_service import current_user
from ..db.models import User
from ..service.ai_service import ai_stream_response
from ..schemas.chatbot import ChatRequest
from fastapi.responses import StreamingResponse
import logging

aiRouter = APIRouter(tags=["Chatbot"], prefix="/chatbot")


@aiRouter.post("/msg/stream", status_code=status.HTTP_200_OK)
async def ai_chatbot(
    user_query: ChatRequest,
    curr_user: User = Depends(current_user),
):
    try:
        response = await ai_stream_response(
            user_input=user_query.message, username=curr_user.username
        )

        return {"role": "ai", "content": response}
    except Exception as err:
        logging.error(f"Chatbot error: {err}")
        raise HTTPException(status_code=500, detail="AI response error")
