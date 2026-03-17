from dotenv import load_dotenv
import os
from groq import AsyncGroq
from ..core.prompts import chatbot_prompt

load_dotenv()


groq_key = os.getenv("GROQ_API_KEY")


async def ai_stream_response(user_input: str, username: str):
    client = AsyncGroq(api_key=groq_key)
    prompt = chatbot_prompt(curr_user=username)

    stream = await client.chat.completions.create(
        model="openai/gpt-oss-120b",
        messages=[
            {"role": "system", "content": prompt},
            {"role": "user", "content": user_input},
        ],
        stream=True,
        temperature=0.95,
        max_completion_tokens=8192,
        top_p=1,
        reasoning_effort="low",
        response_format={"type": "json_object"},
        stop=None,
        tools=[{"type": "browser_search"}],
    )
    async for chunk in stream:
        content = chunk.choices[0].delta.content or ""
        if content:
            yield content  # ✅ stream chunk-by-chunk
