---
sidebar_position: 6
title: Data Models
---

# Data Models

Mô hình dữ liệu NGSI-LD và cấu trúc database của Smart Forecast.

---

## NGSI-LD Overview

Smart Forecast sử dụng **NGSI-LD** (Next Generation Service Interface - Linked Data) làm chuẩn dữ liệu cho dữ liệu môi trường. NGSI-LD là tiêu chuẩn của ETSI, được FIWARE Foundation phát triển.

### Tại sao NGSI-LD?

- **Tiêu chuẩn quốc tế** - ETSI NGSI-LD specification
- **Linked Data** - JSON-LD format với ngữ cảnh (context)
- **Smart Data Models** - Sử dụng models chuẩn của FIWARE
- **Interoperability** - Dễ tích hợp với các hệ thống Smart City khác

### Context Broker

Orion-LD là Context Broker chính, lưu trữ và quản lý các NGSI-LD entities.

```
┌─────────────────┐
│   Data Source   │
│ (OpenWeatherMap)│
└────────┬────────┘
         │
         ▼
┌─────────────────┐     ┌─────────────────┐
│  Ingestion      │────►│   Orion-LD      │
│  Service        │     │ Context Broker  │
└─────────────────┘     └────────┬────────┘
                                 │
                        ┌────────┴────────┐
                        │                 │
                        ▼                 ▼
                   ┌─────────┐      ┌──────────┐
                   │ MongoDB │      │PostgreSQL│
                   │(entities)│     │(history) │
                   └─────────┘      └──────────┘
```

---

## WeatherObserved

Entity type cho dữ liệu thời tiết quan trắc được.

### Schema

```typescript
interface WeatherObserved {
  id: string; // "urn:ngsi-ld:WeatherObserved:{stationId}-{timestamp}"
  type: 'WeatherObserved';

  // Location
  location: GeoProperty; // GeoJSON Point
  address?: {
    addressLocality: string;
    addressCountry: string;
  };

  // Time
  dateObserved: DateTime;

  // Temperature
  temperature: number; // °C

  // Humidity
  relativeHumidity: number; // 0-1 (percentage)

  // Pressure
  atmosphericPressure: number; // hPa
  pressureTendency?: number;

  // Wind
  windSpeed: number; // m/s
  windDirection: number; // degrees (0-360)

  // Precipitation
  precipitation: number; // mm
  snowHeight?: number; // cm

  // Other
  illuminance?: number; // lux
  uVIndexMax?: number;

  // Metadata
  source: string;
  dataProvider: string;
  refDevice?: string; // Relationship to Device entity
}
```

### Ví dụ NGSI-LD (Normalized)

```json
{
  "id": "urn:ngsi-ld:WeatherObserved:hanoi-01-2025-01-15T10:00:00Z",
  "type": "WeatherObserved",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8542, 21.0285]
    }
  },
  "address": {
    "type": "Property",
    "value": {
      "addressLocality": "Hà Nội",
      "addressCountry": "VN"
    }
  },
  "dateObserved": {
    "type": "Property",
    "value": "2025-01-15T10:00:00Z"
  },
  "temperature": {
    "type": "Property",
    "value": 25.5,
    "unitCode": "CEL"
  },
  "relativeHumidity": {
    "type": "Property",
    "value": 0.75
  },
  "atmosphericPressure": {
    "type": "Property",
    "value": 1013.25,
    "unitCode": "HPA"
  },
  "windSpeed": {
    "type": "Property",
    "value": 12.5,
    "unitCode": "MTS"
  },
  "windDirection": {
    "type": "Property",
    "value": 180
  },
  "precipitation": {
    "type": "Property",
    "value": 0,
    "unitCode": "MMT"
  },
  "source": {
    "type": "Property",
    "value": "OpenWeatherMap"
  },
  "@context": [
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"
  ]
}
```

### Ví dụ NGSI-LD (Key-Values)

```json
{
  "id": "urn:ngsi-ld:WeatherObserved:hanoi-01-2025-01-15T10:00:00Z",
  "type": "WeatherObserved",
  "location": {
    "type": "Point",
    "coordinates": [105.8542, 21.0285]
  },
  "dateObserved": "2025-01-15T10:00:00Z",
  "temperature": 25.5,
  "relativeHumidity": 0.75,
  "atmosphericPressure": 1013.25,
  "windSpeed": 12.5,
  "windDirection": 180,
  "precipitation": 0,
  "@context": ["https://smart-data-models.github.io/dataModel.Weather/context.jsonld"]
}
```

---

## AirQualityObserved

Entity type cho dữ liệu chất lượng không khí.

### Schema

