---
sidebar_position: 1
title: Tổng quan API
---

# API Documentation

Tài liệu REST API của Smart Forecast Backend.

---

## Swagger UI

:::tip Interactive API Documentation
Backend cung cấp Swagger UI để test API trực tiếp:

- **URL**: http://localhost:8000/api
- **OpenAPI JSON**: http://localhost:8000/api-json

Swagger UI cho phép bạn:

- Xem tất cả endpoints với mô tả chi tiết
- Test API trực tiếp từ trình duyệt
- Xem request/response schemas
  :::

---

## Authentication

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

### Google OAuth (Mobile)

```http
POST /api/v1/auth/google
Content-Type: application/json

{
  "idToken": "google_id_token_from_mobile_app"
}
```

### Lấy thông tin user hiện tại

```http
GET /api/v1/auth/me
Authorization: Bearer <JWT_TOKEN>
```

**Response:**

```json
{
  "id": "uuid",
  "email": "user@example.com",
  "name": "Nguyễn Văn A",
  "role": "USER",
  "avatarUrl": "https://...",
  "createdAt": "2025-01-15T10:00:00Z"
}
```

---

## Roles & Permissions

| Role    | Quyền hạn                                 |
| ------- | ----------------------------------------- |
| `ADMIN` | Toàn quyền quản lý hệ thống               |
| `USER`  | Xem dữ liệu, nhận cảnh báo, gửi incidents |

---

## Response Format

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

## Performance Notes

| Endpoint               | Latency   | Cache         |
| ---------------------- | --------- | ------------- |
| `/weather/current`     | 100-500ms | Redis 5 phút  |
| `/weather/forecast`    | 100-500ms | Redis 30 phút |
| `/weather/history`     | 50-200ms  | No cache      |
| `/air-quality/current` | 100-500ms | Redis 5 phút  |
| `/incident`            | 20-100ms  | No cache      |
| `/alert`               | 20-100ms  | No cache      |
| `/dashboard/summary`   | 50-200ms  | Redis 1 phút  |

---

## Testing với cURL

```bash
# 1. Login
TOKEN=$(curl -s -X POST http://localhost:8000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"admin@smartforecast.com","password":"admin123"}' \
  | jq -r '.access_token')

# 2. Get current weather
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/weather/current

# 3. Get air quality history
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/air-quality/history?page=1&limit=10"

# 4. Create alert
curl -X POST http://localhost:8000/api/v1/alert \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"title":"Test Alert","severity":"low","type":"weather"}'

# 5. Get dashboard summary
curl -H "Authorization: Bearer $TOKEN" \
  http://localhost:8000/api/v1/dashboard/summary
```

---

## API Sections

| API                          | Mô tả                                         |
| ---------------------------- | --------------------------------------------- |
| [Weather](./weather)         | Dữ liệu thời tiết hiện tại, dự báo và lịch sử |
| [Air Quality](./air-quality) | Chất lượng không khí và AQI                   |
| [Alert](./alert)             | Quản lý cảnh báo và ngưỡng cảnh báo           |
| [Incident](./incident)       | Báo cáo và xử lý sự cố                        |
| [Stations](./stations)       | Quản lý trạm quan trắc                        |
| [Ingestion](./ingestion)     | Thu thập dữ liệu từ nguồn bên ngoài           |
| [Users](./users)             | Quản lý người dùng                            |
| [Files](./files)             | Upload và quản lý files                       |
| [Dashboard](./dashboard)     | Dữ liệu tổng hợp cho dashboard                |
| [Reports](./reports)         | Xuất báo cáo PDF/CSV                          |

---

## Tiếp theo

- [Data Models](../data-model) - NGSI-LD entities chi tiết
- [Hướng dẫn phát triển](../dev-guide) - Development workflow
- [Troubleshooting](../troubleshooting) - Xử lý lỗi
