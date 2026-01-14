# MarketEcho Backend - Web Scraping Version

⚠️ **LEGAL WARNING**: This version uses web scraping which may violate Terms of Service.

Read `LEGAL_DISCLAIMER.txt` before proceeding.

## What Changed

This version replaces API-based data collection with web scraping:

| Platform | API Version | Scraping Version |
|----------|-------------|------------------|
| Reddit | PRAW (official) | BeautifulSoup (violates ToS) |
| YouTube | Data API v3 | Playwright (violates ToS) |
| News | NewsAPI | Google News scraping |
| Google | SerpAPI | Playwright (violates ToS) |

## Setup

1. **Install scraping dependencies:**
```bash
pip install -r requirements-scraping.txt
playwright install chromium
```

2. **No API keys needed!** Remove from `.env`:
```bash
# These are NOT needed for scraping version:
# REDDIT_CLIENT_ID=
# YOUTUBE_API_KEY=
# NEWS_API_KEY=
# SERP_API_KEY=
```

3. **Initialize database:**
```bash
python -m app.core.init_db
```

4. **Run server:**
```bash
uvicorn app.main:app --reload
```

## Usage

The API endpoints remain the same, but now use scrapers instead of APIs:

```bash
# This now scrapes instead of using APIs
curl -X POST "http://localhost:8000/ingest/run" \
  -H "Content-Type: application/json" \
  -d '{"brand_ids": [1], "days_back": 7}'
```

## Risks & Limitations

**Legal Risks:**
- ❌ Violates Reddit ToS
- ❌ Violates YouTube ToS
- ❌ Violates Google ToS
- ⚠️ May result in IP bans or legal action

**Technical Limitations:**
- Slower than APIs (needs delays to avoid detection)
- Less reliable (breaks when sites change)
- Limited by CAPTCHA and anti-bot measures
- Can't access as much historical data

**Rate Limiting:**
- Built-in delays (2-6 seconds between requests)
- Lower limits (50 results max per platform)
- Longer scraping times

## Recommendations

1. **Use for testing/education only**
2. **Don't deploy to production**
3. **Respect robots.txt**
4. **Add longer delays for heavy usage**
5. **Consider using official APIs instead**

## Switching Between API and Scraping

To use APIs again, update `app/api/ingestion.py`:

```python
# Use API version:
from app.analytics.ingestion import IngestionService

# Use scraping version:
from app.analytics.scraper_ingestion import ScraperIngestionService
```

## Anti-Detection Features

- Random user agents
- Realistic browser headers
- Random delays between requests
- Playwright for JavaScript rendering
- Respectful rate limiting

Still, expect blocks and CAPTCHAs.

---

**Remember:** This is for educational purposes only. Use at your own risk.
