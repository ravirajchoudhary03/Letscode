"""
Data ingestion service.

Orchestrates data collection from all providers and stores in database.
"""

from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.providers.reddit import RedditProvider
from app.providers.youtube import YouTubeProvider
from app.providers.news import NewsProvider
from app.providers.google_search import GoogleSearchProvider
from app.models.database import Brand, Platform, Mention
from app.core.config import get_settings


class IngestionService:
    """
    Orchestrates data ingestion from multiple sources.
    
    Responsibilities:
    - Initialize providers with API keys
    - Fetch data from each source
    - Normalize and deduplicate
    - Store in database
    """
    
    def __init__(self, db: Session):
        """
        Initialize ingestion service.
        
        Args:
            db: Database session
        """
        self.db = db
        settings = get_settings()
        
        # Initialize providers
        self.providers = {
            'Reddit': RedditProvider(
                client_id=settings.reddit_client_id,
                client_secret=settings.reddit_client_secret,
                user_agent=settings.reddit_user_agent
            ),
            'YouTube': YouTubeProvider(api_key=settings.youtube_api_key),
            'News': NewsProvider(api_key=settings.news_api_key),
            'Google': GoogleSearchProvider(api_key=settings.serp_api_key)
        }
    
    def ingest_brand(
        self,
        brand_id: int,
        days_back: int = 7,
        platforms: List[str] = None
    ) -> int:
        """
        Ingest mentions for a single brand.
        
        Args:
            brand_id: Brand to ingest
            days_back: How many days of data to fetch
            platforms: List of platform names (None = all)
            
        Returns:
            Number of new mentions collected
        """
        # Get brand and keywords
        brand = self.db.query(Brand).filter(Brand.id == brand_id).first()
        if not brand:
            raise ValueError(f"Brand {brand_id} not found")
        
        # Determine search keyword
        keywords = brand.keywords.split(',') if brand.keywords else [brand.name]
        primary_keyword = keywords[0].strip()
        
        # Date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days_back)
        
        # Determine which platforms to use
        if platforms is None:
            platforms = list(self.providers.keys())
        
        total_collected = 0
        
        # Fetch from each provider
        for platform_name in platforms:
            if platform_name not in self.providers:
                continue
            
            provider = self.providers[platform_name]
            
            try:
                # Get platform ID
                platform = self.db.query(Platform).filter(
                    Platform.name == platform_name
                ).first()
                
                if not platform or not platform.is_active:
                    continue
                
                # Fetch mentions
                raw_mentions = provider.fetch_mentions(
                    keyword=primary_keyword,
                    start_date=start_date,
                    end_date=end_date,
                    limit=100
                )
                
                # Process and store
                for raw in raw_mentions:
                    # Normalize engagement
                    engagement = provider.normalize_engagement(raw)
                    
                    # Create mention object
                    mention = Mention(
                        brand_id=brand_id,
                        platform_id=platform.id,
                        text=raw['text'][:1000],  # Limit length
                        url=raw.get('url'),
                        source_id=raw.get('source_id'),
                        author=raw.get('author'),
                        timestamp=raw['timestamp'],
                        engagement_score=engagement,
                        raw_engagement=raw.get('raw_engagement', 0),
                        content_hash=provider._deduplicate_content(raw['text'])
                    )
                    
                    # Check for duplicates
                    existing = self.db.query(Mention).filter(
                        Mention.platform_id == platform.id,
                        Mention.source_id == raw.get('source_id')
                    ).first()
                    
                    if not existing:
                        self.db.add(mention)
                        total_collected += 1
                
                self.db.commit()
                
            except Exception as e:
                print(f"Error ingesting from {platform_name}: {e}")
                self.db.rollback()
                continue
        
        return total_collected
