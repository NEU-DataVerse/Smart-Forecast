# Ingestion Module

## 📖 Overview

The Ingestion Module is responsible for collecting environmental data (air quality and weather) from OpenWeatherMap API and storing it in the Orion-LD Context Broker using NGSI-LD format. It supports both **real-time observations** and **forecast data** with automated scheduling every 30 minutes.

### Key Capabilities

- ✅ Real-time air quality monitoring (8 pollutants + AQI)
- ✅ Real-time weather observations (20+ parameters)
- ✅ 4-day hourly air quality forecasts (96 data points)
- ✅ 7-day daily weather forecasts
- ✅ FIWARE-compliant NGSI-LD format
- ✅ Automated scheduling with cron jobs
- ✅ Manual trigger via REST API
- ✅ Comprehensive error handling and logging

## 🏗️ Architecture

```
┌─────────────────────┐
│ OpenWeatherMap API  │
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ OWM Provider        │ ← Fetch raw data
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ NGSI-LD Transformer │ ← Convert to NGSI-LD format
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Orion-LD Client     │ ← Push to Context Broker
└──────────┬──────────┘
           │
           ▼
┌─────────────────────┐
│ Orion-LD Broker     │ ← Store context data
└─────────────────────┘
```

## 📂 Structure

```
ingestion/
├── dto/
│   └── ingestion-status.dto.ts      # Response DTOs
├── providers/
│   ├── openweathermap.provider.ts   # OWM API client
│   └── orion-client.provider.ts     # Orion-LD API client
├── schedulers/
│   └── ingestion.scheduler.ts       # Cron jobs
├── ingestion.controller.ts          # REST endpoints
├── ingestion.service.ts             # Orchestration logic
├── ingestion.module.ts              # Module definition
├── source_data.json                 # Monitoring locations
└── README.md                        # This file
```

## 🚀 Features

### 1. Data Collection

#### Current Observations

- **Air Quality**: CO, NO, NO2, O3, SO2, PM2.5, PM10, NH3, AQI (OpenWeather & US EPA)
- **Weather**: Temperature, humidity, pressure, wind, precipitation, visibility, cloudiness, sunrise/sunset

#### Forecast Data

- **Air Quality Forecast**: 96 hourly forecasts (4 days) with all pollutants
- **Weather Forecast**: 7 daily forecasts with min/max temps, precipitation probability, weather conditions

### 2. Data Providers

#### OpenWeatherMap Provider (`openweathermap.provider.ts`)

**Current Data APIs:**

- `getCurrentAirPollution(lat, lon)` - Real-time air quality
- `getCurrentWeather(lat, lon, units, lang)` - Real-time weather

**Forecast APIs:**

- `getAirPollutionForecast(lat, lon)` - 4-day hourly air quality forecast
- `getDailyForecast(lat, lon, cnt, units, lang)` - Up to 16-day daily weather forecast

**Historical APIs** (Paid):

- `getHistoricalAirPollution(lat, lon, start, end)` - Historical air pollution
- `getHistoricalWeather(lat, lon, start, end)` - Historical weather data
- `getHourlyForecast(lat, lon, cnt)` - 96-hour forecast (Paid endpoint)

**Configuration:**

- Timeout: 10 seconds
- Units: metric (Celsius), imperial (Fahrenheit), standard (Kelvin)
- Languages: Support for 40+ languages (default: Vietnamese)

#### Orion-LD Client (`orion-client.provider.ts`)

**Entity Operations:**

- `createEntity(entity)` - Create new entity (POST)
- `updateEntity(id, updates)` - Partial update (PATCH)
- `upsertEntity(entity)` - Create or update (POST with Upsert option)
- `upsertEntities(entities)` - Batch upsert for forecasts
- `deleteEntity(id)` - Remove entity
- `queryEntities(type, options)` - Query with filters

**Subscription Management:**

- `createSubscription(subscription)` - Subscribe to entity changes
- `listSubscriptions()` - Get all active subscriptions
- `deleteSubscription(id)` - Remove subscription

**Utilities:**

- `healthCheck()` - Check Orion-LD availability
- Built-in retry logic with exponential backoff

### 3. NGSI-LD Transformers (`common/transformers/ngsi-ld.transformer.ts`)

**Current Data Transformers:**

- `transformOWMAirPollutionToNGSILD()` → `AirQualityObserved`
- `transformOWMToNGSILD()` → `WeatherObserved`

