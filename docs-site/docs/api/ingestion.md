---
sidebar_position: 7
title: Ingestion API
---

# Ingestion API

API thu thập dữ liệu từ các nguồn bên ngoài (OpenWeatherMap).

---

## Trigger thu thập tất cả dữ liệu

```http
POST /api/v1/ingestion/all
Authorization: Bearer <ADMIN_TOKEN>
```

Thu thập cả weather và air quality data từ tất cả stations.

---

## Thu thập dữ liệu thời tiết

```http
POST /api/v1/ingestion/weather
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Thu thập dữ liệu chất lượng không khí

```http
POST /api/v1/ingestion/air-quality
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Thu thập dữ liệu lịch sử

```http
POST /api/v1/ingestion/historical
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "startDate": "2025-01-01",
  "endDate": "2025-01-07",
  "types": ["weather", "air-quality"]
}
```

:::note

- Historical Weather API của OpenWeatherMap yêu cầu **paid subscription**
- Historical Air Quality API là **miễn phí**
  :::

---

## Danh sách địa điểm monitoring

```http
GET /api/v1/ingestion/locations
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "data": [
    {
      "stationId": "uuid",
      "name": "Trạm Hoàn Kiếm",
      "externalId": "HN-HK-001",
      "latitude": 21.0285,
      "longitude": 105.8542
    }
  ]
}
```

---

## Health check

```http
GET /api/v1/ingestion/health
```

**Response:**

```json
{
  "status": "ok",
  "services": {
    "openWeatherMap": "connected",
    "orionLd": "connected",
    "database": "connected"
  }
}
```

---

## Thống kê

```http
GET /api/v1/ingestion/stats
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "lastIngestion": "2025-01-15T10:00:00Z",
  "totalRecords": {
    "weather": 1500,
    "airQuality": 1500
  },
  "todayRecords": {
    "weather": 32,
    "airQuality": 32
  },
  "errors": []
}
```
