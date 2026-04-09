import redis.asyncio
from ..core.settings import settings

redis_client = redis.asyncio.Redis(
    host=settings.REDIS_URL,
    port=settings.REDIS_PORT,
    decode_responses=True,
    username="default",
    password=settings.REDIS_PASSWORD,
)
