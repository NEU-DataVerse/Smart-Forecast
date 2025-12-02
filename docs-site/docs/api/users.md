---
sidebar_position: 8
title: Users API
---

# Users API

API quản lý người dùng.

---

## Danh sách users (Admin)

```http
GET /api/v1/users
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param | Type   | Required | Description     |
| ----- | ------ | -------- | --------------- |
| role  | string | No       | ADMIN, USER     |
| page  | number | No       | Trang           |
| limit | number | No       | Số record/trang |

**Response:**

```json
{
  "data": [
    {
      "id": "uuid",
      "email": "user@example.com",
      "name": "Nguyễn Văn A",
      "role": "USER",
      "avatarUrl": "https://...",
      "isActive": true,
      "createdAt": "2025-01-15T10:00:00Z"
    }
  ],
  "meta": {
    "total": 100,
    "page": 1,
    "limit": 20,
    "totalPages": 5
  }
}
```

---

## Chi tiết user (Admin)

```http
GET /api/v1/users/:id
Authorization: Bearer <ADMIN_TOKEN>
```

---

## Cập nhật FCM token

Cập nhật Firebase Cloud Messaging token để nhận push notifications.

```http
PUT /api/v1/users/fcm-token
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "fcmToken": "firebase_cloud_messaging_token"
}
```

**Response:**

```json
{
  "message": "FCM token updated successfully"
}
```

---

## Cập nhật vị trí user

```http
PATCH /api/v1/users/:id/location
Authorization: Bearer <USER_TOKEN>
Content-Type: application/json

{
  "latitude": 21.0285,
  "longitude": 105.8542
}
```

**Response:**

```json
{
  "message": "Location updated successfully",
  "location": {
    "latitude": 21.0285,
    "longitude": 105.8542
  }
}
```