**Forecast Data Transformers:**

- `transformOWMAirPollutionForecastToNGSILD()` → `AirQualityForecast[]` (96 entities)
- `transformOWMDailyForecastToNGSILD()` → `WeatherForecast[]` (7 entities)

**Helper Functions:**

- `createProperty(value, observedAt)` - NGSI-LD Property
- `createGeoProperty(lon, lat)` - GeoJSON Point
- `createRelationship(objectId)` - Entity relationship
- `createAddressProperty(locality, country)` - Structured address
- `generateEntityId(type, identifier)` - URN-based IDs
- `calculateAQI(pm25)` - US EPA AQI calculation

### 4. Automated Scheduling (`schedulers/ingestion.scheduler.ts`)

**Cron Configuration:**

```typescript
@Cron('0,30 * * * *', { timeZone: 'Asia/Ho_Chi_Minh' })
```

- Runs at **:00** and **:30** of every hour
- Timezone: Asia/Ho_Chi_Minh (UTC+7)
- Automatic recovery on failure
- Detailed execution logging

### 5. REST API Endpoints (`ingestion.controller.ts`)

#### Trigger Air Quality Ingestion

```http
POST /api/v1/ingestion/air-quality
Content-Type: application/json
```

**Response:**

```json
{
  "message": "Air quality data ingestion completed",
  "success": 5,
  "failed": 0,
  "forecastSuccess": 5,
  "forecastFailed": 0,
  "errors": []
}
```

#### Trigger Weather Ingestion

```http
POST /api/v1/ingestion/weather
Content-Type: application/json
```

**Response:**

```json
{
  "message": "Weather data ingestion completed",
  "success": 5,
  "failed": 0,
  "forecastSuccess": 5,
  "forecastFailed": 0,
  "errors": []
}
```

#### Trigger Full Ingestion (Recommended)

```http
POST /api/v1/ingestion/all
Content-Type: application/json
```

**Response:**

```json
{
  "message": "Full data ingestion completed",
  "airQuality": {
    "success": 5,
    "failed": 0,
    "forecastSuccess": 5,
    "forecastFailed": 0,
    "errors": []
  },
  "weather": {
    "success": 5,
    "failed": 0,
    "forecastSuccess": 5,
    "forecastFailed": 0,
    "errors": []
  }
}
```

#### Get Monitoring Locations

```http
GET /api/v1/ingestion/locations
```

**Response:**

```json
{
  "count": 5,
  "locations": [
    {
      "id": "urn:ngsi-ld:WeatherLocation:hoan-kien",
      "type": "WeatherLocation",
      "name": "Hồ Hoàn Kiếm",
      "district": "Hoàn Kiếm",
      "location": { "lat": 21.028511, "lon": 105.804817 }
    }
  ]
}
```

#### Health Check

```http
GET /api/v1/ingestion/health
```

**Response:**

```json
{
  "status": "healthy",
  "services": {
    "openWeatherMap": "configured",
    "orionLD": "accessible"
  }
}
```

#### Get Statistics

```http
GET /api/v1/ingestion/stats
```

**Response:**

```json
{
  "message": "Ingestion module statistics",
  "locations": 5,
  "endpoints": {
    "current": {
      "airQuality": "POST /api/v1/ingestion/air-quality",
      "weather": "POST /api/v1/ingestion/weather"
    },
    "all": "POST /api/v1/ingestion/all"
  },
  "description": "Current ingestion includes both real-time data and forecasts"
}
```

## 🔧 Configuration

### Environment Variables

```env
# OpenWeatherMap API
OWM_API_KEY=your_openweathermap_api_key

# Orion-LD Context Broker
ORION_LD_URL=http://localhost:1026
ORION_LD_API_VERSION=ngsi-ld/v1
ORION_LD_TENANT=
```

### Monitoring Locations

Edit `source_data.json` to add/remove monitoring locations:

```json
[
  {
    "id": "urn:ngsi-ld:WeatherLocation:hoan-kien",
    "type": "WeatherLocation",
    "name": "Hồ Hoàn Kiếm",
    "district": "Hoàn Kiếm",
    "location": {
      "lat": 21.028511,
      "lon": 105.804817
    }
  }
]
```

## 📊 Data Models

### Entity Types Produced