```typescript
interface AirQualityObserved {
  id: string; // "urn:ngsi-ld:AirQualityObserved:{stationId}-{timestamp}"
  type: 'AirQualityObserved';

  // Location
  location: GeoProperty;
  address?: PostalAddress;

  // Time
  dateObserved: DateTime;

  // Air Quality Index
  airQualityIndex: number; // 0-500
  airQualityLevel: 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

  // Particulate Matter
  pm25?: number; // µg/m³
  pm10?: number; // µg/m³
  pm4?: number;

  // Gases
  no2?: number; // µg/m³
  no?: number;
  nox?: number;
  so2?: number;
  co?: number; // mg/m³
  o3?: number;

  // Weather conditions
  temperature?: number;
  relativeHumidity?: number;
  windSpeed?: number;
  windDirection?: number;

  // Metadata
  source: string;
  reliability?: number; // 0-1
  typeOfLocation: 'indoor' | 'outdoor';
}
```

### Ví dụ NGSI-LD

```json
{
  "id": "urn:ngsi-ld:AirQualityObserved:hanoi-01-2025-01-15T10:00:00Z",
  "type": "AirQualityObserved",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8542, 21.0285]
    }
  },
  "dateObserved": {
    "type": "Property",
    "value": "2025-01-15T10:00:00Z"
  },
  "airQualityIndex": {
    "type": "Property",
    "value": 85
  },
  "airQualityLevel": {
    "type": "Property",
    "value": "moderate"
  },
  "pm25": {
    "type": "Property",
    "value": 35.2,
    "unitCode": "GQ"
  },
  "pm10": {
    "type": "Property",
    "value": 65.8,
    "unitCode": "GQ"
  },
  "no2": {
    "type": "Property",
    "value": 28.5,
    "unitCode": "GQ"
  },
  "so2": {
    "type": "Property",
    "value": 12.3,
    "unitCode": "GQ"
  },
  "co": {
    "type": "Property",
    "value": 0.8,
    "unitCode": "GP"
  },
  "@context": [
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"
  ]
}
```

---

## AirQualityForecast

Entity type cho dự báo chất lượng không khí.

### Schema

```typescript
interface AirQualityForecast {
  id: string; // "urn:ngsi-ld:AirQualityForecast:{stationId}-{timestamp}"
  type: 'AirQualityForecast';

  // Location
  location: GeoProperty;
  address?: PostalAddress;

  // Time
  dateIssued: DateTime; // Thời điểm phát hành dự báo
  validFrom: DateTime; // Thời điểm bắt đầu hiệu lực
  validTo: DateTime; // Thời điểm kết thúc hiệu lực

  // Air Quality Index Forecast
  airQualityIndex: number; // 0-500
  airQualityLevel: 'good' | 'moderate' | 'unhealthy' | 'very_unhealthy' | 'hazardous';

  // Particulate Matter Forecast
  pm25?: number; // µg/m³
  pm10?: number; // µg/m³

  // Gases Forecast
  no2?: number; // µg/m³
  so2?: number;
  co?: number; // mg/m³
  o3?: number;

  // Confidence
  reliability?: number; // 0-1 (độ tin cậy của dự báo)

  // Metadata
  source: string;
  dataProvider: string;
}
```

### Ví dụ NGSI-LD

```json
{
  "id": "urn:ngsi-ld:AirQualityForecast:hanoi-01-2025-01-16T00:00:00Z",
  "type": "AirQualityForecast",
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8542, 21.0285]
    }
  },
  "dateIssued": {
    "type": "Property",
    "value": "2025-01-15T12:00:00Z"
  },
  "validFrom": {
    "type": "Property",
    "value": "2025-01-16T00:00:00Z"
  },
  "validTo": {
    "type": "Property",
    "value": "2025-01-16T23:59:59Z"
  },
  "airQualityIndex": {
    "type": "Property",
    "value": 95
  },
  "airQualityLevel": {
    "type": "Property",
    "value": "moderate"
  },
  "pm25": {
    "type": "Property",
    "value": 42.5,
    "unitCode": "GQ"
  },
  "pm10": {
    "type": "Property",
    "value": 78.2,
    "unitCode": "GQ"
  },
  "no2": {
    "type": "Property",
    "value": 32.0,
    "unitCode": "GQ"
  },
  "reliability": {
    "type": "Property",
    "value": 0.85
  },
  "source": {
    "type": "Property",
    "value": "OpenWeatherMap"
  },
  "@context": [
    "https://raw.githubusercontent.com/smart-data-models/dataModel.Environment/master/context.jsonld"
  ]
}
```

---

## WeatherForecast

Entity type cho dự báo thời tiết.

### Schema

