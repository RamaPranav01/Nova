from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.core.config import settings
from app.api.v1 import auth


app = FastAPI(
    title=settings.PROJECT_NAME,
    description="Aegis: The AI Security & Trust Gateway",
    openapi_url=f"{settings.API_V1_STR}/openapi.json"
)

origins = [
    "http://localhost:8000",
    "http://localhost:3000",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix=settings.API_V1_STR, tags=["Authentication"])

@app.get("/", tags=["Health Check"])
def read_root():
    return {"message": "Aegis Gateway API is operational."}