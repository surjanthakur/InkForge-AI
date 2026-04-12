import logging
import time

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from .db.db_connection import create_db_tables
from .db.redis_client import check_redis_connection, close_redis_connection
from .router import chatbot_router, users_router, posts_router
from src.core.settings import settings
from src.core.logging import setup_logging

setup_logging(level=settings.LOG_LEVEL, app_name="ez-write")
logger = logging.getLogger(__name__)


# function connect to db before starting app
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # creating db tables
        await create_db_tables()
        await check_redis_connection()
        print("db and redis connection successfully")
        yield
    except Exception as err:
        logger.warning(msg=f"Startup failed: {err}")
        raise RuntimeError(f"Startup failed: {err}")
    finally:
        await close_redis_connection()


# creating app
app = FastAPI(
    lifespan=lifespan,
    title="EZ-write",
    version="1.0",
    docs_url=None,
)


# cors middleware ------------>
app.add_middleware(
    CORSMiddleware,
    allow_origins=settings.CORS_ORIGIN_URL,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# logging middleware ------------->
@app.middleware("http")
async def log_requests(request: Request, call_next):
    start = time.time()
    response = await call_next(request)
    duration = time.time() - start
    print(f"{request.method} {request.url} took {duration:.2f}seconds.🌏")
    return response


# global exceptions handler ----------->
@app.exception_handler(Exception)
async def global_exception_handler(req: Request, exc: Exception):
    logger.exception(msg=f"error accour while executing api req : =>  {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "internal error try sometime later", "success": False},
    )


# global HTTP exceptions handlers ----------->
@app.exception_handler(HTTPException)
async def http_exception_handler(req: Request, exc: HTTPException):
    logger.warning(
        msg=f"error whiile executing {req.method} REQUEST on URL:{req.url} /// {exc.detail}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
        },
    )


# health check route
@app.get("/heath", status_code=200)
def health_checks_route():
    return {"status": "ok"}


# all services routers ---------->
app.include_router(router=users_router.user_router, prefix="/api")
app.include_router(router=posts_router.post_router, prefix="/api")
app.include_router(router=chatbot_router.ai_router, prefix="/api")
