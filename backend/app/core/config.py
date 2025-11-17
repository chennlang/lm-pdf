from pydantic_settings import BaseSettings
from typing import Optional

class Settings(BaseSettings):
    # App settings
    app_name: str = "LM PDF Service"
    debug: bool = False
    version: str = "1.0.0"

    # File upload settings
    max_file_size: int = 50 * 1024 * 1024  # 50MB
    allowed_extensions: list = [".pdf"]
    upload_dir: str = "uploads"

    # PDF processing settings
    dpi: int = 200  # Default DPI for PDF to image conversion
    image_format: str = "PNG"  # Default image format
    cache_dir: str = "cache"

    class Config:
        env_file = ".env"

settings = Settings()