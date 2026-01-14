"""Base interface for all data providers."""

from abc import ABC, abstractmethod
from datetime import datetime
from typing import List, Dict, Any


class BaseProvider(ABC):
    """
    Abstract base class for all data source providers.
    
    All providers must implement fetch_mentions() with a consistent interface.
    This ensures we can swap providers easily and maintain clean separation.
    """
    
    def __init__(self, api_key: str = None, **kwargs):
        """
        Initialize provider with API credentials.
        
        Args:
            api_key: API key/token for the service
            **kwargs: Provider-specific configuration
        """
        self.api_key = api_key
        self.config = kwargs
    
    @abstractmethod
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Fetch mentions for a keyword within a date range.
        
        Args:
            keyword: Search term (brand name or keyword)
            start_date: Start of date range
            end_date: End of date range
            limit: Maximum number of results
            
        Returns:
            List of normalized mention dictionaries with schema:
            {
                'text': str,
                'url': str | None,
                'source_id': str,
                'author': str | None,
                'timestamp': datetime,
                'raw_engagement': int,
                'platform_name': str
            }
        """
        pass
    
    @abstractmethod
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """
        Normalize platform-specific engagement to 0-1 scale.
        
        Different platforms have different engagement metrics:
        - Reddit: upvotes + comments
        - YouTube: views + likes
        - News: popularity score
        - Google: search position
        
        Args:
            raw_data: Raw data from platform API
            
        Returns:
            Normalized score between 0 and 1
        """
        pass
    
    def _deduplicate_content(self, text: str) -> str:
        """
        Generate hash for deduplication.
        
        Args:
            text: Content text
            
        Returns:
            SHA-256 hash of normalized text
        """
        import hashlib
        normalized = text.lower().strip()
        return hashlib.sha256(normalized.encode()).hexdigest()
