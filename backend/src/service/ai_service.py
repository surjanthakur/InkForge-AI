from dotenv import load_dotenv
import os
import logging
from groq import AsyncGroq
from fastapi import status, HTTPException
from ..utils.prompts import chatbot_prompt

load_dotenv()


groq_key = os.getenv("GROQ_API_KEY")

client = AsyncGroq(api_key=groq_key)


async def ai_stream_response(
    user_input: str,
    username: str,
    content: str,
    title: str,
    post_type: str,
):
    try:

        prompt = chatbot_prompt(
            curr_user=username,
            input_query=user_input,
            title=title,
            content=content,
            post_type=post_type,
        )

        response = await client.chat.completions.create(
            model="openai/gpt-oss-120b",
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": user_input},
            ],
            temperature=0.95,
            stream=False,
            max_completion_tokens=8192,
            top_p=1,
            reasoning_effort="medium",
            stop=None,
        )
        return response.choices[0].message.content
    except Exception as err:
        logging.error(msg=f"error while generating response: {err}")
        raise HTTPException(
            status_code=status.HTTP_503_SERVICE_UNAVAILABLE,
            detail="something went wrong !",
        )
