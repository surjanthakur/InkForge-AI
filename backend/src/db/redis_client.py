import logging
from redis.asyncio import RedisCluster
from redis.exceptions import RedisError
from ..core.settings import settings

logger = logging.getLogger(__name__)

redis_client = RedisCluster(
    host=settings.REDIS_HOST,
    port=settings.REDIS_PORT,
    username=settings.REDIS_USERNAME,
    password=settings.REDIS_PASSWORD,
    decode_responses=True,
    socket_connect_timeout=5,
    socket_timeout=5,
    retry_on_timeout=True,
    health_check_interval=30,
    max_connections=20,
    ssl=True,
    ssl_cert_reqs="required",
)


#  check redis connection
async def check_redis_connection() -> None:
    try:
        await redis_client.ping()
        logger.info("Redis connection established successfully.")
    except RedisError as err:
        logger.exception("Redis connection failed: %s", err)
        raise RuntimeError("Redis is unavailable.") from err


# close the redis connection
async def close_redis_connection() -> None:
    try:
        await redis_client.aclose()
        logger.info("Redis connection closed successfully.")
    except RedisError as err:
        logger.warning("Error while closing Redis connection: %s", err)