| Entity Type          | Description           | Frequency    | Count per Location |
| -------------------- | --------------------- | ------------ | ------------------ |
| `AirQualityObserved` | Real-time air quality | Every 30 min | 1                  |
| `AirQualityForecast` | 4-day hourly forecast | Every 30 min | 96                 |
| `WeatherObserved`    | Real-time weather     | Every 30 min | 1                  |
| `WeatherForecast`    | 7-day daily forecast  | Every 30 min | 7                  |

**Total entities per ingestion cycle:** ~525 entities (for 5 locations)

### AirQualityObserved (NGSI-LD)

**Entity ID Format:** `urn:ngsi-ld:AirQualityObserved:{CityName}-{lat}-{lon}`

```json
{
  "id": "urn:ngsi-ld:AirQualityObserved:HoanKiem-21.0285-105.8048",
  "type": "AirQualityObserved",
  "@context": ["https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld", "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"],
  "dateObserved": {
    "type": "Property",
    "value": "2025-11-18T10:35:57.000Z",
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8048, 21.0285]
    }
  },
  "address": {
    "type": "Property",
    "value": {
      "addressLocality": "Hoàn Kiếm",
      "addressCountry": "VN"
    }
  },
  "source": {
    "type": "Property",
    "value": "OpenWeatherMap"
  },
  "co": {
    "type": "Property",
    "value": 389.53,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "no": {
    "type": "Property",
    "value": 0,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "no2": {
    "type": "Property",
    "value": 8.89,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "o3": {
    "type": "Property",
    "value": 37.69,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "so2": {
    "type": "Property",
    "value": 2.45,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "pm25": {
    "type": "Property",
    "value": 19.55,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "pm10": {
    "type": "Property",
    "value": 20.22,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "nh3": {
    "type": "Property",
    "value": 1.23,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "airQualityIndex": {
    "type": "Property",
    "value": 2,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "airQualityLevel": {
    "type": "Property",
    "value": "Fair",
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "airQualityIndexUS": {
    "type": "Property",
    "value": 68,
    "observedAt": "2025-11-18T10:35:57.000Z"
  },
  "airQualityLevelUS": {
    "type": "Property",
    "value": "Moderate",
    "observedAt": "2025-11-18T10:35:57.000Z"
  }
}
```

**Pollutant Units:** All in µg/m³ (micrograms per cubic meter)

**AQI Scales:**

- **OpenWeather AQI**: 1-5 scale (Good, Fair, Moderate, Poor, Very Poor)
- **US EPA AQI**: 0-500 scale with 6 categories

### AirQualityForecast (NGSI-LD)

**Entity ID Format:** `urn:ngsi-ld:AirQualityForecast:{CityName}-{lat}-{lon}-{timestamp}`

```json
{
  "id": "urn:ngsi-ld:AirQualityForecast:HoanKiem-21.0285-105.8048-1700150400",
  "type": "AirQualityForecast",
  "@context": ["https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld", "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"],
  "dataProvider": {
    "type": "Property",
    "value": "OpenWeatherMap"
  },
  "validFrom": {
    "type": "Property",
    "value": "2025-11-18T12:00:00.000Z"
  },
  "validTo": {
    "type": "Property",
    "value": "2025-11-18T13:00:00.000Z"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8048, 21.0285]
    }
  },
  "address": {
    "type": "Property",
    "value": {
      "addressLocality": "Hoàn Kiếm",
      "addressCountry": "VN"
    }
  },
  "co": { "type": "Property", "value": 395.2 },
  "no2": { "type": "Property", "value": 9.1 },
  "o3": { "type": "Property", "value": 38.5 },
  "pm25": { "type": "Property", "value": 20.3 },
  "pm10": { "type": "Property", "value": 21.1 },
  "airQualityIndex": { "type": "Property", "value": 2 },
  "airQualityLevel": { "type": "Property", "value": "Fair" }
}
```

### WeatherObserved (NGSI-LD)

**Entity ID Format:** `urn:ngsi-ld:WeatherObserved:{CityName}-{lat}-{lon}`

