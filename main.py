from fastapi import FastAPI
from routes.datasets import router as datasets_router

app = FastAPI(title="Climate Data Explorer API")

app.include_router(datasets_router, prefix="/api")

@app.get("/")
def root():
    return {"message": "Welcome to the Climate Data Explorer API"}
