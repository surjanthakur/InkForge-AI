import uvicorn

if __name__ == "__main__":
    uvicorn.run(
        host="localhost",
        port=8000,
        app="src.main:app",
        reload=True,
    )