```json
{
  "id": "urn:ngsi-ld:WeatherObserved:HoanKiem-21.0285-105.8048",
  "type": "WeatherObserved",
  "@context": ["https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld", "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"],
  "dateObserved": {
    "type": "Property",
    "value": "2025-11-18T10:30:00.000Z",
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8048, 21.0285]
    }
  },
  "address": {
    "type": "Property",
    "value": {
      "addressLocality": "Hoàn Kiếm",
      "addressCountry": "VN"
    }
  },
  "source": {
    "type": "Property",
    "value": "OpenWeatherMap"
  },
  "temperature": {
    "type": "Property",
    "value": 26.01,
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "feelsLikeTemperature": {
    "type": "Property",
    "value": 26.01,
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 0.94,
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "atmosphericPressure": {
    "type": "Property",
    "value": 1011,
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "windSpeed": {
    "type": "Property",
    "value": 2.06,
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "windDirection": {
    "type": "Property",
    "value": 330,
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "visibility": {
    "type": "Property",
    "value": 10000,
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "weatherType": {
    "type": "Property",
    "value": "Clouds",
    "observedAt": "2025-11-18T10:30:00.000Z"
  },
  "weatherDescription": {
    "type": "Property",
    "value": "broken clouds",
    "observedAt": "2025-11-18T10:30:00.000Z"
  }
}
```

**Temperature Units:** Celsius (when units=metric)
**Wind Speed Units:** m/s (meters per second)
**Pressure Units:** hPa (hectopascals)
**Humidity:** 0-1 range (0.94 = 94%)

### WeatherForecast (NGSI-LD)

**Entity ID Format:** `urn:ngsi-ld:WeatherForecast:{CityName}-{lat}-{lon}-{timestamp}`

```json
{
  "id": "urn:ngsi-ld:WeatherForecast:HoanKiem-21.0285-105.8048-1700179200",
  "type": "WeatherForecast",
  "@context": ["https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld", "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"],
  "dataProvider": {
    "type": "Property",
    "value": "OpenWeatherMap"
  },
  "dateIssued": {
    "type": "Property",
    "value": "2025-11-18T10:35:57.000Z"
  },
  "validFrom": {
    "type": "Property",
    "value": "2025-11-19T00:00:00.000Z"
  },
  "validTo": {
    "type": "Property",
    "value": "2025-11-19T23:59:59.999Z"
  },
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8048, 21.0285]
    }
  },
  "address": {
    "type": "Property",
    "value": {
      "addressLocality": "Hoàn Kiếm",
      "addressCountry": "VN"
    }
  },
  "temperature": {
    "type": "Property",
    "value": 26.5
  },
  "feelsLikeTemperature": {
    "type": "Property",
    "value": 27.2
  },
  "dayMaximum": {
    "type": "Property",
    "value": {
      "temperature": 28.3,
      "feelsLikeTemperature": 29.1,
      "relativeHumidity": 0.75
    }
  },
  "dayMinimum": {
    "type": "Property",
    "value": {
      "temperature": 24.1,
      "feelsLikeTemperature": 24.8,
      "relativeHumidity": 0.9
    }
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 0.82
  },
  "atmosphericPressure": {
    "type": "Property",
    "value": 1012
  },
  "windSpeed": {
    "type": "Property",
    "value": 2.5
  },
  "windDirection": {
    "type": "Property",
    "value": 310
  },
  "precipitationProbability": {
    "type": "Property",
    "value": 0.3
  },
  "precipitation": {
    "type": "Property",
    "value": 1.2
  },
  "weatherType": {
    "type": "Property",
    "value": "Clouds"
  },
  "weatherDescription": {
    "type": "Property",
    "value": "scattered clouds"
  }
}
```

## 🧪 Testing

### Quick Test with curl

#### 1. Check Health

```bash
curl http://localhost:8000/api/v1/ingestion/health
```

**Expected Output:**

```json
{
  "status": "healthy",
  "services": {
    "openWeatherMap": "configured",
    "orionLD": "accessible"
  }
}
```

#### 2. View Monitoring Locations

```bash
curl http://localhost:8000/api/v1/ingestion/locations
```

#### 3. Trigger Full Ingestion

```bash
curl -X POST http://localhost:8000/api/v1/ingestion/all
```

**Expected Output:**

```json
{
  "message": "Full data ingestion completed",
  "airQuality": {
    "success": 5,
    "failed": 0,
    "forecastSuccess": 5,
    "forecastFailed": 0,
    "errors": []
  },
  "weather": {
    "success": 5,
    "failed": 0,
    "forecastSuccess": 5,
    "forecastFailed": 0,
    "errors": []
  }
}
```

#### 4. Query Entities from Orion-LD

**Get Current Air Quality:**

