---
sidebar_position: 6
title: Stations API
---

# Stations API

API quản lý trạm quan trắc.

---

## Danh sách trạm

```http
GET /api/v1/stations
```

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "name": "Trạm Hoàn Kiếm",
      "externalId": "HN-HK-001",
      "city": "Hà Nội",
      "country": "VN",
      "location": {
        "type": "Point",
        "coordinates": [105.8542, 21.0285]
      },
      "priority": "HIGH",
      "isActive": true,
      "inMaintenance": false,
      "createdAt": "2025-01-01T00:00:00Z"
    }
  ]
}
```

---

## Trạm đang hoạt động

```http
GET /api/v1/stations/active
```

---

## Tìm trạm gần nhất theo GPS

```http
GET /api/v1/stations/nearest
```

**Query Parameters:**

| Param | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| lat   | number | Yes      | Vĩ độ       |
| lon   | number | Yes      | Kinh độ     |

---

## Thống kê trạm

```http
GET /api/v1/stations/stats
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "total": 4,
  "active": 4,
  "inactive": 0,
  "maintenance": 0,
  "byCity": [{ "city": "Hà Nội", "count": 4 }],
  "byPriority": [
    { "priority": "HIGH", "count": 2 },
    { "priority": "MEDIUM", "count": 2 }
  ]
}
```

---

## Chi tiết trạm

```http
GET /api/v1/stations/:id
```

---

## Tạo trạm mới (Admin)

```http
POST /api/v1/stations
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "Trạm Hoàn Kiếm",
  "externalId": "HN-HK-001",
  "city": "Hà Nội",
  "country": "VN",
  "latitude": 21.0285,
  "longitude": 105.8542,
  "priority": "HIGH"
}
```

---

## Cập nhật trạm (Admin)

```http
PUT /api/v1/stations/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "name": "Trạm Hoàn Kiếm - Updated",
  "priority": "MEDIUM"
}
```

---

## Xóa trạm (Admin)

```http
DELETE /api/v1/stations/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Đặt trạm vào chế độ bảo trì (Admin)

```http
POST /api/v1/stations/:id/maintenance
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "inMaintenance": true
}
```

---

## Kích hoạt trạm

```http
POST /api/v1/stations/:id/activate
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Vô hiệu hóa trạm

```http
POST /api/v1/stations/:id/deactivate
Authorization: Bearer <ADMIN_TOKEN>
```
