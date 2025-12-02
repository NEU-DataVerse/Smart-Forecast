---
sidebar_position: 10
title: Dashboard API
---

# Dashboard API

API lấy dữ liệu tổng hợp cho dashboard.

---

## Tổng quan dashboard

```http
GET /api/v1/dashboard/summary
Authorization: Bearer <ADMIN_TOKEN>
```

**Response:**

```json
{
  "stations": {
    "total": 4,
    "active": 4,
    "inactive": 0,
    "maintenance": 0
  },
  "alerts": {
    "total": 10,
    "active": 3,
    "critical": 1,
    "high": 2,
    "medium": 4,
    "low": 3
  },
  "incidents": {
    "total": 25,
    "pending": 5,
    "processing": 3,
    "resolved": 15,
    "rejected": 2
  },
  "airQuality": {
    "averageAqi": 85,
    "category": "moderate",
    "stations": [
      {
        "name": "Hoàn Kiếm",
        "aqi": 75,
        "category": "moderate"
      },
      {
        "name": "Hà Đông",
        "aqi": 95,
        "category": "moderate"
      }
    ]
  },
  "weather": {
    "averageTemperature": 25.5,
    "averageHumidity": 75
  },
  "lastUpdated": "2025-01-15T10:05:00Z"
}
```

---

## Dữ liệu realtime

Dashboard sử dụng dữ liệu từ các API khác:

- **Thời tiết**: [Weather API](./weather) → `/weather/current`
- **Chất lượng không khí**: [Air Quality API](./air-quality) → `/air-quality/current`
- **Cảnh báo**: [Alert API](./alert) → `/alert/active`
- **Sự cố**: [Incident API](./incident) → `/incident?status=pending`

---

## Caching

Dashboard summary được cache **1 phút** trong Redis để tối ưu performance.

Để force refresh, thêm query param:

```http
GET /api/v1/dashboard/summary?refresh=true
Authorization: Bearer <ADMIN_TOKEN>
```
