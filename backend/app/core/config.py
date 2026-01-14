"""
Configuration and database setup.
"""

from functools import lru_cache
from pydantic_settings import BaseSettings, SettingsConfigDict
from pydantic import Field
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, Session
from typing import Generator


class Settings(BaseSettings):
    """Application configuration from environment variables."""
    
    # Database
    database_url: str = Field(..., env="DATABASE_URL")
    
    # Reddit API
    reddit_client_id: str = Field(..., env="REDDIT_CLIENT_ID")
    reddit_client_secret: str = Field(..., env="REDDIT_CLIENT_SECRET")
    reddit_user_agent: str = Field(default="MarketEcho/1.0", env="REDDIT_USER_AGENT")
    
    # YouTube API
    youtube_api_key: str = Field(..., env="YOUTUBE_API_KEY")
    
    # News API
    news_api_key: str = Field(..., env="NEWS_API_KEY")
    
    # SerpAPI
    serp_api_key: str = Field(..., env="SERP_API_KEY")
    
    # Application
    app_env: str = Field(default="development", env="APP_ENV")
    log_level: str = Field(default="INFO", env="LOG_LEVEL")
    max_mentions_per_source: int = Field(default=100, env="MAX_MENTIONS_PER_SOURCE")
    
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")


@lru_cache()
def get_settings() -> Settings:
    """Get cached settings instance."""
    return Settings()


# Database setup
settings = get_settings()
engine = create_engine(
    settings.database_url,
    pool_pre_ping=True,
    pool_size=10,
    max_overflow=20
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)


def get_db() -> Generator[Session, None, None]:
    """
    Database session dependency for FastAPI.
    
    Usage:
        @app.get("/endpoint")
        def endpoint(db: Session = Depends(get_db)):
            ...
    """
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
