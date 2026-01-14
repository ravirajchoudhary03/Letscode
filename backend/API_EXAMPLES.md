# MarketEcho Backend - API Examples

## Setup

1. Start the backend:
```bash
uvicorn app.main:app --reload
```

2. Access API docs: http://localhost:8000/docs

## Example API Calls

### 1. Trigger Data Ingestion

```bash
# Ingest all brands from all platforms (last 7 days)
curl -X POST "http://localhost:8000/ingest/run" \
  -H "Content-Type: application/json" \
  -d '{
    "days_back": 7
  }'

# Ingest specific brands from specific platforms
curl -X POST "http://localhost:8000/ingest/run" \
  -H "Content-Type: application/json" \
  -d '{
    "brand_ids": [1, 2, 3],
    "platforms": ["Reddit", "YouTube"],
    "days_back": 14
  }'
```

### 2. Get Brand Mentions

```bash
# Get all mentions for brand #1 (last 30 days)
curl "http://localhost:8000/brands/1/mentions?days_back=30"

# Filter by platform
curl "http://localhost:8000/brands/1/mentions?days_back=30&platform=Reddit"
```

### 3. Calculate Share of Voice

```bash
# Get SOV for brand #1 in category #1
curl "http://localhost:8000/category/1/sov?brand_id=1&days_back=30"
```

### 4. Get Market Index Score

```bash
# Get market index for all brands
curl "http://localhost:8000/metrics/market-index?days_back=30"

# Get market index for specific brands
curl "http://localhost:8000/metrics/market-index?brand_ids=1&brand_ids=2&days_back=30"
```

### 5. Dashboard Overview

```bash
# Get dashboard summary
curl "http://localhost:8000/dashboard/overview"
```

## Python Example

```python
import requests

BASE_URL = "http://localhost:8000"

# 1. Trigger ingestion
response = requests.post(f"{BASE_URL}/ingest/run", json={
    "brand_ids": [1],
    "platforms": ["Reddit", "YouTube"],
    "days_back": 7
})
print(response.json())

# 2. Get mentions
response = requests.get(f"{BASE_URL}/brands/1/mentions?days_back=7")
mentions = response.json()
print(f"Found {len(mentions)} mentions")

# 3. Get SOV
response = requests.get(f"{BASE_URL}/category/1/sov?brand_id=1&days_back=30")
sov = response.json()
print(f"Share of Voice: {sov['share_of_voice']}%")

# 4. Get Market Index
response = requests.get(f"{BASE_URL}/metrics/market-index?days_back=30")
scores = response.json()
for brand in scores:
    print(f"{brand['brand_name']}: {brand['market_index_score']}")
```

## Testing Workflow

1. **Add a test brand** (via SQL or admin panel):
```sql
INSERT INTO brands (name, category_id, keywords)
VALUES ('Nike', 1, 'Nike,Nike shoes,Nike sportswear');
```

2. **Trigger ingestion**:
```bash
curl -X POST "http://localhost:8000/ingest/run" -H "Content-Type: application/json" -d '{"brand_ids": [1], "days_back": 7}'
```

3. **Check results**:
```bash
curl "http://localhost:8000/brands/1/mentions"
```

4. **View analytics**:
```bash
curl "http://localhost:8000/metrics/market-index?brand_ids=1"
```

## Response Examples

### Ingestion Response
```json
{
  "status": "started",
  "message": "Ingestion job started for 1 brands",
  "brands_processed": 1,
  "total_mentions_collected": 0,
  "platforms_used": ["Reddit", "YouTube", "News", "Google"],
  "started_at": "2024-01-15T10:30:00Z",
  "completed_at": null
}
```

### Market Index Response
```json
[
  {
    "brand_id": 1,
    "brand_name": "Nike",
    "market_index_score": 78.5,
    "normalized_mentions": 0.85,
    "normalized_engagement": 0.72,
    "platform_coverage": 0.75,
    "period_start": "2024-01-01T00:00:00Z",
    "period_end": "2024-01-31T23:59:59Z"
  }
]
```
