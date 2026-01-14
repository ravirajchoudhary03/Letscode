"""
Google Search scraper using Playwright for JavaScript rendering.

⚠️ WARNING: This may violate Google's Terms of Service.
Use SerpAPI or official Search APIs instead.
This is for educational purposes only.
"""

from playwright.sync_api import sync_playwright, TimeoutError as PlaywrightTimeout
from datetime import datetime
from typing import List, Dict, Any
from .base import BaseProvider
import time
import random


class GoogleScraperProvider(BaseProvider):
    """
    Scrape Google Search results using browser automation.
    
    ⚠️ DISCLAIMER: Violates Google ToS. Use at your own risk.
    """
    
    def __init__(self):
        """Initialize Google scraper with Playwright."""
        super().__init__()
        self.playwright = None
        self.browser = None
    
    def _init_browser(self):
        """Initialize Playwright browser."""
        if not self.playwright:
            self.playwright = sync_playwright().start()
            self.browser = self.playwright.chromium.launch(
                headless=True,
                args=[
                    '--disable-blink-features=AutomationControlled',
                    '--disable-dev-shm-usage',
                    '--no-sandbox'
                ]
            )
    
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
    ) -> List[Dict[str, Any]]:
        """
        Scrape Google Search results.
        
        Uses browser automation to handle JavaScript rendering.
        """
        mentions = []
        
        try:
            self._init_browser()
            context = self.browser.new_context(
                user_agent='Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
                viewport={'width': 1920, 'height': 1080}
            )
            page = context.new_page()
            
            # Navigate to Google Search
            search_url = f"https://www.google.com/search?q={keyword}&num={min(limit, 100)}"
            page.goto(search_url, wait_until='networkidle')
            
            # Random human-like delay
            time.sleep(random.uniform(2, 4))
            
            # Extract search results
            results = page.query_selector_all('div.g')
            
            for idx, result in enumerate(results[:limit]):
                try:
                    # Extract title
                    title_elem = result.query_selector('h3')
                    title = title_elem.inner_text() if title_elem else ''
                    
                    # Extract URL
                    link_elem = result.query_selector('a')
                    url = link_elem.get_attribute('href') if link_elem else ''
                    
                    # Extract snippet
                    snippet_elem = result.query_selector('div.VwiC3b')
                    snippet = snippet_elem.inner_text() if snippet_elem else ''
                    
                    if not title or not url:
                        continue
                    
                    mention = {
                        'text': f"{title}\n{snippet}",
                        'url': url,
                        'source_id': url.split('/')[-1][:200],
                        'author': url.split('/')[2] if '/' in url else 'unknown',
                        'timestamp': datetime.utcnow(),  # Approximate
                        'raw_engagement': 100 - (idx * 10),  # Position-based
                        'platform_name': 'Google',
                        '_metadata': {
                            'position': idx + 1,
                            'domain': url.split('/')[2] if '/' in url else 'unknown'
                        }
                    }
                    
                    mentions.append(mention)
                    
                except Exception as e:
                    print(f"Error parsing Google result: {e}")
                    continue
            
            page.close()
            context.close()
            
        except PlaywrightTimeout:
            print("Google scraping timeout - may be blocked")
        except Exception as e:
            print(f"Google scraping error: {e}")
        
        return mentions
    
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """Normalize based on search position."""
        import math
        position = raw_data.get('_metadata', {}).get('position', 10)
        normalized = 1.0 / math.sqrt(position)
        return min(max(normalized, 0.0), 1.0)
    
    def __del__(self):
        """Clean up browser resources."""
        if self.browser:
            self.browser.close()
        if self.playwright:
            self.playwright.stop()
