from fastapi import status, HTTPException, Request
from fastapi.responses import RedirectResponse
from sqlalchemy.ext.asyncio.session import AsyncSession
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv
import os

load_dotenv()

google_client_id = os.getenv("GOOGLE_CLIENT_ID")
google_client_secret = os.getenv("GOOGLE_CLIENT_SECRET")

oauth = OAuth()

oauth.register(
    name="google",
    client_id=google_client_id,
    client_secret=google_client_secret,
    authorize_url="https://accounts.google.com/o/oauth2/auth",
    access_token_url="https://oauth2.googleapis.com/token",
    client_kwargs={"scope": "openid email profile"},
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
)
