---
sidebar_position: 3
title: Air Quality API
---

# Air Quality API

API lấy dữ liệu chất lượng không khí và chỉ số AQI.

---

## Chất lượng không khí hiện tại

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

---

## Dự báo chất lượng không khí

```http
GET /api/v1/air-quality/forecast
```

---

## Lịch sử chất lượng không khí

```http
GET /api/v1/air-quality/history
```

**Query Parameters:**

| Param     | Type   | Required | Description                   |
| --------- | ------ | -------- | ----------------------------- |
| stationId | string | No       | ID trạm cụ thể                |
| startDate | string | No       | Ngày bắt đầu (ISO 8601)       |
| endDate   | string | No       | Ngày kết thúc (ISO 8601)      |
| page      | number | No       | Trang (default: 1)            |
| limit     | number | No       | Số record/trang (default: 50) |

---

## Chất lượng không khí theo trạm

```http
GET /api/v1/air-quality/station/:stationId
```

---

## Chất lượng không khí theo tọa độ GPS

```http
GET /api/v1/air-quality/nearby
```

**Query Parameters:**

| Param | Type   | Required | Description |
| ----- | ------ | -------- | ----------- |
| lat   | number | Yes      | Vĩ độ       |
| lon   | number | Yes      | Kinh độ     |

---

## So sánh chất lượng không khí giữa các trạm (Admin)

```http
GET /api/v1/air-quality/compare
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param      | Type   | Required | Description                         |
| ---------- | ------ | -------- | ----------------------------------- |
| stationIds | string | Yes      | Danh sách ID trạm (comma-separated) |
| startDate  | string | No       | Ngày bắt đầu (ISO 8601)             |
| endDate    | string | No       | Ngày kết thúc (ISO 8601)            |

---

## Thống kê AQI trung bình (Admin)

```http
GET /api/v1/air-quality/stats/averages
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param     | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| startDate | string | No       | Ngày bắt đầu (ISO 8601)  |
| endDate   | string | No       | Ngày kết thúc (ISO 8601) |
| groupBy   | string | No       | day, week, month         |
