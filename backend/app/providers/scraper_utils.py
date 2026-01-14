"""
Utilities for web scraping with anti-detection and rate limiting.
"""

import time
import random
from typing import Optional, Dict
from fake_useragent import UserAgent
from tenacity import retry, stop_after_attempt, wait_exponential
import httpx


class ScraperUtils:
    """Utilities for respectful and stealthy web scraping."""
    
    def __init__(self, delay_range: tuple = (2, 5)):
        """
        Initialize scraper utilities.
        
        Args:
            delay_range: Min and max seconds between requests
        """
        self.ua = UserAgent()
        self.delay_range = delay_range
        self.session = httpx.Client(timeout=30)
    
    def get_headers(self) -> Dict[str, str]:
        """
        Generate realistic browser headers to avoid detection.
        
        Returns:
            Dictionary of HTTP headers
        """
        return {
            'User-Agent': self.ua.random,
            'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
            'Accept-Language': 'en-US,en;q=0.5',
            'Accept-Encoding': 'gzip, deflate, br',
            'DNT': '1',
            'Connection': 'keep-alive',
            'Upgrade-Insecure-Requests': '1',
            'Sec-Fetch-Dest': 'document',
            'Sec-Fetch-Mode': 'navigate',
            'Sec-Fetch-Site': 'none',
            'Cache-Control': 'max-age=0',
        }
    
    def random_delay(self):
        """Add random delay between requests to avoid rate limiting."""
        delay = random.uniform(*self.delay_range)
        time.sleep(delay)
    
    @retry(stop=stop_after_attempt(3), wait=wait_exponential(multiplier=1, min=4, max=10))
    def fetch_with_retry(self, url: str, headers: Optional[Dict] = None) -> str:
        """
        Fetch URL with automatic retries on failure.
        
        Args:
            url: Target URL
            headers: Optional custom headers
            
        Returns:
            HTML content as string
        """
        if headers is None:
            headers = self.get_headers()
        
        response = self.session.get(url, headers=headers, follow_redirects=True)
        response.raise_for_status()
        
        self.random_delay()
        return response.text
    
    def close(self):
        """Close the HTTP session."""
        self.session.close()


def check_robots_txt(domain: str, path: str = "/") -> bool:
    """
    Check if scraping is allowed by robots.txt.
    
    Args:
        domain: Website domain
        path: Path to check
        
    Returns:
        True if allowed, False otherwise
    """
    try:
        from urllib.robotparser import RobotFileParser
        
        rp = RobotFileParser()
        rp.set_url(f"https://{domain}/robots.txt")
        rp.read()
        
        return rp.can_fetch("*", f"https://{domain}{path}")
    except Exception:
        # If we can't read robots.txt, assume disallowed for safety
        return False
