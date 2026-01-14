"""
YouTube scraper using Playwright.

⚠️ WARNING: This violates YouTube's Terms of Service.
Use YouTube Data API v3 instead.
This is for educational purposes only.
"""

from playwright.sync_api import sync_playwright
from datetime import datetime
from typing import List, Dict, Any
from .base import BaseProvider
import re
import time
import random


class YouTubeScraperProvider(BaseProvider):
    """
    Scrape YouTube search results.
    
    ⚠️ DISCLAIMER: Violates YouTube ToS. Use official API instead.
    """
    
    def __init__(self):
        """Initialize YouTube scraper."""
        super().__init__()
        self.playwright = None
        self.browser = None
    
    def _init_browser(self):
        """Initialize browser."""
        if not self.playwright:
            self.playwright = sync_playwright().start()
            self.browser = self.playwright.chromium.launch(headless=True)
    
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """Scrape YouTube search results."""
        mentions = []
        
        try:
            self._init_browser()
            context = self.browser.new_context()
            page = context.new_page()
            
            # Search YouTube
            search_url = f"https://www.youtube.com/results?search_query={keyword}"
            page.goto(search_url, wait_until='networkidle')
            
            # Wait for results to load
            time.sleep(random.uniform(2, 4))
            
            # Scroll to load more results
            for _ in range(3):
                page.evaluate('window.scrollBy(0, 1000)')
                time.sleep(1)
            
            # Extract video data
            videos = page.query_selector_all('ytd-video-renderer')
            
            for video in videos[:limit]:
                try:
                    # Title
                    title_elem = video.query_selector('#video-title')
                    title = title_elem.get_attribute('title') if title_elem else ''
                    url = title_elem.get_attribute('href') if title_elem else ''
                    if url and not url.startswith('http'):
                        url = f"https://www.youtube.com{url}"
                    
                    # Channel
                    channel_elem = video.query_selector('#channel-name a')
                    channel = channel_elem.inner_text() if channel_elem else 'Unknown'
                    
                    # Views
                    views_elem = video.query_selector('#metadata-line span')
                    views_text = views_elem.inner_text() if views_elem else '0'
                    views = self._parse_views(views_text)
                    
                    # Video ID
                    video_id = url.split('v=')[-1].split('&')[0] if url else ''
                    
                    mention = {
                        'text': title,
                        'url': url,
                        'source_id': video_id,
                        'author': channel,
                        'timestamp': datetime.utcnow(),  # Approximate
                        'raw_engagement': views,
                        'platform_name': 'YouTube',
                        '_metadata': {
                            'views': views,
                            'likes': 0,  # Can't scrape likes easily
                            'comments': 0
                        }
                    }
                    
                    mentions.append(mention)
                    
                except Exception as e:
                    print(f"Error parsing YouTube video: {e}")
                    continue
            
            page.close()
            context.close()
            
        except Exception as e:
            print(f"YouTube scraping error: {e}")
        
        return mentions
    
    def _parse_views(self, text: str) -> int:
        """Parse view count from text like '1.2M views'."""
        try:
            match = re.search(r'([\d.]+)([KMB])?', text)
            if match:
                number = float(match.group(1))
                multiplier = match.group(2)
                
                if multiplier == 'K':
                    return int(number * 1000)
                elif multiplier == 'M':
                    return int(number * 1000000)
                elif multiplier == 'B':
                    return int(number * 1000000000)
                return int(number)
        except:
            pass
        return 0
    
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """Normalize YouTube engagement."""
        import math
        views = raw_data.get('_metadata', {}).get('views', 0)
        normalized_views = min(math.log10(views + 1) / 6.0, 1.0) if views > 0 else 0
        return normalized_views
    
    def __del__(self):
        """Clean up."""
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
