"""
Reddit scraper (web scraping version).

⚠️ WARNING: This violates Reddit's Terms of Service.
Use the official PRAW API instead (reddit.py).
This is for educational purposes only.
"""

from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any
from .base import BaseProvider
from .scraper_utils import ScraperUtils
import re


class RedditScraperProvider(BaseProvider):
    """
    Scrape Reddit without using the API.
    
    ⚠️ DISCLAIMER: This violates Reddit ToS. Use at your own risk.
    """
    
    def __init__(self):
        """Initialize Reddit scraper."""
        super().__init__()
        self.utils = ScraperUtils(delay_range=(3, 6))  # Longer delays for Reddit
        self.base_url = "https://old.reddit.com"  # Easier to scrape
    
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Scrape Reddit search results for keyword.
        
        Note: Date filtering is approximate since we're scraping.
        """
        mentions = []
        
        try:
            # Build search URL
            search_url = f"{self.base_url}/search?q={keyword}&sort=relevance"
            
            # Fetch search results page
            html = self.utils.fetch_with_retry(search_url)
            soup = BeautifulSoup(html, 'lxml')
            
            # Find post containers
            posts = soup.find_all('div', class_='thing', limit=limit)
            
            for post in posts:
                try:
                    # Extract post data
                    title_elem = post.find('a', class_='title')
                    if not title_elem:
                        continue
                    
                    title = title_elem.get_text(strip=True)
                    url = title_elem.get('href', '')
                    if not url.startswith('http'):
                        url = f"https://old.reddit.com{url}"
                    
                    # Extract metadata
                    subreddit = post.get('data-subreddit', 'unknown')
                    author = post.get('data-author', 'unknown')
                    score = post.get('data-score', '0')
                    
                    # Get timestamp (approximate)
                    time_elem = post.find('time')
                    if time_elem and time_elem.get('datetime'):
                        timestamp = datetime.fromisoformat(time_elem['datetime'].replace('Z', '+00:00'))
                    else:
                        timestamp = datetime.utcnow()
                    
                    # Filter by date range
                    if not (start_date <= timestamp <= end_date):
                        continue
                    
                    # Get comment count
                    comments_elem = post.find('a', class_='comments')
                    comments_text = comments_elem.get_text() if comments_elem else '0'
                    num_comments = int(re.search(r'\d+', comments_text).group()) if re.search(r'\d+', comments_text) else 0
                    
                    mention = {
                        'text': title,
                        'url': url,
                        'source_id': post.get('data-fullname', url),
                        'author': author,
                        'timestamp': timestamp,
                        'raw_engagement': int(score) + num_comments,
                        'platform_name': 'Reddit',
                        '_metadata': {
                            'subreddit': subreddit,
                            'upvotes': int(score),
                            'comments': num_comments
                        }
                    }
                    
                    mentions.append(mention)
                    
                except Exception as e:
                    print(f"Error parsing Reddit post: {e}")
                    continue
                    
        except Exception as e:
            print(f"Reddit scraping error: {e}")
        finally:
            self.utils.close()
        
        return mentions
    
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """Normalize Reddit engagement (same as API version)."""
        upvotes = raw_data.get('_metadata', {}).get('upvotes', 0)
        comments = raw_data.get('_metadata', {}).get('comments', 0)
        total = upvotes + comments
        
        normalized = total / (total + 100)
        return min(max(normalized, 0.0), 1.0)
