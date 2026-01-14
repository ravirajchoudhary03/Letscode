"""
API routes for analytics endpoints.
"""

from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from datetime import datetime, timedelta
from typing import List, Optional

from app.core.config import get_db
from app.schemas.schemas import (
    ShareOfVoiceResponse,
    MarketIndexResponse,
    MentionResponse,
    DashboardOverview
)
from app.analytics.engine import AnalyticsEngine
from app.models.database import Brand, Mention, Platform, Category

router = APIRouter(tags=["Analytics"])


@router.get("/brands/{brand_id}/mentions", response_model=List[MentionResponse])
async def get_brand_mentions(
    brand_id: int,
    days_back: int = Query(default=30, ge=1, le=365),
    platform: Optional[str] = None,
    db: Session = Depends(get_db)
):
    """
    Get all mentions for a specific brand.
    
    Args:
        brand_id: Brand ID
        days_back: Number of days to look back
        platform: Filter by platform name (optional)
        db: Database session
        
    Returns:
        List of mentions
    """
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    # Build query
    query = db.query(Mention).filter(
        Mention.brand_id == brand_id,
        Mention.timestamp >= datetime.utcnow() - timedelta(days=days_back)
    )
    
    # Filter by platform if specified
    if platform:
        platform_obj = db.query(Platform).filter(Platform.name == platform).first()
        if platform_obj:
            query = query.filter(Mention.platform_id == platform_obj.id)
    
    mentions = query.order_by(Mention.timestamp.desc()).limit(1000).all()
    
    return mentions


@router.get("/category/{category_id}/sov", response_model=ShareOfVoiceResponse)
async def get_share_of_voice(
    category_id: int,
    brand_id: int,
    days_back: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Calculate Share of Voice for a brand in its category.
    
    Args:
        category_id: Category ID
        brand_id: Brand ID
        days_back: Analysis period
        db: Database session
        
    Returns:
        Share of Voice metrics
    """
    brand = db.query(Brand).filter(Brand.id == brand_id).first()
    if not brand:
        raise HTTPException(status_code=404, detail="Brand not found")
    
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days_back)
    
    # Calculate SOV
    sov_data = AnalyticsEngine.calculate_share_of_voice(
        brand_id=brand_id,
        category_id=category_id,
        start_date=start_date,
        end_date=end_date,
        db=db
    )
    
    return ShareOfVoiceResponse(
        brand_id=brand_id,
        brand_name=brand.name,
        category_id=category_id,
        total_mentions=sov_data['brand_mentions'],
        category_total_mentions=sov_data['category_mentions'],
        share_of_voice=sov_data['share_of_voice'],
        period_start=start_date,
        period_end=end_date
    )


@router.get("/metrics/market-index", response_model=List[MarketIndexResponse])
async def get_market_index(
    brand_ids: Optional[List[int]] = Query(default=None),
    days_back: int = Query(default=30, ge=1, le=365),
    db: Session = Depends(get_db)
):
    """
    Calculate Market Index Score for brands.
    
    Args:
        brand_ids: List of brand IDs (None = all brands)
        days_back: Analysis period
        db: Database session
        
    Returns:
        Market Index scores for brands
    """
    # Get brands
    if brand_ids:
        brands = db.query(Brand).filter(Brand.id.in_(brand_ids)).all()
    else:
        brands = db.query(Brand).all()
    
    end_date = datetime.utcnow()
    start_date = end_date - timedelta(days=days_back)
    
    results = []
    for brand in brands:
        index_data = AnalyticsEngine.calculate_market_index_score(
            brand_id=brand.id,
            start_date=start_date,
            end_date=end_date,
            db=db
        )
        
        results.append(MarketIndexResponse(
            brand_id=brand.id,
            brand_name=brand.name,
            market_index_score=index_data['market_index_score'],
            normalized_mentions=index_data['normalized_mentions'],
            normalized_engagement=index_data['normalized_engagement'],
            platform_coverage=index_data['platform_coverage'],
            period_start=start_date,
            period_end=end_date
        ))
    
    # Sort by score descending
    results.sort(key=lambda x: x.market_index_score, reverse=True)
    
    return results


@router.get("/dashboard/overview", response_model=DashboardOverview)
async def get_dashboard_overview(db: Session = Depends(get_db)):
    """
    Get dashboard overview with key metrics.
    
    Returns:
        Dashboard summary data
    """
    from sqlalchemy import func
    
    # Total counts
    total_brands = db.query(Brand).count()
    total_mentions = db.query(Mention).count()
    total_platforms = db.query(Platform).filter(Platform.is_active == 1).count()
    
    # Top 5 brands by mentions (last 30 days)
    thirty_days_ago = datetime.utcnow() - timedelta(days=30)
    top_brands_query = db.query(
        Brand.id,
        Brand.name,
        func.count(Mention.id).label('mention_count')
    ).join(
        Mention, Mention.brand_id == Brand.id
    ).filter(
        Mention.timestamp >= thirty_days_ago
    ).group_by(
        Brand.id, Brand.name
    ).order_by(
        func.count(Mention.id).desc()
    ).limit(5).all()
    
    top_brands = [
        {'brand_id': b.id, 'brand_name': b.name, 'mentions': b.mention_count}
        for b in top_brands_query
    ]
    
    # Platform distribution
    platform_dist_query = db.query(
        Platform.name,
        func.count(Mention.id).label('count')
    ).join(
        Mention, Mention.platform_id == Platform.id
    ).filter(
        Mention.timestamp >= thirty_days_ago
    ).group_by(
        Platform.name
    ).all()
    
    platform_distribution = {p.name: p.count for p in platform_dist_query}
    
    # Recent mentions
    recent = db.query(Mention).order_by(
        Mention.collected_at.desc()
    ).limit(10).all()
    
    return DashboardOverview(
        total_brands=total_brands,
        total_mentions=total_mentions,
        total_platforms=total_platforms,
        top_brands=top_brands,
        platform_distribution=platform_distribution,
        recent_mentions=recent
    )
