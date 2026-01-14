"""News/Blog provider using NewsAPI."""

from newsapi import NewsApiClient
from datetime import datetime
from typing import List, Dict, Any
from .base import BaseProvider


class NewsProvider(BaseProvider):
    """
    Fetch brand mentions from news articles and blogs.
    
    Uses NewsAPI to aggregate content from thousands of sources.
    """
    
    def __init__(self, api_key: str):
        """
        Initialize NewsAPI client.
        
        Args:
            api_key: NewsAPI key (https://newsapi.org)
        """
        super().__init__(api_key=api_key)
        self.client = NewsApiClient(api_key=api_key)
    
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Search news articles for keyword mentions.
        
        Searches titles and descriptions from global news sources.
        """
        mentions = []
        
        try:
            # NewsAPI requires date strings in YYYY-MM-DD format
            from_date = start_date.strftime('%Y-%m-%d')
            to_date = end_date.strftime('%Y-%m-%d')
            
            # Fetch articles
            response = self.client.get_everything(
                q=keyword,
                from_param=from_date,
                to=to_date,
                language='en',
                sort_by='relevancy',
                page_size=min(limit, 100)  # API limit
            )
            
            for article in response.get('articles', []):
                # Skip articles without publication dates
                if not article.get('publishedAt'):
                    continue
                
                mention = {
                    'text': f"{article.get('title', '')}\n{article.get('description', '')}",
                    'url': article.get('url'),
                    'source_id': article.get('url', '').split('/')[-1][:200],  # Use URL slug
                    'author': article.get('author'),
                    'timestamp': datetime.fromisoformat(article['publishedAt'].replace('Z', '+00:00')),
                    'raw_engagement': 0,  # NewsAPI doesn't provide engagement metrics
                    'platform_name': 'News',
                    '_metadata': {
                        'source': article.get('source', {}).get('name'),
                        'content_snippet': article.get('content', '')[:200]
                    }
                }
                
                mentions.append(mention)
                
        except Exception as e:
            print(f"NewsAPI error: {e}")
        
        return mentions
    
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """
        Normalize news engagement.
        
        NewsAPI doesn't provide engagement metrics, so we use source quality
        as a proxy. Well-known sources get higher scores.
        
        For simplicity, we return a baseline score since engagement data is unavailable.
        """
        # TODO: Implement source quality scoring based on domain authority
        # For now, return moderate baseline
        return 0.5
