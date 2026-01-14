"""
Analytics engine for computing business metrics.

This module contains pure business logic for:
- Share of Voice (SOV)
- Market Index Score
- Engagement normalization

NO database or API logic should be here - only calculations.
"""

from datetime import datetime
from typing import List, Dict
from sqlalchemy.orm import Session
from app.models.database import Brand, Mention, Category


class AnalyticsEngine:
    """
    Pure business logic for analytics calculations.
    
    Design principle: This class has NO knowledge of FastAPI or HTTP.
    It only performs calculations on data passed to it.
    """
    
    @staticmethod
    def calculate_share_of_voice(
        brand_id: int,
        category_id: int,
        start_date: datetime,
        end_date: datetime,
        db: Session
    ) -> Dict:
        """
        Calculate Share of Voice for a brand in its category.
        
        Formula: SOV = (brand_mentions / total_category_mentions) * 100
        
        Args:
            brand_id: Target brand ID
            category_id: Category ID
            start_date: Period start
            end_date: Period end
            db: Database session
            
        Returns:
            Dictionary with SOV data
        """
        # Get brand mentions in period
        brand_mentions = db.query(Mention).filter(
            Mention.brand_id == brand_id,
            Mention.timestamp >= start_date,
            Mention.timestamp <= end_date
        ).count()
        
        # Get all brands in category
        category_brand_ids = db.query(Brand.id).filter(
            Brand.category_id == category_id
        ).all()
        category_brand_ids = [b[0] for b in category_brand_ids]
        
        # Get total category mentions
        category_mentions = db.query(Mention).filter(
            Mention.brand_id.in_(category_brand_ids),
            Mention.timestamp >= start_date,
            Mention.timestamp <= end_date
        ).count()
        
        # Calculate SOV
        sov = (brand_mentions / category_mentions * 100) if category_mentions > 0 else 0.0
        
        return {
            'brand_mentions': brand_mentions,
            'category_mentions': category_mentions,
            'share_of_voice': round(sov, 2)
        }
    
    @staticmethod
    def calculate_market_index_score(
        brand_id: int,
        start_date: datetime,
        end_date: datetime,
        db: Session
    ) -> Dict:
        """
        Calculate Market Index Score for a brand.
        
        Formula:
        Market Index = (
            0.5 * normalized_mentions +
            0.3 * normalized_engagement +
            0.2 * platform_coverage
        ) * 100
        
        Args:
            brand_id: Target brand ID
            start_date: Period start
            end_date: Period end
            db: Database session
            
        Returns:
            Dictionary with market index components and final score
        """
        # Get brand's mentions
        mentions = db.query(Mention).filter(
            Mention.brand_id == brand_id,
            Mention.timestamp >= start_date,
            Mention.timestamp <= end_date
        ).all()
        
        if not mentions:
            return {
                'market_index_score': 0.0,
                'normalized_mentions': 0.0,
                'normalized_engagement': 0.0,
                'platform_coverage': 0.0
            }
        
        # Get category for normalization
        brand = db.query(Brand).filter(Brand.id == brand_id).first()
        category_brands = db.query(Brand.id).filter(
            Brand.category_id == brand.category_id
        ).all()
        category_brand_ids = [b[0] for b in category_brands]
        
        # Get max mentions in category (for normalization)
        max_mentions = db.query(Mention).filter(
            Mention.brand_id.in_(category_brand_ids),
            Mention.timestamp >= start_date,
            Mention.timestamp <= end_date
        ).group_by(Mention.brand_id).count()
        
        # Component 1: Normalized mention count (0-1)
        mention_count = len(mentions)
        normalized_mentions = min(mention_count / (max_mentions + 1), 1.0) if max_mentions > 0 else 0.5
        
        # Component 2: Normalized engagement (0-1)
        total_engagement = sum(m.engagement_score for m in mentions)
        avg_engagement = total_engagement / mention_count if mention_count > 0 else 0.0
        normalized_engagement = min(avg_engagement, 1.0)
        
        # Component 3: Platform coverage (0-1)
        # How many of the 4 platforms does the brand appear on?
        unique_platforms = len(set(m.platform_id for m in mentions))
        platform_coverage = unique_platforms / 4.0  # We have 4 platforms
        
        # Calculate final score
        market_index = (
            0.5 * normalized_mentions +
            0.3 * normalized_engagement +
            0.2 * platform_coverage
        ) * 100
        
        return {
            'market_index_score': round(market_index, 2),
            'normalized_mentions': round(normalized_mentions, 3),
            'normalized_engagement': round(normalized_engagement, 3),
            'platform_coverage': round(platform_coverage, 3)
        }
    
    @staticmethod
    def aggregate_platform_distribution(
        brand_id: int,
        start_date: datetime,
        end_date: datetime,
        db: Session
    ) -> Dict[str, int]:
        """
        Get mention count distribution across platforms.
        
        Returns:
            Dict mapping platform name to mention count
        """
        from sqlalchemy import func
        from app.models.database import Platform
        
        results = db.query(
            Platform.name,
            func.count(Mention.id).label('count')
        ).join(
            Mention, Mention.platform_id == Platform.id
        ).filter(
            Mention.brand_id == brand_id,
            Mention.timestamp >= start_date,
            Mention.timestamp <= end_date
        ).group_by(
            Platform.name
        ).all()
        
        return {name: count for name, count in results}
