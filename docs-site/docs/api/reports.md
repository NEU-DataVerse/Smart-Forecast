---
sidebar_position: 11
title: Reports API
---

# Reports API

API xuất báo cáo dạng PDF hoặc CSV.

---

## Xuất báo cáo thời tiết

```http
GET /api/v1/reports/weather
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param     | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| format    | string | No       | pdf, csv (default: pdf)  |
| startDate | string | No       | Ngày bắt đầu (ISO 8601)  |
| endDate   | string | No       | Ngày kết thúc (ISO 8601) |
| stationId | string | No       | ID trạm cụ thể           |

**Response:** File download (PDF hoặc CSV)

---

## Xuất báo cáo chất lượng không khí

```http
GET /api/v1/reports/air-quality
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param     | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| format    | string | No       | pdf, csv (default: pdf)  |
| startDate | string | No       | Ngày bắt đầu (ISO 8601)  |
| endDate   | string | No       | Ngày kết thúc (ISO 8601) |
| stationId | string | No       | ID trạm cụ thể           |

---

## Xuất báo cáo sự cố

```http
GET /api/v1/reports/incidents
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param     | Type   | Required | Description              |
| --------- | ------ | -------- | ------------------------ |
| format    | string | No       | pdf, csv (default: pdf)  |
| startDate | string | No       | Ngày bắt đầu (ISO 8601)  |
| endDate   | string | No       | Ngày kết thúc (ISO 8601) |
| status    | string | No       | Lọc theo trạng thái      |
| type      | string | No       | Lọc theo loại sự cố      |

---

## Xuất báo cáo trạm

```http
GET /api/v1/reports/stations
Authorization: Bearer <ADMIN_TOKEN>
```

**Query Parameters:**

| Param  | Type   | Required | Description             |
| ------ | ------ | -------- | ----------------------- |
| format | string | No       | pdf, csv (default: pdf) |

---

## Ví dụ sử dụng

### Download PDF báo cáo thời tiết tuần qua

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/reports/weather?format=pdf&startDate=2025-01-08&endDate=2025-01-15" \
  -o weather-report.pdf
```

### Download CSV dữ liệu air quality

```bash
curl -H "Authorization: Bearer $TOKEN" \
  "http://localhost:8000/api/v1/reports/air-quality?format=csv&stationId=uuid" \
  -o air-quality-data.csv
```
