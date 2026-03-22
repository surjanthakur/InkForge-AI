from dotenv import load_dotenv
import os
from groq import AsyncGroq
from ..core.prompts import chatbot_prompt

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
        max_completion_tokens=8192,
        top_p=1,
        reasoning_effort="low",
        stop=None,
    )
    return response.choices[0].message.content
