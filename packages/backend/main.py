from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware # <--- ADD THIS LINE
from pydantic import BaseModel

from app.api.v1 import gateway, logs, auth

# Define a Pydantic model for your response
class MessageResponse(BaseModel):
    message: str

# Create your FastAPI application instance
app = FastAPI()

# --- CORS (Cross-Origin Resource Sharing) Configuration ---
# This middleware allows your frontend (or the /docs page) to make requests
# to your backend, even if they are on different origins (e.g., different ports).
# For local development, allowing localhost:8000 is usually sufficient.
# If you later deploy a separate frontend, you'll add its URL here.
origins = [
    "http://localhost",
    "http://localhost:8000",
    # You can add other specific origins here if needed, e.g.:
    # "http://localhost:3000", # If your frontend runs on React's default port
    # "http://127.0.0.1:8000", # Sometimes 127.0.0.1 is used instead of localhost
    # For a very broad (but less secure for production) development setup, you could use "*"
    # WARNING: Do NOT use "*" in production unless you fully understand the security implications.
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,          # Specifies which origins are allowed to make requests
    allow_credentials=True,         # Allows cookies to be included in cross-origin requests
    allow_methods=["*"],            # Allows all standard HTTP methods (GET, POST, PUT, DELETE, OPTIONS)
    allow_headers=["*"],            # Allows all headers in cross-origin requests
)
# --- END CORS Configuration ---

# It tells the main app to use all the endpoints you defined in your router files.
print("Including API routers...")
app.include_router(gateway.router)
app.include_router(logs.router)
print("Routers included successfully.")


# Define a simple root endpoint
# Use response_model to tell FastAPI what the expected output structure is
@app.get("/", response_model=MessageResponse)
async def read_root():
    """
    Reads the root endpoint and returns a welcome message.
    """
    return {"message": "Welcome to Nova Backend! FastAPI is running."}

# You can add more endpoints here later
# Example of another endpoint (uncomment and implement if needed):
# @app.get("/items/{item_id}", response_model=MessageResponse)
# async def read_item(item_id: int):
#     return {"message": f"You requested item with ID: {item_id}"}
