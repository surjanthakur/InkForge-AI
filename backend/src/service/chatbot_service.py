from google import genai
from google.genai import types
from google.genai.errors import ClientError, ServerError, APIError

from fastapi import status, HTTPException
import logging

from ..core.settings import settings
from ..utils.prompts import chatbot_prompt

logger = logging.getLogger(__name__)


# Initialize client
google_client = genai.Client(
    api_key=settings.GOOGLE_API_KEY,
    vertexai=False,
)


async def chatbot_response(
    user_input: str, username: str, content: str, title: str, post_type: str
):
    try:
        # system prompt
        prompt = chatbot_prompt(
            curr_user=username,
            input_query=user_input,
            title=title,
            content=content,
            post_type=post_type,
        )

        response = await google_client.aio.models.generate_content(
            model="gemini-3.1-flash-lite-preview",
            # Proper content structure
            contents=types.Content(role="user", parts=[types.Part(text=user_input)]),
            config=types.GenerateContentConfig(
                thinking_config=types.ThinkingConfig(thinking_budget=0),
                system_instruction=prompt,
                temperature=0.1,  # Set to 0 to disable thinking for speed/cost  or a value like 2048 if you want reasoning
                # Optional but recommended
                max_output_tokens=4088,
            ),
        )

        # if response is empty
        if not response or not response.text:
            logger.warning("Empty response.text from Gemini. check the service ai file")
            raise HTTPException(
                status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
                detail="AI service returned empty response",
            )
        return {"role": "ai", "content": response.text}

    # handle client error
    except ClientError as err:
        logger.error(f"error while generating response: {err}")
        raise HTTPException(
            status_code=status.HTTP_422_UNPROCESSABLE_CONTENT,
            detail="wrong query or format check again and refresh!",
        )

    # handle server error
    except ServerError as err:
        logger.error(msg=f"server error from google api: {err}")
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="server down try again or refresh the page.",
        )

    # handle ApiError error
    except APIError as err:
        logger.error(f"APIError occurred while generating response: {err}")
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail="error on communicating with the AI service. Please try again later.",
        )

    # handle all exception error
    except Exception as err:
        logger.error(f"Error while generating AI response: {err}", exc_info=True)
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="An unexpected error occurred with the AI service. Please try again later",
        )