```bash
curl "http://localhost:1026/ngsi-ld/v1/entities?type=https://smartdatamodels.org/dataModel.Environment/AirQualityObserved&limit=5" \
  -H "Accept: application/ld+json" | jq
```

**Get Air Quality Forecasts:**

```bash
curl "http://localhost:1026/ngsi-ld/v1/entities?type=https://smartdatamodels.org/dataModel.Environment/AirQualityForecast&limit=10" \
  -H "Accept: application/ld+json" | jq
```

**Get Current Weather:**

```bash
curl "http://localhost:1026/ngsi-ld/v1/entities?type=https://smartdatamodels.org/dataModel.Weather/WeatherObserved&limit=5" \
  -H "Accept: application/ld+json" | jq
```

**Get Weather Forecasts:**

```bash
curl "http://localhost:1026/ngsi-ld/v1/entities?type=https://smartdatamodels.org/dataModel.Weather/WeatherForecast&limit=10" \
  -H "Accept: application/ld+json" | jq
```

**Query Specific Location:**

```bash
curl "http://localhost:1026/ngsi-ld/v1/entities?type=https://smartdatamodels.org/dataModel.Weather/WeatherObserved&q=address.addressLocality==%22Hoàn%20Kiếm%22" \
  -H "Accept: application/ld+json" | jq
```

### Performance Metrics

**Per Ingestion Cycle (every 30 minutes):**

- Locations: 5
- Current Entities: 10 (5 AirQuality + 5 Weather)
- Forecast Entities: 515 (480 AirQuality + 35 Weather)
- Total: ~525 entities
- Duration: ~30-60 seconds
- API Calls: 20 (10 current + 10 forecast)

### Integration Tests

Run backend integration tests:

```bash
pnpm run test:e2e
```

### Unit Tests

Test individual services:

```bash
# Test OpenWeatherMap provider
pnpm run test -- openweathermap.provider

# Test Orion client
pnpm run test -- orion-client.provider

# Test transformers
pnpm run test -- ngsi-ld.transformer

# Test ingestion service
pnpm run test -- ingestion.service
```

## 📝 Logging

The module provides comprehensive logging at different levels:

### Log Levels

**DEBUG** - Detailed operation logs:

```log
[OpenWeatherMapProvider] Fetching air pollution data for lat=21.0285, lon=105.8048
[OpenWeatherMapProvider] Successfully fetched air pollution data for lat=21.0285, lon=105.8048
[OrionClientProvider] Upserting 1 entities to Orion-LD
[OrionClientProvider] Successfully upserted 1 entities
[IngestionService] ✓ Current air quality data ingested for Hồ Hoàn Kiếm
[IngestionService] ✓ Air quality forecast (96 entries) ingested for Hồ Hoàn Kiếm
```

**INFO** - Major operations:

```log
[IngestionService] Loaded 5 monitoring locations from source_data.json
[IngestionService] Starting air quality data ingestion (current + forecast) for 5 locations
[IngestionService] Air quality ingestion completed: Current(5/5), Forecast(5/5)
[IngestionScheduler] 🕐 Scheduled ingestion started at Mon Nov 18 2025 10:30:00
[IngestionScheduler] ✅ Scheduled ingestion completed - AQ[Current:5, Forecast:5], Weather[Current:5, Forecast:5]
```

**WARN** - Configuration issues:

```log
[OpenWeatherMapProvider] OWM_API_KEY is not configured. OpenWeatherMap provider will not work.
```

**ERROR** - Failures with stack traces:

```log
[IngestionService] ✗ Failed to ingest current air quality for Hồ Hoàn Kiếm
[OpenWeatherMapProvider] Failed to fetch air pollution data for lat=21.0285, lon=105.8048: API key invalid
```

### Viewing Logs

**Development:**

```bash
pnpm run start:dev
# Logs appear in console with colors
```

**Production:**

```bash
pnpm run start:prod > logs/ingestion.log 2>&1
# Logs saved to file
```

**Docker:**

```bash
docker logs -f backend --tail 100
# Follow logs from container
```

**Filter by Module:**

```bash
# Only ingestion logs
grep "Ingestion" logs/app.log

# Only errors
grep "ERROR" logs/app.log
```

## 🔐 Security

### Production Deployment

**⚠️ IMPORTANT:** The ingestion endpoints are currently **unprotected**. In production, you MUST add authentication:

#### Option 1: JWT Authentication

