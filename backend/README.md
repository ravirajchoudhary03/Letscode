# MarketEcho Backend

**🚀 Hackathon Submission Build**
- **Status:** Active
- **Backend:** FastAPI + Python
- **Database:** Supabase (PostgreSQL)
- **Deployment:** Vercel / Railway ready

Production-grade data ingestion and analytics backend for brand mention tracking.

## Tech Stack
- **FastAPI** - Modern Python web framework
- **PostgreSQL** - Primary database
- **SQLAlchemy** - ORM
- **Pydantic** - Data validation
- **PRAW** - Reddit API client
- **YouTube Data API v3** - YouTube integration
- **NewsAPI** - News/blog aggregation
- **SerpAPI** - Google Search results

## Project Structure
```
backend/
├── app/
│   ├── api/           # API routes
│   ├── models/        # SQLAlchemy models
│   ├── schemas/       # Pydantic schemas
│   ├── providers/     # Data source integrations
│   ├── analytics/     # Business logic
│   ├── core/          # Config, database, utilities
│   └── main.py        # FastAPI app entry
├── tests/
├── requirements.txt
└── .env.example
```

## Setup

1. **Create virtual environment:**
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

2. **Install dependencies:**
```bash
pip install -r requirements.txt
```

3. **Configure environment:**
```bash
cp .env.example .env
# Edit .env with your API keys
```

4. **Initialize database:**
```bash
python -m app.core.init_db
```

5. **Run server:**
```bash
uvicorn app.main:app --reload
```

## API Endpoints

- `POST /ingest/run` - Trigger data ingestion
- `GET /brands/{brand_id}/mentions` - Get brand mentions
- `GET /category/{category_id}/sov` - Get Share of Voice
- `GET /metrics/market-index` - Get Market Index Score
- `GET /dashboard/overview` - Dashboard overview

## API Documentation

Once running, visit: `http://localhost:8000/docs`

## Deployment (Railway)

1. Connect to GitHub repository
2. Add environment variables in Railway dashboard
3. Deploy automatically on push to main branch

## Environment Variables

See `.env.example` for required configuration.
