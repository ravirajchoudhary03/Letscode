"""Pydantic schemas for API request/response validation."""

from datetime import datetime
from typing import List, Optional
from pydantic import BaseModel, Field


# Base Schemas
class BrandBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=200)
    category_id: int
    keywords: Optional[str] = None


class BrandCreate(BrandBase):
    pass


class BrandResponse(BrandBase):
    id: int
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


# Mention Schemas
class MentionBase(BaseModel):
    text: str
    url: Optional[str] = None
    author: Optional[str] = None
    timestamp: datetime
    engagement_score: float = 0.0
    raw_engagement: int = 0


class MentionResponse(MentionBase):
    id: int
    brand_id: int
    platform_id: int
    collected_at: datetime

    class Config:
        from_attributes = True


# Analytics Schemas
class ShareOfVoiceResponse(BaseModel):
    brand_id: int
    brand_name: str
    category_id: int
    total_mentions: int
    category_total_mentions: int
    share_of_voice: float  # Percentage
    period_start: datetime
    period_end: datetime


class MarketIndexResponse(BaseModel):
    brand_id: int
    brand_name: str
    market_index_score: float  # 0-100
    normalized_mentions: float  # 0-1
    normalized_engagement: float  # 0-1
    platform_coverage: float  # 0-1
    period_start: datetime
    period_end: datetime


class DashboardOverview(BaseModel):
    total_brands: int
    total_mentions: int
    total_platforms: int
    top_brands: List[dict]  # Top 5 by mentions
    platform_distribution: dict  # Mentions per platform
    recent_mentions: List[MentionResponse]


# Ingestion Schemas
class IngestionRequest(BaseModel):
    brand_ids: Optional[List[int]] = None  # If None, ingest all brands
    platforms: Optional[List[str]] = None  # If None, use all platforms
    days_back: int = Field(default=7, ge=1, le=90)


class IngestionResponse(BaseModel):
    status: str
    message: str
    brands_processed: int
    total_mentions_collected: int
    platforms_used: List[str]
    started_at: datetime
    completed_at: Optional[datetime] = None
