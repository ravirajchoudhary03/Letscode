"""YouTube data provider using YouTube Data API v3."""

from googleapiclient.discovery import build
from datetime import datetime
from typing import List, Dict, Any
from .base import BaseProvider


class YouTubeProvider(BaseProvider):
    """
    Fetch brand mentions from YouTube.
    
    Uses official YouTube Data API v3.
    Searches video titles and descriptions for keywords.
    """
    
    def __init__(self, api_key: str):
        """
        Initialize YouTube API client.
        
        Args:
            api_key: YouTube Data API v3 key
        """
        super().__init__(api_key=api_key)
        self.youtube = build('youtube', 'v3', developerKey=api_key)
    
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Search YouTube for videos mentioning keyword.
        
        Filters by date range and relevance.
        """
        mentions = []
        
        try:
            # Format dates for YouTube API (RFC 3339)
            published_after = start_date.isoformat() + 'Z'
            published_before = end_date.isoformat() + 'Z'
            
            # Search request
            search_response = self.youtube.search().list(
                q=keyword,
                part='id,snippet',
                type='video',
                maxResults=min(limit, 50),  # API limit
                publishedAfter=published_after,
                publishedBefore=published_before,
                order='relevance'
            ).execute()
            
            # Get video IDs for detailed stats
            video_ids = [item['id']['videoId'] for item in search_response.get('items', [])]
            
            if not video_ids:
                return mentions
            
            # Fetch video statistics
            videos_response = self.youtube.videos().list(
                part='snippet,statistics',
                id=','.join(video_ids)
            ).execute()
            
            for video in videos_response.get('items', []):
                snippet = video['snippet']
                stats = video['statistics']
                
                mention = {
                    'text': f"{snippet['title']}\n{snippet.get('description', '')[:500]}",
                    'url': f"https://www.youtube.com/watch?v={video['id']}",
                    'source_id': video['id'],
                    'author': snippet.get('channelTitle'),
                    'timestamp': datetime.fromisoformat(snippet['publishedAt'].replace('Z', '+00:00')),
                    'raw_engagement': int(stats.get('viewCount', 0)) + int(stats.get('likeCount', 0)),
                    'platform_name': 'YouTube',
                    '_metadata': {
                        'views': int(stats.get('viewCount', 0)),
                        'likes': int(stats.get('likeCount', 0)),
                        'comments': int(stats.get('commentCount', 0))
                    }
                }
                
                mentions.append(mention)
                
        except Exception as e:
            print(f"YouTube API error: {e}")
        
        return mentions
    
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """
        Normalize YouTube engagement.
        
        Formula: Takes views and likes into account.
        Views are normalized logarithmically (since they can be huge).
        """
        import math
        
        metadata = raw_data.get('_metadata', {})
        views = metadata.get('views', 0)
        likes = metadata.get('likes', 0)
        
        # Normalize views logarithmically (1M views ≈ 1.0)
        normalized_views = min(math.log10(views + 1) / 6.0, 1.0) if views > 0 else 0
        
        # Normalize likes (10K likes ≈ 1.0)
        normalized_likes = min(likes / 10000.0, 1.0)
        
        # Weighted average (views 70%, likes 30%)
        score = (0.7 * normalized_views) + (0.3 * normalized_likes)
        
        return min(max(score, 0.0), 1.0)
