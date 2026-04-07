import logging
import time
import uvicorn

from fastapi.middleware.cors import CORSMiddleware
from fastapi import FastAPI, Request, status, HTTPException
from fastapi.responses import JSONResponse
from contextlib import asynccontextmanager

from .db.db_connection import create_db_tables
from .router import users_router, posts_router, ai_router


# function connect to db before starting app
@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        # creating db tables
        await create_db_tables()
        print("db connection successfully 👍🏻🎊")
        yield

    # handle all Exception errors
    except Exception as err:
        logging.error(msg=f"Error creating database tables: {err}")
        raise RuntimeError(f"Error creating database tables: {err}")


# creating app
app = FastAPI(lifespan=lifespan, title="Inkforge.ai", version="1.0")

origins = ["http://localhost:5173"]


# cors middleware ------------>
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
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
    logging.exception(msg=f"error accour while executing api req : =>  {str(exc)}")
    return JSONResponse(
        status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        content={"detail": "internal error try sometime later", "success": False},
    )


# global HTTP exceptions handlers ----------->
@app.exception_handler(HTTPException)
async def http_exception_handler(req: Request, exc: HTTPException):
    logging.error(
        msg=f"error whiile executing {req.method} REQUEST on URL:{req.url} /// {exc.detail}"
    )
    return JSONResponse(
        status_code=exc.status_code,
        content={
            "success": False,
            "detail": exc.detail,
        },
    )


# all services routers ---------->
app.include_router(router=users_router.user_router, prefix="/api")
app.include_router(router=posts_router.post_router, prefix="/api")
app.include_router(router=ai_router.aiRouter, prefix="/api")
