from fastapi import APIRouter, status, HTTPException, Depends
from fastapi.responses import StreamingResponse
from ..service.users_service import current_user
from ..db.models import User
from ..service.ai_service import ai_stream_response

aiRouter = APIRouter(tags=["Chatbot"], prefix="/chatbot")


@aiRouter.post("/msg/stream", status_code=status.HTTP_200_OK)
async def chatbot(
    user_query: str,
    curr_user: User = Depends(current_user),
):
    return await ai_stream_response(user_input=user_query, username=curr_user.username)
