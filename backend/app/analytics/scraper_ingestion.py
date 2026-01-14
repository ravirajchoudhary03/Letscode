"""
Updated ingestion service using web scrapers instead of APIs.

⚠️ USE AT YOUR OWN RISK - Violates platform Terms of Service.
"""

from datetime import datetime, timedelta
from typing import List
from sqlalchemy.orm import Session
from app.providers.reddit_scraper import RedditScraperProvider
from app.providers.youtube_scraper import YouTubeScraperProvider
from app.providers.news_scraper import NewsScraperProvider
from app.providers.google_scraper import GoogleScraperProvider
from app.models.database import Brand, Platform, Mention


class ScraperIngestionService:
    """
    Orchestrates web scraping from multiple sources.
    
    ⚠️ WARNING: This uses web scraping which may violate Terms of Service.
    Read LEGAL_DISCLAIMER.txt before using.
    """
    
    def __init__(self, db: Session):
        """
        Initialize scraping service.
        
        Args:
            db: Database session
        """
        self.db = db
        
        # Initialize scrapers (no API keys needed!)
        self.scrapers = {
            'Reddit': RedditScraperProvider(),
            'YouTube': YouTubeScraperProvider(),
            'News': NewsScraperProvider(),
            'Google': GoogleScraperProvider()
        }
        
        print("⚠️ WARNING: Using web scraping. Read LEGAL_DISCLAIMER.txt")
    
    def ingest_brand(
        self,
        brand_id: int,
        days_back: int = 7,
        platforms: List[str] = None
    ) -> int:
        """
        Scrape mentions for a single brand.
        
        Args:
            brand_id: Brand to scrape
            days_back: How many days of data to fetch
            platforms: List of platform names (None = all)
            
        Returns:
            Number of new mentions collected
        """
        # Get brand and keywords
        brand = self.db.query(Brand).filter(Brand.id == brand_id).first()
        if not brand:
            raise ValueError(f"Brand {brand_id} not found")
        
        keywords = brand.keywords.split(',') if brand.keywords else [brand.name]
        primary_keyword = keywords[0].strip()
        
        # Date range
        end_date = datetime.utcnow()
        start_date = end_date - timedelta(days=days_back)
        
        # Determine which platforms to scrape
        if platforms is None:
            platforms = list(self.scrapers.keys())
        
        total_collected = 0
        
        print(f"\n🕷️ Starting web scraping for: {brand.name}")
        print(f"Platforms: {', '.join(platforms)}")
        print(f"Date range: {days_back} days")
        
        # Scrape from each platform
        for platform_name in platforms:
            if platform_name not in self.scrapers:
                continue
            
            scraper = self.scrapers[platform_name]
            
            try:
                print(f"\n📡 Scraping {platform_name}...")
                
                # Get platform ID
                platform = self.db.query(Platform).filter(
                    Platform.name == platform_name
                ).first()
                
                if not platform or not platform.is_active:
                    continue
                
                # Scrape mentions
                raw_mentions = scraper.fetch_mentions(
                    keyword=primary_keyword,
                    start_date=start_date,
                    end_date=end_date,
                    limit=50  # Lower limit to avoid detection
                )
                
                print(f"  ✓ Found {len(raw_mentions)} results")
                
                # Process and store
                for raw in raw_mentions:
                    # Normalize engagement
                    engagement = scraper.normalize_engagement(raw)
                    
                    # Create mention object
                    mention = Mention(
                        brand_id=brand_id,
                        platform_id=platform.id,
                        text=raw['text'][:1000],
                        url=raw.get('url'),
                        source_id=raw.get('source_id'),
                        author=raw.get('author'),
                        timestamp=raw['timestamp'],
                        engagement_score=engagement,
                        raw_engagement=raw.get('raw_engagement', 0),
                        content_hash=scraper._deduplicate_content(raw['text'])
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
                print(f"  ✓ Stored {len(raw_mentions)} new mentions")
                
            except Exception as e:
                print(f"  ❌ Error scraping {platform_name}: {e}")
                self.db.rollback()
                continue
        
        print(f"\n✅ Scraping complete! Collected {total_collected} total mentions")
        return total_collected
