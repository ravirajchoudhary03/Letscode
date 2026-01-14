"""
Database models for MarketEcho.

Models:
- Brand: Represents a tracked brand
- Category: Brand categories (e.g., Fashion, Beauty)
- Platform: Data sources (Reddit, YouTube, News, Google)
- Mention: Individual brand mentions from various platforms
- AggregatedMetrics: Pre-computed analytics for performance
"""

from datetime import datetime
from sqlalchemy import Column, Integer, String, DateTime, Float, ForeignKey, Text, Index, UniqueConstraint
from sqlalchemy.orm import relationship
from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base()


class Category(Base):
    """Product/service category for grouping brands."""
    __tablename__ = "categories"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    brands = relationship("Brand", back_populates="category")


class Brand(Base):
    """Brand being tracked for mentions and analytics."""
    __tablename__ = "brands"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(200), nullable=False, unique=True, index=True)
    category_id = Column(Integer, ForeignKey("categories.id"), nullable=False)
    keywords = Column(Text, nullable=True)  # Comma-separated search keywords
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    category = relationship("Category", back_populates="brands")
    mentions = relationship("Mention", back_populates="brand")
    metrics = relationship("AggregatedMetrics", back_populates="brand")


class Platform(Base):
    """Data source platforms (Reddit, YouTube, News, Google)."""
    __tablename__ = "platforms"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(50), unique=True, nullable=False, index=True)
    description = Column(Text, nullable=True)
    is_active = Column(Integer, default=1)  # Boolean as integer
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    mentions = relationship("Mention", back_populates="platform")


class Mention(Base):
    """
    Individual brand mention from any platform.
    Normalized schema for all data sources.
    """
    __tablename__ = "mentions"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False, index=True)
    platform_id = Column(Integer, ForeignKey("platforms.id"), nullable=False, index=True)
    
    # Content
    text = Column(Text, nullable=False)
    url = Column(Text, nullable=True)
    source_id = Column(String(200), nullable=True)  # Platform-specific ID
    
    # Metadata
    author = Column(String(200), nullable=True)
    timestamp = Column(DateTime, nullable=False, index=True)
    
    # Engagement metrics (platform-specific, normalized later)
    engagement_score = Column(Float, default=0.0)  # Normalized 0-1
    raw_engagement = Column(Integer, default=0)  # Actual count (upvotes, views, etc.)
    
    # Deduplication
    content_hash = Column(String(64), nullable=True, index=True)  # SHA-256
    
    # Timestamps
    collected_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    brand = relationship("Brand", back_populates="mentions")
    platform = relationship("Platform", back_populates="mentions")

    # Indexes for common queries
    __table_args__ = (
        Index('ix_mentions_brand_platform_date', 'brand_id', 'platform_id', 'timestamp'),
        UniqueConstraint('platform_id', 'source_id', name='uq_platform_source'),
    )


class AggregatedMetrics(Base):
    """
    Pre-computed analytics for performance.
    Updated periodically by background jobs.
    """
    __tablename__ = "aggregated_metrics"

    id = Column(Integer, primary_key=True, index=True)
    brand_id = Column(Integer, ForeignKey("brands.id"), nullable=False, index=True)
    
    # Time period
    period_start = Column(DateTime, nullable=False)
    period_end = Column(DateTime, nullable=False)
    
    # Counts
    total_mentions = Column(Integer, default=0)
    reddit_mentions = Column(Integer, default=0)
    youtube_mentions = Column(Integer, default=0)
    news_mentions = Column(Integer, default=0)
    google_mentions = Column(Integer, default=0)
    
    # Engagement
    total_engagement = Column(Float, default=0.0)
    avg_engagement = Column(Float, default=0.0)
    
    # Analytics
    share_of_voice = Column(Float, default=0.0)  # Percentage
    market_index_score = Column(Float, default=0.0)  # 0-100
    platform_coverage = Column(Float, default=0.0)  # 0-1 (how many platforms)
    
    # Timestamps
    calculated_at = Column(DateTime, default=datetime.utcnow)
    created_at = Column(DateTime, default=datetime.utcnow)

    # Relationships
    brand = relationship("Brand", back_populates="metrics")

    # Indexes
    __table_args__ = (
        Index('ix_metrics_brand_period', 'brand_id', 'period_start', 'period_end'),
    )
