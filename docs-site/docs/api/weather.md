---
sidebar_position: 2
title: Weather API
---

# Weather API

API lấy dữ liệu thời tiết hiện tại, dự báo và lịch sử.

---

## Lấy thời tiết hiện tại

```http
GET /api/v1/weather/current
```

**Query Parameters:**

| Param     | Type   | Required | Description        |
| --------- | ------ | -------- | ------------------ |
| stationId | string | No       | ID trạm cụ thể     |
| city      | string | No       | Lọc theo thành phố |

**Response:**

```json
{
  "data": [
    {
      "id": "urn:ngsi-ld:WeatherObserved:hanoi-01",
      "type": "WeatherObserved",
      "dateObserved": "2025-01-15T10:00:00Z",
      "location": {
        "type": "Point",
        "coordinates": [105.8542, 21.0285]
      },
      "temperature": 25.5,
      "humidity": 75,
      "windSpeed": 12.5,
      "windDirection": 180,
      "precipitation": 0,
      "atmosphericPressure": 1013,
      "weatherType": "clear"
    }
  ],
  "source": "orion-ld",
  "timestamp": "2025-01-15T10:05:00Z"
}
```

---

## Dự báo thời tiết

```http
GET /api/v1/weather/forecast
```

**Query Parameters:**

| Param     | Type   | Required | Description    |
| --------- | ------ | -------- | -------------- |
| stationId | string | No       | ID trạm cụ thể |

**Response:**

```json
{
  "data": [
    {
      "id": "urn:ngsi-ld:WeatherForecast:hanoi-01-2025-01-16",
      "date": "2025-01-16",
      "temperatureMin": 20,
      "temperatureMax": 28,
      "humidity": 70,
      "precipitationProbability": 30,
      "weatherType": "partly_cloudy"
    }
  ],
  "source": "orion-ld",
  "timestamp": "2025-01-15T10:05:00Z"
}
```

---

## Lịch sử thời tiết

```http
GET /api/v1/weather/history
```

**Query Parameters:**

| Param     | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| stationId | string | No       | ID trạm cụ thể                |
| startDate | string | No       | Ngày bắt đầu (ISO 8601)       |
| endDate   | string | No       | Ngày kết thúc (ISO 8601)      |
| page      | number | No       | Trang (default: 1)            |
| limit     | number | No       | Số record/trang (default: 50) |

**Response:**

```json
{
  "data": [...],
  "meta": {
    "total": 1500,
    "page": 1,
    "limit": 50,
    "totalPages": 30
  }
}
```

---

## Thời tiết theo trạm

```http
GET /api/v1/weather/station/:stationId
```

---

## Thời tiết theo tọa độ GPS

```http
GET /api/v1/weather/nearby
```

**Query Parameters:**

| Param | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| lat   | number | Yes      | Vĩ độ       |
| lon   | number | Yes      | Kinh độ     |

---

## So sánh thời tiết giữa các trạm (Admin)

```http
GET /api/v1/weather/compare
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param      | Type   | Required | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| stationIds | string | Yes      | Danh sách ID trạm (comma-separated) |
| startDate  | string | No       | Ngày bắt đầu (ISO 8601)             |
| endDate    | string | No       | Ngày kết thúc (ISO 8601)            |

---

## Xu hướng thời tiết (Admin)

```http
GET /api/v1/weather/trends
Authorization: Bearer <ADMIN_TOKEN>
```
