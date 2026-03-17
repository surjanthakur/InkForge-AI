from fastapi import APIRouter, status, Depends, HTTPException
from ..service.users_service import current_user
from ..db.models import User
from ..service.ai_service import ai_stream_response
from fastapi.responses import StreamingResponse
import logging

aiRouter = APIRouter(tags=["Chatbot"], prefix="/chatbot")


@aiRouter.post("/msg/stream", status_code=status.HTTP_200_OK)
async def chatbot(
    user_query: str,
    curr_user: User = Depends(current_user),
):
    try:
        return StreamingResponse(
            ai_stream_response(user_input=user_query, username=curr_user.username),
            media_type="text/event-stream",
        )
    except Exception as err:
        logging.error(f"Chatbot error: {err}")
        raise HTTPException(status_code=500, detail="AI response error")