```typescript
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('ingestion')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin') // Only admins can trigger ingestion
export class IngestionController {
  // ...
}
```

#### Option 2: API Key Authentication

```typescript
import { ApiKeyGuard } from '../auth/guards/api-key.guard';

@Controller('ingestion')
@UseGuards(ApiKeyGuard)
export class IngestionController {
  // ...
}
```

#### Option 3: IP Whitelist

```typescript
@Controller('ingestion')
@UseGuards(IpWhitelistGuard)
export class IngestionController {
  // ...
}
```

### API Key Security

**Never commit API keys to Git:**

```bash
# .gitignore
.env
.env.local
.env.*.local
```

**Use environment-specific configs:**

```bash
# .env.development
OWM_API_KEY=dev_key_here

# .env.production
OWM_API_KEY=prod_key_here
```

**Rotate keys regularly:**

- OpenWeatherMap: https://home.openweathermap.org/api_keys
- Generate new key every 90 days

### Network Security

**Restrict Orion-LD access:**

```yaml
# docker-compose.yml
services:
  orion-ld:
    networks:
      - backend-network # Internal network only
    # Don't expose ports in production
```

**Use reverse proxy:**

```nginx
# nginx.conf
location /api/v1/ingestion {
    # Require authentication
    auth_request /auth;

    # Rate limiting
    limit_req zone=ingestion burst=5;

    proxy_pass http://backend:8000;
}
```

### Rate Limiting

Protect against abuse:

```typescript
import { ThrottlerGuard } from '@nestjs/throttler';

@Controller('ingestion')
@UseGuards(ThrottlerGuard)
export class IngestionController {
  // Max 10 requests per minute
}
```

### Audit Logging

Track who triggers manual ingestion:

```typescript
@Post('all')
async ingestAll(@Req() req) {
  this.logger.log(`Manual ingestion triggered by ${req.user?.email || 'anonymous'}`);
  // ...
}
```

## 📚 References

### Official Documentation

