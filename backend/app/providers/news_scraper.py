"""
News scraper using BeautifulSoup.

Scrapes various news sites. More acceptable than social media scraping.
Always check robots.txt and respect site policies.
"""

from bs4 import BeautifulSoup
from datetime import datetime
from typing import List, Dict, Any
from .base import BaseProvider
from .scraper_utils import ScraperUtils, check_robots_txt
import re


class NewsScraperProvider(BaseProvider):
    """
    Scrape news articles from various sources.
    
    Note: More legally acceptable than social media scraping,
    but still check each site's robots.txt and ToS.
    """
    
    def __init__(self):
        """Initialize news scraper."""
        super().__init__()
        self.utils = ScraperUtils(delay_range=(2, 4))
        
        # Common news sites to scrape (check robots.txt first!)
        self.news_sources = [
            'https://www.google.com/search?q={keyword}+site:techcrunch.com&tbm=nws',
            'https://www.google.com/search?q={keyword}+site:theverge.com&tbm=nws',
            'https://www.google.com/search?q={keyword}+site:wired.com&tbm=nws',
        ]
    
    def fetch_mentions(
        self,
        keyword: str,
        start_date: datetime,
        end_date: datetime,
        limit: int = 100
   ) -> List[Dict[str, Any]]:
        """
        Scrape news articles mentioning the keyword.
        
        Uses Google News search to find articles.
        """
        mentions = []
        
        for source_template in self.news_sources:
            if len(mentions) >= limit:
                break
            
            try:
                url = source_template.format(keyword=keyword)
                html = self.utils.fetch_with_retry(url)
                soup = BeautifulSoup(html, 'lxml')
                
                # Parse Google News results
                articles = soup.find_all('div', class_='g', limit=10)
                
                for article in articles:
                    try:
                        title_elem = article.find('h3')
                        link_elem = article.find('a')
                        snippet_elem = article.find('div', class_='VwiC3b')
                        
                        if not title_elem or not link_elem:
                            continue
                        
                        title = title_elem.get_text(strip=True)
                        url = link_elem.get('href', '')
                        snippet = snippet_elem.get_text(strip=True) if snippet_elem else ''
                        
                        mention = {
                            'text': f"{title}\n{snippet}",
                            'url': url,
                            'source_id': url.split('/')[-1][:200],
                            'author': url.split('/')[2] if '/' in url else 'unknown',
                            'timestamp': datetime.utcnow(),  # Approximate
                            'raw_engagement': 0,
                            'platform_name': 'News',
                            '_metadata': {
                                'source': url.split('/')[2] if '/' in url else 'unknown'
                            }
                        }
                        
                        mentions.append(mention)
                        
                    except Exception as e:
                        print(f"Error parsing news article: {e}")
                        continue
                        
            except Exception as e:
                print(f"Error scraping news source: {e}")
                continue
        
        return mentions[:limit]
    
    def normalize_engagement(self, raw_data: Dict[str, Any]) -> float:
        """News doesn't have engagement metrics in scraping."""
        return 0.5  # Baseline
