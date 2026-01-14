"""Reddit data provider using PRAW (Python Reddit API Wrapper)."""

import praw
from datetime import datetime
from typing import List, Dict, Any
from .base import BaseProvider


class RedditProvider(BaseProvider):
    """
    Fetch brand mentions from Reddit.
    
    Uses official Reddit API via PRAW library.
    Searches posts and top-level comments for keyword mentions.
    """
    
    def __init__(self, client_id: str, client_secret: str, user_agent: str):
        """
        Initialize Reddit API client.
        
        Args:
            client_id: Reddit app client ID
            client_secret: Reddit app secret
            user_agent: User agent string
        """
        super().__init__()
        self.reddit = praw.Reddit(
            client_id=client_id,
            client_secret=client_secret,
            user_agent=user_agent
        )
    
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Search Reddit for keyword mentions.
        
        Searches across all subreddits, sorted by relevance.
        Filters results by date range.
        """
        mentions = []
        
        try:
            # Search submissions (posts)
            for submission in self.reddit.subreddit("all").search(
                keyword,
                limit=limit,
                sort="relevance"
            ):
                created_time = datetime.fromtimestamp(submission.created_utc)
                
                # Filter by date range
                if not (start_date <= created_time <= end_date):
                    continue
                
                mention = {
                    'text': f"{submission.title}\n{submission.selftext}"[:1000],
                    'url': f"https://reddit.com{submission.permalink}",
                    'source_id': submission.id,
                    'author': str(submission.author) if submission.author else None,
                    'timestamp': created_time,
                    'raw_engagement': submission.score + submission.num_comments,
                    'platform_name': 'Reddit',
                    '_metadata': {
                        'subreddit': str(submission.subreddit),
                        'upvotes': submission.score,
                        'comments': submission.num_comments
                    }
                }
                
                mentions.append(mention)
                
        except Exception as e:
            print(f"Reddit API error: {e}")
            # Log error but don't crash
        
        return mentions
    
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """
        Normalize Reddit engagement score.
        
        Formula: score = (upvotes + comments) / (upvotes + comments + 100)
        This creates a 0-1 scale where higher engagement = higher score.
        The +100 prevents division issues and smooths the curve.
        """
        upvotes = raw_data.get('_metadata', {}).get('upvotes', 0)
        comments = raw_data.get('_metadata', {}).get('comments', 0)
        total = upvotes + comments
        
        # Normalize with sigmoid-like function
        normalized = total / (total + 100)
        return min(max(normalized, 0.0), 1.0)
