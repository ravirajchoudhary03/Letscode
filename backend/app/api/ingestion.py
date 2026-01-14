"""
API routes for ingestion endpoints.
"""

from fastapi import APIRouter, Depends, BackgroundTasks, HTTPException
from sqlalchemy.orm import Session
from datetime import datetime
from typing import List

from app.core.config import get_db
from app.schemas.schemas import IngestionRequest, IngestionResponse
from app.analytics.ingestion import IngestionService
from app.models.database import Brand

router = APIRouter(prefix="/ingest", tags=["Ingestion"])


@router.post("/run", response_model=IngestionResponse)
async def run_ingestion(
    request: IngestionRequest,
    background_tasks: BackgroundTasks,
    db: Session = Depends(get_db)
):
    """
    Trigger data ingestion for specified brands and platforms.
    
    This endpoint starts a background job to collect mentions.
    Returns immediately with job status.
    
    Args:
        request: Ingestion configuration (brands, platforms, date range)
        background_tasks: FastAPI background task manager
        db: Database session
        
    Returns:
        Ingestion status and metadata
    """
    started_at = datetime.utcnow()
    
    # Determine which brands to ingest
    if request.brand_ids:
        brands = db.query(Brand).filter(Brand.id.in_(request.brand_ids)).all()
    else:
        brands = db.query(Brand).all()
    
    if not brands:
        raise HTTPException(status_code=404, detail="No brands found")
    
    # Determine platforms
    platforms = request.platforms if request.platforms else ['Reddit', 'YouTube', 'News', 'Google']
    
    # Run ingestion in background
    def ingest_task():
        service = IngestionService(db)
        total = 0
        for brand in brands:
            collected = service.ingest_brand(
                brand_id=brand.id,
                days_back=request.days_back,
                platforms=platforms
            )
            total += collected
        return total
    
    background_tasks.add_task(ingest_task)
    
    return IngestionResponse(
        status="started",
        message=f"Ingestion job started for {len(brands)} brands",
        brands_processed=len(brands),
        total_mentions_collected=0,  # Will be updated by background job
        platforms_used=platforms,
        started_at=started_at,
        completed_at=None
    )
