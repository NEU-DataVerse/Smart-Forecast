---
sidebar_position: 4
title: Alert API
---

# Alert API

API quản lý cảnh báo và ngưỡng cảnh báo tự động.

:::caution Lưu ý
Đường dẫn API là `/alert` (không có 's')
:::

---

## Danh sách cảnh báo

```http
GET /api/v1/alert
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

---

## Cảnh báo đang hoạt động

```http
GET /api/v1/alert/active
```

---

## Tạo cảnh báo mới

```http
POST /api/v1/alert
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

---

## Cập nhật cảnh báo

```http
PATCH /api/v1/alert/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Xóa cảnh báo

```http
DELETE /api/v1/alert/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Thống kê cảnh báo

```http
GET /api/v1/alert/stats
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Xu hướng cảnh báo 30 ngày

```http
GET /api/v1/alert/stats/trend
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Trigger kiểm tra ngưỡng (Admin)

```http
POST /api/v1/alert/trigger-check
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Dọn dẹp FCM tokens (Admin)

```http
POST /api/v1/alert/cleanup-tokens
Authorization: Bearer <ADMIN_TOKEN>
```

---

# Alert Thresholds API

Quản lý ngưỡng cảnh báo tự động.

---

## Danh sách ngưỡng cảnh báo

```http
GET /api/v1/alert/thresholds
```

---

## Ngưỡng cảnh báo đang hoạt động

```http
GET /api/v1/alert/thresholds/active
```

---

## Chi tiết ngưỡng cảnh báo

```http
GET /api/v1/alert/thresholds/:id
```

---

## Tạo ngưỡng cảnh báo mới (Admin)

```http
POST /api/v1/alert/thresholds
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "Cảnh báo AQI cao",
  "metric": "aqi",
  "operator": ">",
  "value": 150,
  "severity": "high",
  "isActive": true
}
```

---

## Cập nhật ngưỡng cảnh báo (Admin)

```http
PUT /api/v1/alert/thresholds/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Xóa ngưỡng cảnh báo (Admin)

```http
DELETE /api/v1/alert/thresholds/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Bật/tắt ngưỡng cảnh báo (Admin)

```http
POST /api/v1/alert/thresholds/:id/toggle
Authorization: Bearer <ADMIN_TOKEN>
```
