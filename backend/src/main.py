from fastapi import FastAPI
from .db.db_connection import create_db_tables
import logging
from fastapi.middleware.cors import CORSMiddleware
from .router import users_router


# list of all, we need to create the database tables before the application starts.
# We can use the lifespan event of FastAPI to achieve this.
# The lifespan event allows us to run code before the application starts and after it shuts down.
async def lifespan(app: FastAPI):
    try:
        create_db_tables()
        yield
    except Exception:
        logging.error(f"Error during application startup")
        raise

    logging.info("Application shutdown.....")


app = FastAPI(lifespan=lifespan)

origins = ["http://localhost:5173"]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(router=users_router.user_router, prefix="/api/v1.0")