- **OpenWeatherMap API**
  - [Air Pollution API](https://openweathermap.org/api/air-pollution)
  - [Current Weather API](https://openweathermap.org/current)
  - [Daily Forecast API](https://openweathermap.org/forecast16)
  - [API Authentication](https://openweathermap.org/appid)
- **FIWARE Orion-LD**
  - [Official Documentation](https://fiware-orion.readthedocs.io/)
  - [NGSI-LD API Walkthrough](https://github.com/FIWARE/tutorials.NGSI-LD)
  - [Docker Installation](https://hub.docker.com/r/fiware/orion-ld)

- **NGSI-LD Specification**
  - [ETSI GS CIM 009 V1.4.1](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.04.01_60/gs_cim009v010401p.pdf)
  - [JSON-LD Context](https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld)

- **Smart Data Models**
  - [AirQualityObserved](https://github.com/smart-data-models/dataModel.Environment/tree/master/AirQualityObserved)
  - [AirQualityForecast](https://github.com/smart-data-models/dataModel.Environment/tree/master/AirQualityForecast)
  - [WeatherObserved](https://github.com/smart-data-models/dataModel.Weather/tree/master/WeatherObserved)
  - [WeatherForecast](https://github.com/smart-data-models/dataModel.Weather/tree/master/WeatherForecast)
  - [Smart Data Models Portal](https://smartdatamodels.org/)

### NestJS Documentation

- [NestJS Official Docs](https://docs.nestjs.com/)
- [Task Scheduling](https://docs.nestjs.com/techniques/task-scheduling)
- [Configuration](https://docs.nestjs.com/techniques/configuration)
- [HTTP Module](https://docs.nestjs.com/techniques/http-module)

### Related Documentation

- **Project Documentation**
  - [QUICKSTART.md](./QUICKSTART.md) - Quick start guide for developers
  - [FORECAST_INGESTION.md](./FORECAST_INGESTION.md) - Detailed forecast data documentation
  - [Backend README](../../README.md) - Overall backend documentation

- **API Documentation**
  - [OWM API Docs](../../docs/OWM_API/) - OpenWeatherMap API reference files
  - [NGSI-LD Examples](../../docs/NGSI-LD/) - NGSI-LD entity examples

### External Resources

- [FIWARE Catalogue](https://www.fiware.org/developers/catalogue/)
- [Context Broker Tutorials](https://fiware-tutorials.readthedocs.io/)
- [JSON-LD Playground](https://json-ld.org/playground/)
- [GeoJSON Specification](https://geojson.org/)

## 🤝 Contributing

### Development Workflow

1. **Fork and Clone**

   ```bash
   git clone https://github.com/your-username/Smart-Forecast.git
   cd Smart-Forecast/backend
   ```

2. **Create Feature Branch**

   ```bash
   git checkout -b feature/ingestion-enhancement
   ```

3. **Make Changes**
   - Follow existing code style
   - Add tests for new features
   - Update documentation

4. **Test Locally**

   ```bash
   pnpm run test
   pnpm run test:e2e
   pnpm run lint
   ```

5. **Commit and Push**

   ```bash
   git add .
   git commit -m "feat(ingestion): add support for historical data"
   git push origin feature/ingestion-enhancement
   ```

6. **Create Pull Request**
   - Describe changes clearly
   - Reference related issues
   - Ensure CI passes

### Code Style

- **TypeScript**: Follow NestJS conventions
- **Naming**:
  - Classes: `PascalCase`
  - Methods/Variables: `camelCase`
  - Constants: `UPPER_SNAKE_CASE`
  - Files: `kebab-case.ts`
- **Formatting**: Use Prettier (configured in `.prettierrc`)
- **Linting**: ESLint rules in `eslint.config.mjs`

### Testing Guidelines

- **Unit tests**: Test individual methods in isolation
- **Integration tests**: Test service interactions
- **E2E tests**: Test full ingestion flow
- **Coverage**: Aim for >80% code coverage

### Documentation

When adding features:

- Update relevant README files
- Add JSDoc comments to public methods
- Include usage examples
- Update API documentation

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](../../../LICENSE) file for details.

## 👥 Authors

- **Development Team** - NEU-DataVerse
- **Maintainers** - Smart Forecast Team

## 🆘 Support

- **Issues**: [GitHub Issues](https://github.com/NEU-DataVerse/Smart-Forecast/issues)
- **Discussions**: [GitHub Discussions](https://github.com/NEU-DataVerse/Smart-Forecast/discussions)
- **Email**: support@smart-forecast.example.com

---

**Last Updated**: November 18, 2025  
**Module Version**: 1.0.0  
**Backend Version**: See [package.json](../../package.json)

## 🐛 Troubleshooting

### Common Issues

#### 1. OWM_API_KEY not configured

**Symptom:**

```log
[OpenWeatherMapProvider] WARN OWM_API_KEY is not configured. OpenWeatherMap provider will not work.
```

**Solution:**

```bash
# Add to .env file
echo "OWM_API_KEY=your_api_key_here" >> .env

# Restart backend
pnpm run start:dev
```

**Verify:**

```bash
curl http://localhost:8000/api/v1/ingestion/health
# Should show: "openWeatherMap": "configured"
```

---

#### 2. Orion-LD not accessible

**Symptom:**

```json
{
  "status": "degraded",
  "services": {
    "openWeatherMap": "configured",
    "orionLD": "not accessible"
  }
}
```

**Solutions:**

**Check if Orion is running:**

```bash
docker ps | grep orion
# Should show orion-ld container

# If not running:
docker-compose up -d orion-ld mongodb
```

**Check Orion version endpoint:**

```bash
curl http://localhost:1026/version
# Should return JSON with version info
```

**Check connectivity:**

```bash
# Test from backend container
docker exec backend curl http://orion-ld:1026/version

# Check network
docker network inspect smart-forecast_default
```

**Verify environment variable:**

```bash
# In .env
ORION_LD_URL=http://localhost:1026
# or inside Docker network:
ORION_LD_URL=http://orion-ld:1026
```

---

#### 3. API Rate Limiting (429 Too Many Requests)

**Symptom:**

```log
[OpenWeatherMapProvider] ERROR Failed to fetch air pollution data: 429 Too Many Requests
```

**Causes:**

- Free plan: 60 calls/minute, 1,000,000 calls/month
- Current ingestion: 20 calls per cycle (every 30 min)

**Solutions:**

**Option 1 - Reduce frequency:**

```typescript
// In ingestion.scheduler.ts
@Cron('0 * * * *')  // Change to hourly instead of every 30 min
```

**Option 2 - Reduce locations:**

```json
// In source_data.json
// Remove some locations to reduce API calls
```

**Option 3 - Upgrade plan:**

- Visit: https://openweathermap.org/price
- Professional plan: 3,000 calls/minute

---

#### 4. Entities not appearing in Orion-LD

**Symptom:**

```bash
curl "http://localhost:1026/ngsi-ld/v1/entities?type=AirQualityObserved"
# Returns: []
```

**Diagnosis:**

**1. Check ingestion logs:**

```bash
grep "Successfully upserted" logs/app.log
# Should show successful upserts
```

**2. Query with full type URL:**

```bash
curl "http://localhost:1026/ngsi-ld/v1/entities?type=https://smartdatamodels.org/dataModel.Environment/AirQualityObserved&limit=1"
```

**3. Check MongoDB directly:**

```bash
docker exec mongodb mongo orion --eval "db.entities.find().limit(1).pretty()"
# Should show entities if ingestion succeeded
```

**4. Verify @context in transformer:**

```typescript
// Should include:
"@context": [
  "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"
]
```

---

#### 5. Vietnamese characters in entity IDs causing issues

**Symptom:**

```log
[OrionClientProvider] ERROR Failed to upsert entity: 400 Bad Request
```

**Cause:**
Entity IDs with special characters (ồ, ă, đ, etc.) need proper URL encoding.

**Solution:**
The transformer automatically converts:

```
"Hồ Hoàn Kiếm" → "H--Ho-n-Ki-m"
```

**Verify:**

```bash
# Entity ID should not contain special chars
curl "http://localhost:1026/ngsi-ld/v1/entities" | jq '.[].id'
# urn:ngsi-ld:AirQualityObserved:H--Ho-n-Ki-m-21.0285-105.8048
```

---

#### 6. Forecast entities not updating

**Symptom:**
Old forecast entities remain in Orion-LD.

**Cause:**
Orion-LD doesn't auto-delete expired entities.

```typescript
// Add to ingestion service
async cleanupOldForecasts() {
  const cutoffDate = new Date();
  cutoffDate.setDate(cutoffDate.getDate() - 7);
  // Query and delete entities with validTo < cutoffDate
}
```

---

#### 7. High memory usage

**Symptom:**
Backend memory grows over time.

**Cause:**

- Large number of forecast entities in memory
- Potential memory leaks

**Solutions:**

**Monitor memory:**

```bash
docker stats backend
```

**Limit batch size:**

```typescript
// In orion-client.provider.ts
async upsertEntities(entities: any[]): Promise<void> {
  const BATCH_SIZE = 50;
  for (let i = 0; i < entities.length; i += BATCH_SIZE) {
    const batch = entities.slice(i, i + BATCH_SIZE);
    await this.upsertEntity(batch);
  }
}
```

**Increase Node memory:**

```bash
# In package.json
"start:prod": "node --max-old-space-size=4096 dist/main"
```

---

#### 8. Scheduler not running

**Symptom:**
No automatic ingestion every 30 minutes.

**Diagnosis:**

**Check if scheduler is enabled:**

```typescript
// In app.module.ts
@Module({
  imports: [
    ScheduleModule.forRoot(),  // Must be present
    IngestionModule,
  ]
})
```

**Check timezone:**

```bash
# Verify server time
date
TZ=Asia/Ho_Chi_Minh date
```

**Check logs:**

```bash
grep "Scheduled ingestion" logs/app.log
# Should show entries every 30 minutes
```

**Manual trigger to verify scheduler works:**

```typescript
// In ingestion.scheduler.ts - temporarily change to:
@Cron('* * * * *')  // Every minute for testing
```

---

### Debug Mode

Enable verbose logging:

```typescript
// In main.ts
app.useLogger(['log', 'error', 'warn', 'debug', 'verbose']);
```

Or via environment:

```bash
LOG_LEVEL=debug pnpm run start:dev
```

### Getting Help

If issues persist:

1. **Check logs:** `logs/app.log` or console output
2. **Verify configuration:** `.env` file
3. **Test components individually:**
   - OWM API: `curl "https://api.openweathermap.org/data/2.5/weather?lat=21&lon=105&appid=YOUR_KEY"`
   - Orion: `curl http://localhost:1026/version`
   - MongoDB: `docker exec mongodb mongo --eval "db.version()"`
4. **Review documentation:** See `QUICKSTART.md` and `FORECAST_INGESTION.md`
5. **Open an issue:** Include logs, config (without secrets), and error messages
