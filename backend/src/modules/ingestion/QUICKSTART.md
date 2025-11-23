# 🚀 Quick Start Guide - Data Ingestion Module

## Prerequisites

1. **OpenWeatherMap API Key**
   - Sign up at https://openweathermap.org/api
   - Get your free API key
   - Free tier: 1,000 calls/day

2. **Orion-LD Context Broker**
   - Should be running (via Docker Compose)
   - Default: http://localhost:1026

## Setup Steps

### 1. Configure Environment Variables

Edit `.env` file:

```env
# OpenWeatherMap
OWM_API_KEY=your_api_key_here

# Orion-LD
ORION_LD_URL=http://localhost:1026
ORION_LD_API_VERSION=ngsi-ld/v1
```

### 2. Verify Health

```bash
curl http://localhost:8000/api/v1/ingestion/health
```

Expected response:

```json
{
  "status": "healthy",
  "services": {
    "openWeatherMap": "configured",
    "orionLD": "accessible"
  }
}
```

## Manual Testing

### Trigger Ingestion

```bash
# Full ingestion (Air Quality + Weather)
curl -X POST http://localhost:8000/api/v1/ingestion/all

# Air quality only
curl -X POST http://localhost:8000/api/v1/ingestion/air-quality

# Weather only
curl -X POST http://localhost:8000/api/v1/ingestion/weather
```

### Check Locations

```bash
curl http://localhost:8000/api/v1/ingestion/locations
```

### Verify Data in Orion-LD

```bash
# Get all AirQualityObserved entities
curl http://localhost:1026/ngsi-ld/v1/entities?type=AirQualityObserved

# Get all WeatherObserved entities
curl http://localhost:1026/ngsi-ld/v1/entities?type=WeatherObserved

# Get specific entity
curl http://localhost:1026/ngsi-ld/v1/entities/urn:ngsi-ld:AirQualityObserved:...
```

## Scheduled Ingestion

The ingestion runs automatically every 30 minutes:

- At :00 and :30 of every hour
- Check logs for execution:

```bash
# Docker logs
docker logs backend-container -f

# Or in development
pnpm run start:dev
# Watch for: "🕐 Scheduled ingestion started"
```

## Monitoring Locations

Current locations (edit `source_data.json` to modify):

1. **Hồ Hoàn Kiếm** (21.028511, 105.804817)
2. **Mỹ Đình** (21.028023, 105.778466)
3. **Long Biên** (21.054351, 105.886446)
4. **Hồ Tây** (21.068176, 105.814129)
5. **Hà Đông** (20.959001, 105.765226)

## Troubleshooting

### OWM API Key not working

```
Error: Request failed with status code 401
```

**Solution**: Check if `OWM_API_KEY` is set correctly in `.env`

### Orion-LD not accessible

```
Orion-LD health check failed
```

**Solution**:

```bash
docker-compose up -d orion
```

### No data in Orion-LD

```
curl http://localhost:1026/ngsi-ld/v1/entities?type=AirQualityObserved
# Returns: []
```

**Solution**: Trigger manual ingestion:

```bash
curl -X POST http://localhost:8000/api/v1/ingestion/all
```

### Scheduled job not running

**Check logs for**:

```
[IngestionScheduler] 🕐 Scheduled ingestion started
```

**If not appearing**: Verify `ScheduleModule` is imported in `app.module.ts`

## API Endpoints Summary

| Method | Endpoint                        | Description              |
| ------ | ------------------------------- | ------------------------ |
| POST   | `/api/v1/ingestion/all`         | Trigger full ingestion   |
| POST   | `/api/v1/ingestion/air-quality` | Trigger air quality only |
| POST   | `/api/v1/ingestion/weather`     | Trigger weather only     |
| GET    | `/api/v1/ingestion/locations`   | Get monitoring locations |
| GET    | `/api/v1/ingestion/health`      | Health check             |

## Development Tips

### Change Ingestion Frequency

Edit `ingestion.scheduler.ts`:

```typescript
// Every 10 minutes (for testing)
@Cron('*/10 * * * *', {...})

// Every hour
@Cron('0 * * * *', {...})

// Every 30 minutes (default)
@Cron('0,30 * * * *', {...})
```

### Add More Locations

Edit `source_data.json`:

```json
[
  {
    "id": "urn:ngsi-ld:WeatherLocation:new-location",
    "type": "WeatherLocation",
    "name": "New Location Name",
    "district": "District Name",
    "location": {
      "lat": 21.0,
      "lon": 105.0
    }
  }
]
```

### Disable Scheduled Ingestion

Comment out the `@Cron()` decorator in `ingestion.scheduler.ts`:

```typescript
// @Cron('0,30 * * * *', {...})
async handleScheduledIngestion() {
  // ...
}
```
