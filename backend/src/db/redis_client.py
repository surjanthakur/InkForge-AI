import redis.asyncio
from dotenv import load_dotenv
import os

load_dotenv()

rds_password = os.getenv("REDIS_PASSWORD")
rds_url = os.getenv("REDIS_URL")

redis_client = redis.asyncio.Redis(
    host=rds_url,
    port=10847,
    decode_responses=True,
    username="surjan",
    password=rds_password,
)
