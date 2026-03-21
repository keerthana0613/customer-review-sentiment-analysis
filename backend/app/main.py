from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes.sentiment_routes import router as sentiment_router

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(sentiment_router, prefix="/api")

@app.get("/")
def home():
    return {"message": "API running"}
from fastapi.middleware.cors import CORSMiddleware

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
