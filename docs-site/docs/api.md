---
sidebar_position: 5
title: API Documentation
---

# 📡 API Documentation

Tài liệu REST API của Smart Forecast Backend.

---

## 🔐 Authentication

Tất cả API endpoints (trừ login/register) yêu cầu JWT token trong header.

### Login

```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**

```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "role": "ADMIN"
  }
}
```

### Sử dụng Token

```http
GET /api/v1/weather/current
Authorization: Bearer <JWT_TOKEN>
```

---

## 👥 Roles & Permissions

| Role      | Quyền hạn                                 |
| --------- | ----------------------------------------- |
| `ADMIN`   | Toàn quyền quản lý hệ thống               |
| `MANAGER` | Quản lý alerts, incidents, xem reports    |
| `CITIZEN` | Xem dữ liệu, nhận cảnh báo, gửi incidents |

---

## 🌡️ Weather API

### Lấy thời tiết hiện tại

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

### Dự báo thời tiết

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

### Lịch sử thời tiết

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

### Thời tiết theo trạm

```http
GET /api/v1/weather/station/:stationId
```

---

## 🌬️ Air Quality API

### Chất lượng không khí hiện tại

```http
GET /api/v1/air-quality/current
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
      "id": "urn:ngsi-ld:AirQualityObserved:hanoi-01",
      "type": "AirQualityObserved",
      "dateObserved": "2025-01-15T10:00:00Z",
      "location": {
        "type": "Point",
        "coordinates": [105.8542, 21.0285]
      },
      "aqi": 85,
      "aqiCategory": "moderate",
      "pm25": 35.2,
      "pm10": 65.8,
      "no2": 28.5,
      "so2": 12.3,
      "o3": 45.6,
      "co": 0.8
    }
  ],
  "source": "orion-ld",
  "timestamp": "2025-01-15T10:05:00Z"
}
```

### Dự báo chất lượng không khí

```http
GET /api/v1/air-quality/forecast
```

### Lịch sử chất lượng không khí

```http
GET /api/v1/air-quality/history
```

### Chất lượng không khí theo trạm

```http
GET /api/v1/air-quality/station/:stationId
```

---

## 🚨 Alerts API

### Danh sách cảnh báo

```http
GET /api/v1/alerts
```

**Query Parameters:**

| Param    | Type   | Required | Description                       |
| -------- | ------ | -------- | --------------------------------- |
| status   | string | No       | active, resolved, expired         |
| severity | string | No       | low, medium, high, critical       |
| type     | string | No       | weather, air_quality, flood, fire |
| page     | number | No       | Trang                             |
| limit    | number | No       | Số record/trang                   |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Cảnh báo bão số 5",
      "description": "Bão số 5 đang di chuyển...",
      "severity": "high",
      "type": "weather",
      "status": "active",
      "affectedAreas": ["Hà Nội", "Hải Phòng"],
      "startTime": "2025-01-15T08:00:00Z",
      "endTime": "2025-01-16T20:00:00Z",
      "createdBy": "admin@example.com",
      "createdAt": "2025-01-15T07:00:00Z"
    }
  ],
  "meta": {
    "total": 50,
    "page": 1,
    "limit": 20,
    "totalPages": 3
  }
}
```

### Tạo cảnh báo mới

```http
POST /api/v1/alerts
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "title": "Cảnh báo bão số 5",
  "description": "Bão số 5 đang di chuyển về phía Bắc...",
  "severity": "high",
  "type": "weather",
  "affectedAreas": ["Hà Nội", "Hải Phòng"],
  "startTime": "2025-01-15T08:00:00Z",
  "endTime": "2025-01-16T20:00:00Z"
}
```

### Cập nhật cảnh báo

```http
PATCH /api/v1/alerts/:id
Authorization: Bearer <ADMIN_TOKEN>
```

### Xóa cảnh báo

