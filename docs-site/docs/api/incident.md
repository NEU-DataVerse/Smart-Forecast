---
sidebar_position: 5
title: Incident API
---

# Incident API

API báo cáo và xử lý sự cố từ người dân.

:::caution Lưu ý
Đường dẫn API là `/incident` (không có 's')
:::

---

## Danh sách sự cố

```http
GET /api/v1/incident
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

---

## Tạo báo cáo sự cố

```http
POST /api/v1/incident
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

---

## Lấy sự cố theo ID

```http
GET /api/v1/incident/:id
```

---

## Cập nhật trạng thái sự cố

```http
PUT /api/v1/incident/:id
Authorization: Bearer <ADMIN_TOKEN>
Content-Type: application/json

{
  "status": "resolved",
  "note": "Đã xử lý và khắc phục"
}
```

---

## Xóa sự cố (Admin)

```http
DELETE /api/v1/incident/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Danh sách sự cố của user hiện tại

```http
GET /api/v1/incident/my-reports
Authorization: Bearer <USER_TOKEN>
```

---

## Thống kê sự cố theo loại (Admin)

```http
GET /api/v1/incident/stats/by-type
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "data": [
    { "type": "flood", "count": 15 },
    { "type": "fire", "count": 8 },
    { "type": "pollution", "count": 12 },
    { "type": "other", "count": 5 }
  ]
}
```

---

## Thống kê sự cố theo trạng thái (Admin)

```http
GET /api/v1/incident/stats/by-status
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "data": [
    { "status": "pending", "count": 5 },
    { "status": "processing", "count": 3 },
    { "status": "resolved", "count": 25 },
    { "status": "rejected", "count": 2 }
  ]
}
```

---

## Xu hướng sự cố 30 ngày (Admin)

```http
GET /api/v1/incident/stats/trend
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "data": [
    { "date": "2025-01-01", "count": 3 },
    { "date": "2025-01-02", "count": 5 },
    ...
  ]
}
```
