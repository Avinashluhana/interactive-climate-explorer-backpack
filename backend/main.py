from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.datasets import router as datasets_router

app = FastAPI(title="Climate Explorer API", version="1.0")

# CORS (allow frontend during development)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to exact origin in production
    allow_methods=["*"],
    allow_headers=["*"],
    allow_credentials=True,
)

app.include_router(datasets_router, prefix="/api", tags=["datasets"])


@app.get("/")
def root():
    return {"message": "Climate Explorer API is running"}
