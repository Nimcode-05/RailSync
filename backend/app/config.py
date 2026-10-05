import os
from pydantic import BaseModel
from dotenv import load_dotenv

load_dotenv()

class Settings(BaseModel):
    PROJECT_NAME: str = "RailSync - Dynamic Train ETA & Decision Support"
    VERSION: str = "1.0.0"
    API_V1_STR: str = "/api/v1"
    
    # SQLite by default for rapid zero-friction setup; switch to PostgreSQL anytime via .env
    DATABASE_URL: str = os.getenv("DATABASE_URL", "sqlite:///./railsync.db")
    
    CORS_ORIGINS: list[str] = [
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:3000",
    ]

settings = Settings()