```http
DELETE /api/v1/alerts/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📝 Incidents API

### Danh sách sự cố

```http
GET /api/v1/incidents
```

**Query Parameters:**

| Param  | Type   | Required | Description                             |
| ------ | ------ | -------- | --------------------------------------- |
| status | string | No       | pending, processing, resolved, rejected |
| type   | string | No       | flood, fire, pollution, other           |
| page   | number | No       | Trang                                   |
| limit  | number | No       | Số record/trang                         |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "title": "Ngập đường Cầu Giấy",
      "description": "Nước ngập cao khoảng 50cm...",
      "type": "flood",
      "status": "processing",
      "location": {
        "type": "Point",
        "coordinates": [105.7894, 21.0367]
      },
      "address": "123 Cầu Giấy, Hà Nội",
      "images": [
        "https://minio.example.com/incidents/img1.jpg"
      ],
      "reportedBy": {
        "id": "uuid",
        "name": "Nguyễn Văn A"
      },
      "createdAt": "2025-01-15T09:30:00Z",
      "updatedAt": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": {...}
}
```

### Tạo báo cáo sự cố

```http
POST /api/v1/incidents
Authorization: Bearer <USER_TOKEN>
Content-Type: multipart/form-data

title: Ngập đường Cầu Giấy
description: Nước ngập cao khoảng 50cm
type: flood
latitude: 21.0367
longitude: 105.7894
address: 123 Cầu Giấy, Hà Nội
images: [file1.jpg, file2.jpg]
```

### Cập nhật trạng thái sự cố

```http
PATCH /api/v1/incidents/:id/status
Authorization: Bearer <MANAGER_TOKEN>
Content-Type: application/json

{
  "status": "resolved",
  "note": "Đã xử lý và khắc phục"
}
```

---

## 📍 Stations API

### Danh sách trạm

```http
GET /api/v1/stations
```

### Trạm đang hoạt động

```http
GET /api/v1/stations/active
```

### Kích hoạt/Vô hiệu hóa trạm

```http
POST /api/v1/stations/:id/activate
POST /api/v1/stations/:id/deactivate
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 🔄 Ingestion API

### Trigger thu thập dữ liệu

```http
POST /api/v1/ingestion/all
Authorization: Bearer <ADMIN_TOKEN>
```

### Health check

```http
GET /api/v1/ingestion/health
```

### Thống kê

```http
GET /api/v1/ingestion/stats
Authorization: Bearer <ADMIN_TOKEN>
```

---

## 📊 Response Format

### Success Response

```json
{
  "data": {...},
  "message": "Success",
  "statusCode": 200
}
```

### Error Response

```json
{
  "statusCode": 400,
  "message": "Validation failed",
  "error": "Bad Request",
  "errors": [
    {
      "field": "email",
      "message": "Invalid email format"
    }
  ]
}
```

### Pagination Response

```json
{
  "data": [...],
  "meta": {
    "total": 150,
    "page": 1,
    "limit": 20,
    "totalPages": 8
  }
}
```

---

## ⚡ Performance Notes

| Endpoint               | Latency   | Cache         |
| ---------------------- | --------- | ------------- |
| `/weather/current`     | 100-500ms | Redis 5 phút  |
| `/weather/forecast`    | 100-500ms | Redis 30 phút |
| `/weather/history`     | 50-200ms  | No cache      |
| `/air-quality/current` | 100-500ms | Redis 5 phút  |
| `/incidents`           | 20-100ms  | No cache      |

---

## 🧪 Testing với cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@example.com","password":"password"}' \
  | jq -r '.access_token')

# 2. Get current weather
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/weather/current

# 3. Get air quality history
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/air-quality/history?page=1&limit=10"

# 4. Create alert
curl -X POST http://localhost:8000/api/v1/alerts \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Alert","severity":"low","type":"weather"}'
```

---

## 📖 Tiếp theo

- [Data Models](./data-model.md) - NGSI-LD entities chi tiết
- [Hướng dẫn phát triển](./dev-guide.md) - Development workflow
- [Troubleshooting](./troubleshooting.md) - Xử lý lỗi