```typescript
interface WeatherForecast {
  id: string;
  type: 'WeatherForecast';

  // Time
  dateIssued: DateTime;
  validFrom: DateTime;
  validTo: DateTime;

  // Location
  location: GeoProperty;

  // Forecast
  temperature: number;
  feelsLikeTemperature?: number;
  relativeHumidity: number;
  precipitationProbability: number; // 0-100
  precipitation?: number;

  // Wind
  windSpeed: number;
  windDirection: number;

  // Weather type
  weatherType: string; // "clear", "cloudy", "rain", etc.

  // Metadata
  source: string;
  dayMaximum?: { temperature: number };
  dayMinimum?: { temperature: number };
}
```

---

## PostgreSQL Schema

### users

```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255),
  role VARCHAR(50) DEFAULT 'CITIZEN', -- ADMIN, MANAGER, CITIZEN
  fcm_token VARCHAR(500),
  avatar_url VARCHAR(500),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_role ON users(role);
```

### alerts

```sql
CREATE TABLE alerts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  severity VARCHAR(50) NOT NULL, -- low, medium, high, critical
  type VARCHAR(100) NOT NULL, -- weather, flood, fire, air_quality
  status VARCHAR(50) DEFAULT 'active', -- active, resolved, expired
  affected_areas JSONB,
  start_time TIMESTAMP,
  end_time TIMESTAMP,
  created_by UUID REFERENCES users(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_alerts_status ON alerts(status);
CREATE INDEX idx_alerts_type ON alerts(type);
CREATE INDEX idx_alerts_severity ON alerts(severity);
```

### incidents

```sql
CREATE TABLE incidents (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(500) NOT NULL,
  description TEXT,
  type VARCHAR(100) NOT NULL, -- flood, fire, pollution, other
  status VARCHAR(50) DEFAULT 'pending', -- pending, processing, resolved, rejected
  location GEOGRAPHY(POINT, 4326),
  address VARCHAR(500),
  images JSONB DEFAULT '[]',
  reported_by UUID REFERENCES users(id),
  processed_by UUID REFERENCES users(id),
  process_note TEXT,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_type ON incidents(type);
CREATE INDEX idx_incidents_location ON incidents USING GIST(location);
```

### stations

```sql
CREATE TABLE stations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  external_id VARCHAR(255) UNIQUE NOT NULL, -- ID từ OpenWeatherMap
  name VARCHAR(255) NOT NULL,
  city VARCHAR(255),
  country VARCHAR(10),
  location GEOGRAPHY(POINT, 4326),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_stations_external_id ON stations(external_id);
CREATE INDEX idx_stations_city ON stations(city);
```

### weather_history

```sql
CREATE TABLE weather_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stations(id),
  date_observed TIMESTAMP NOT NULL,
  temperature DECIMAL(5,2),
  humidity DECIMAL(5,2),
  pressure DECIMAL(7,2),
  wind_speed DECIMAL(5,2),
  wind_direction INTEGER,
  precipitation DECIMAL(5,2),
  weather_type VARCHAR(100),
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_weather_history_station ON weather_history(station_id);
CREATE INDEX idx_weather_history_date ON weather_history(date_observed);
CREATE INDEX idx_weather_history_station_date ON weather_history(station_id, date_observed);
```

### air_quality_history

```sql
CREATE TABLE air_quality_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  station_id UUID REFERENCES stations(id),
  date_observed TIMESTAMP NOT NULL,
  aqi INTEGER,
  aqi_category VARCHAR(50),
  pm25 DECIMAL(6,2),
  pm10 DECIMAL(6,2),
  no2 DECIMAL(6,2),
  so2 DECIMAL(6,2),
  co DECIMAL(6,2),
  o3 DECIMAL(6,2),
  raw_data JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

CREATE INDEX idx_air_quality_history_station ON air_quality_history(station_id);
CREATE INDEX idx_air_quality_history_date ON air_quality_history(date_observed);
CREATE INDEX idx_air_quality_history_station_date ON air_quality_history(station_id, date_observed);
```

---

## Smart Data Models References

| Model              | Documentation                                                                                       |
| ------------------ | --------------------------------------------------------------------------------------------------- |
| WeatherObserved    | [GitHub](https://github.com/smart-data-models/dataModel.Weather/tree/master/WeatherObserved)        |
| WeatherForecast    | [GitHub](https://github.com/smart-data-models/dataModel.Weather/tree/master/WeatherForecast)        |
| AirQualityObserved | [GitHub](https://github.com/smart-data-models/dataModel.Environment/tree/master/AirQualityObserved) |
| AirQualityForecast | [GitHub](https://github.com/smart-data-models/dataModel.Environment/tree/master/AirQualityForecast) |

---

## Tiếp theo

- [API Documentation](./api) - REST API endpoints
- [Hướng dẫn phát triển](./dev-guide) - Development workflow
- [Kiến trúc hệ thống](./architecture) - System architecture
