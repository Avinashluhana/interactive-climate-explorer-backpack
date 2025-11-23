from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.datasets import router as datasets_router

app = FastAPI(title="Climate Explorer API")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(datasets_router, prefix="/api", tags=["datasets"])


@app.get("/")
def root():
    return {"message": "Climate Explorer API is running"}
