from fastapi import FastAPI, Request
from .db.db_connection import create_db_tables
from fastapi.middleware.cors import CORSMiddleware
from .router import users_router, posts_router
import logging
import time


async def lifespan(app: FastAPI):
    try:
        await create_db_tables()
        yield
    except Exception as err:
        logging.error(f"Error creating database tables: {err}")
        raise RuntimeError(f"Error creating database tables: {err}")


app = FastAPI(lifespan=lifespan)

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
    logging.info(f"{request.method} {request.url} took {duration:.2f}seconds.🌏")
    return response


app.include_router(router=users_router.user_router, prefix="/api/v1.0")
app.include_router(router=posts_router.post_router, prefix="/api/v1.0")
