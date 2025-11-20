# Smart Forecast API Endpoints

## Overview

All endpoints return data in OpenWeatherMap-compatible format with Unix UTC timestamps.

## Base URL

```
http://localhost:8000/api/v1
```

---

## Stations Module

### List All Stations

```
GET /stations
```

**Query Parameters:**

- `city` (optional): Filter by city name

**Response Example:**

```json
[
  {
    "id": "urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien",
    "name": "Hoàn Kiếm District",
    "city": "Hanoi",
    "location": {
      "type": "Point",
      "coordinates": [105.804817, 21.028511]
    },
    "address": "Hoàn Kiếm, Hanoi, Vietnam",
    "timezone": 25200
  }
]
```

### Get Station by ID

```
GET /stations/:id
```

**Path Parameters:**

- `id`: Station URN identifier

**Response:** Single station object

---

## Air Quality Module

### Get Current Air Quality

```
GET /airquality/current/:stationId
```

**Path Parameters:**

- `stationId`: Station URN identifier (e.g., `urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien`)

**Response Example:**

```json
{
  "id": "urn:ngsi-ld:AirQualityObserved:hanoi-hoan-kien-1732099200",
  "type": "AirQualityObserved",
  "dateObserved": "2025-11-20T10:00:00Z",
  "location": {
    "type": "Point",
    "coordinates": [105.804817, 21.028511]
  },
  "pm25": 35.5,
  "pm10": 45.2,
  "no2": 12.5,
  "so2": 3.4,
  "co": 203.6,
  "o3": 68.2,
  "aqi": 85,
  "aqiCategory": "Moderate",
  "source": "OpenWeatherMap"
}
```

### Get Air Quality History

```
GET /airquality/history/:stationId
```

**Path Parameters:**

- `stationId`: Station URN identifier

**Query Parameters:**

- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string
- `limit` (optional): Max number of records (default: 100)

**Response Example:**

```json
[
  {
    "timestamp": "2025-11-20T00:00:00Z",
    "aqi": 75,
    "pm25": 28.5,
    "pm10": 42.1,
    "category": "Moderate"
  }
]
```

### Get Air Quality Forecast

```
GET /airquality/forecast/:stationId
```

**Path Parameters:**

- `stationId`: Station URN identifier

**Query Parameters:**

- `hours` (optional): Number of hours to forecast (default: 96, max: 96)

**Response Example (OWM Format):**

```json
{
  "coord": {
    "lat": 21.028511,
    "lon": 105.804817
  },
  "list": [
    {
      "dt": 1732104000,
      "main": {
        "aqi": 3
      },
      "components": {
        "co": 203.6,
        "no": 0.1,
        "no2": 12.5,
        "o3": 68.2,
        "so2": 3.4,
        "pm2_5": 28.3,
        "pm10": 45.1,
        "nh3": 0.5
      }
    }
  ]
}
```

---

## Weather Module

### Get Current Weather

```
GET /weather/current/:stationId
```

**Path Parameters:**

- `stationId`: Station URN identifier

**Response Example:**

```json
{
  "id": "urn:ngsi-ld:WeatherObserved:hanoi-hoan-kien-1732099200",
  "type": "WeatherObserved",
  "dateObserved": "2025-11-20T10:00:00Z",
  "location": {
    "type": "Point",
    "coordinates": [105.804817, 21.028511]
  },
  "temperature": 28.5,
  "feelsLikeTemperature": 30.2,
  "relativeHumidity": 65,
  "atmosphericPressure": 1013,
  "windSpeed": 3.5,
  "windDirection": 180,
  "precipitation": 0,
  "weatherType": "Clear",
  "weatherDescription": "clear sky",
  "visibility": 10000,
  "uvIndex": 7,
  "source": "OpenWeatherMap"
}
```

### Get Weather History

```
GET /weather/history/:stationId
```

**Path Parameters:**

- `stationId`: Station URN identifier

**Query Parameters:**

- `startDate` (optional): ISO 8601 date string
- `endDate` (optional): ISO 8601 date string
- `limit` (optional): Max number of records (default: 100)

**Response Example:**

```json
[
  {
    "timestamp": "2025-11-20T00:00:00Z",
    "temperature": 25.5,
    "humidity": 70,
    "precipitation": 0,
    "weatherType": "Clouds"
  }
]
```

### Get Weather Forecast

```
GET /weather/forecast/:stationId
```

**Path Parameters:**

- `stationId`: Station URN identifier

**Query Parameters:**

- `days` (optional): Number of days to forecast (default: 7, max: 16)

**Response Example (OWM Format):**

```json
{
  "city": {
    "coord": {
      "lat": 21.028511,
      "lon": 105.804817
    },
    "name": "Hanoi",
    "country": "VN",
    "timezone": 25200
  },
  "list": [
    {
      "dt": 1732104000,
      "temp": {
        "day": 28.5,
        "min": 22.1,
        "max": 31.2,
        "night": 23.5,
        "eve": 27.8,
        "morn": 24.2
      },
      "feels_like": {
        "day": 30.2,
        "night": 24.5,
        "eve": 29.1,
        "morn": 25.3
      },
      "pressure": 1013,
      "humidity": 65,
      "weather": [
        {
          "id": 800,
          "main": "Clear",
          "description": "clear sky",
          "icon": "01d"
        }
      ],
      "speed": 3.5,
      "deg": 180,
      "gust": 5.2,
      "clouds": 10,
      "pop": 0.1,
      "rain": 0,
      "snow": 0
    }
  ]
}
```

---

## Data Format Notes

### Timestamps

- All timestamps are in **Unix UTC format** (seconds since epoch)
- Use `dt` field for forecast timestamps
- Use `dateObserved` for current observations
- Use `timestamp` for historical data points

### Temperature

- All temperatures in **Celsius**

### Air Quality Index (AQI)

- Scale: 1-5 (OpenWeatherMap format)
- Categories: Good, Moderate, Unhealthy for Sensitive Groups, Unhealthy, Very Unhealthy, Hazardous

### Coordinates

- Format: [longitude, latitude]
- Example: [105.804817, 21.028511]

### Timezone

- UTC offset in seconds
- Vietnam (UTC+7): 25200 seconds

---

## Error Responses

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Station not found",
  "error": "Not Found"
}
```

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": ["Invalid station ID format"],
  "error": "Bad Request"
}
```

---

## Available Stations

Currently monitoring 5 locations in Hanoi:

1. **Hoàn Kiếm District**
   - ID: `urn:ngsi-ld:WeatherLocation:hanoi-hoan-kien`
   - Coordinates: [105.804817, 21.028511]

2. **Ba Đình District**
   - ID: `urn:ngsi-ld:WeatherLocation:hanoi-ba-dinh`
   - Coordinates: [105.823481, 21.034938]

3. **Hai Bà Trưng District**
   - ID: `urn:ngsi-ld:WeatherLocation:hanoi-hai-ba-trung`
   - Coordinates: [105.852381, 21.009006]

4. **Cầu Giấy District**
   - ID: `urn:ngsi-ld:WeatherLocation:hanoi-cau-giay`
   - Coordinates: [105.793431, 21.029207]

5. **Đống Đa District**
   - ID: `urn:ngsi-ld:WeatherLocation:hanoi-dong-da`
   - Coordinates: [105.825539, 21.017709]
