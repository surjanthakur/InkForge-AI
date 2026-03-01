from fastapi import FastAPI, HTTPException
from .db.db_connection import create_db_tables
from fastapi.middleware.cors import CORSMiddleware
from .router import users_router


# list of all, we need to create the database tables before the application starts.
# We can use the lifespan event of FastAPI to achieve this.
# The lifespan event allows us to run code before the application starts and after it shuts down.
async def lifespan(app: FastAPI):
    try:
        await create_db_tables()
        print("Database tables created successfully.")

        yield
    except Exception:
        raise HTTPException(status_code=500, detail="Error creating database tables")


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
