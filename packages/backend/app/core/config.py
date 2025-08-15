from pathlib import Path
from pydantic_settings import BaseSettings, SettingsConfigDict

# --- THIS IS THE FOOLPROOF PATH LOGIC ---
# 1. Get the path to the current file (config.py)
#    e.g., C:\Nova\Nova\packages\backend\app\core\config.py
current_file_path = Path(__file__)

# 2. Get the path to the 'backend' directory by going up three levels
#    .parent -> core
#    .parent.parent -> app
#    .parent.parent.parent -> backend
backend_root_path = current_file_path.parent.parent.parent

# 3. Build the full, absolute path to the .env file
#    e.g., C:\Nova\Nova\packages\backend\.env
env_file_path = backend_root_path / ".env"
# -----------------------------------------


class Settings(BaseSettings):
    """
    Manages all application settings using an absolute path to the .env file.
    """
    # Use the absolute path we just calculated.
    model_config = SettingsConfigDict(env_file=env_file_path, env_file_encoding='utf-8')

    # Security settings
    SECRET_KEY: str
    ACCESS_TOKEN_EXPIRE_MINUTES: int
    
    # Database settings
    DATABASE_URL: str

    # Application settings
    PROJECT_NAME: str
    API_V1_STR: str

# Create the single, reusable instance of the settings.
settings = Settings()