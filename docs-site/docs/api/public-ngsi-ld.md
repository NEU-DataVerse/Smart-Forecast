---
sidebar_position: 11
title: Public NGSI-LD API
---

# Public NGSI-LD API

API công khai để truy cập dữ liệu NGSI-LD từ Orion-LD Context Broker.

:::info Đặc điểm

- **Không yêu cầu xác thực** - Dành cho demo và tích hợp bên ngoài
- **Chỉ đọc (Read-only)** - Không thể tạo, sửa, xóa entities
- **Định dạng JSON-LD** - Tuân thủ chuẩn NGSI-LD
- **CORS mở** - Cho phép truy cập từ mọi domain
  :::

---

## Base URL

```
http://localhost:8000/api/v1/public/ngsi-ld
```

---

## Entity Types có sẵn

| Short Name           | Full URI                                                               | Mô tả                                            |
| -------------------- | ---------------------------------------------------------------------- | ------------------------------------------------ |
| `WeatherObserved`    | `https://smartdatamodels.org/dataModel.Weather/WeatherObserved`        | Dữ liệu thời tiết hiện tại từ các trạm quan trắc |
| `WeatherForecast`    | `https://smartdatamodels.org/dataModel.Weather/WeatherForecast`        | Dự báo thời tiết 7 ngày                          |
| `WeatherAlert`       | `https://smartdatamodels.org/dataModel.Weather/WeatherAlert`           | Cảnh báo thời tiết                               |
| `AirQualityObserved` | `https://smartdatamodels.org/dataModel.Environment/AirQualityObserved` | Dữ liệu chất lượng không khí hiện tại            |
| `AirQualityForecast` | `https://smartdatamodels.org/dataModel.Environment/AirQualityForecast` | Dự báo chất lượng không khí 4 ngày               |

---

## Endpoints

### 1. Liệt kê Entity Types

```http
GET /api/v1/public/ngsi-ld/types
```

**Response:**

```json
{
  "@context": "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
  "typeList": [
    {
      "type": "https://smartdatamodels.org/dataModel.Weather/WeatherObserved",
      "description": "Current weather observations from weather stations"
    },
    {
      "type": "https://smartdatamodels.org/dataModel.Environment/AirQualityObserved",
      "description": "Current air quality measurements (AQI, PM2.5, PM10, etc.)"
    }
  ]
}
```

---

### 2. Query Entities

```http
GET /api/v1/public/ngsi-ld/entities
```

**Query Parameters:**

| Param         | Type   | Required | Default    | Description                            |
| ------------- | ------ | -------- | ---------- | -------------------------------------- |
| `type`        | string | No       | -          | Entity type (short name hoặc full URI) |
| `limit`       | number | No       | 20         | Số lượng entities trả về (1-100)       |
| `offset`      | number | No       | 0          | Số entities bỏ qua (pagination)        |
| `q`           | string | No       | -          | NGSI-LD query expression               |
| `attrs`       | string | No       | -          | Danh sách attributes (comma-separated) |
| `georel`      | string | No       | -          | Geo-relationship                       |
| `geometry`    | string | No       | -          | Geometry type (Point, Polygon, etc.)   |
| `coordinates` | string | No       | -          | Tọa độ cho geo-query                   |
| `geoproperty` | string | No       | `location` | Geo-property để query                  |

**Response:** Mảng các NGSI-LD entities theo định dạng JSON-LD.

---

### 3. Lấy Entity theo ID

```http
GET /api/v1/public/ngsi-ld/entities/:id
```

**Path Parameters:**

| Param | Type   | Required | Description                                          |
| ----- | ------ | -------- | ---------------------------------------------------- |
| `id`  | string | Yes      | Entity ID (URN format: `urn:ngsi-ld:EntityType:xxx`) |

**Query Parameters:**

| Param   | Type   | Required | Description                            |
| ------- | ------ | -------- | -------------------------------------- |
| `attrs` | string | No       | Danh sách attributes (comma-separated) |

**Response:** Single NGSI-LD entity theo định dạng JSON-LD.

---

## Ví dụ sử dụng

### Lấy tất cả dữ liệu thời tiết hiện tại

```bash
curl "http://localhost:8000/api/v1/public/ngsi-ld/entities?type=WeatherObserved&limit=10"
```

**Response:**

```json
[
  {
    "@context": [
      "https://uri.etsi.org/ngsi-ld/v1/ngsi-ld-core-context.jsonld",
      "https://raw.githubusercontent.com/smart-data-models/dataModel.Weather/master/context.jsonld"
    ],
    "id": "urn:ngsi-ld:WeatherObserved:HN-HD-001",
    "type": "https://smartdatamodels.org/dataModel.Weather/WeatherObserved",
    "dateObserved": {
      "type": "Property",
      "value": "2025-12-03T10:00:00Z",
      "observedAt": "2025-12-03T10:00:00Z"
    },
    "location": {
      "type": "GeoProperty",
      "value": {
        "type": "Point",
        "coordinates": [105.8342, 21.0278]
      }
    },
    "https://smartdatamodels.org/dataModel.Weather/temperature": {
      "type": "Property",
      "value": 25.5,
      "observedAt": "2025-12-03T10:00:00Z"
    },
    "cloudiness": {
      "type": "Property",
      "value": 75,
      "observedAt": "2025-12-03T10:00:00Z"
    },
    "relativeHumidity": {
      "type": "Property",
      "value": 0.8,
      "observedAt": "2025-12-03T10:00:00Z"
    }
  }
]
```

---

### Lấy dữ liệu chất lượng không khí

```bash
curl "http://localhost:8000/api/v1/public/ngsi-ld/entities?type=AirQualityObserved&limit=5"
```

---

### Query với điều kiện (q parameter)

```bash
# Lấy weather observations có cloudiness > 50%
curl "http://localhost:8000/api/v1/public/ngsi-ld/entities?type=WeatherObserved&q=cloudiness>50&limit=5"

# Nhiều điều kiện (AND)
curl "http://localhost:8000/api/v1/public/ngsi-ld/entities?type=WeatherObserved&q=cloudiness>50;cloudiness<100&limit=5"
```

**Operators cho q parameter:**

| Operator | Ý nghĩa           | Ví dụ                 |
| -------- | ----------------- | --------------------- |
| `==`     | Bằng              | `cloudiness==75`      |
| `!=`     | Khác              | `cloudiness!=0`       |
| `>`      | Lớn hơn           | `cloudiness>50`       |
| `<`      | Nhỏ hơn           | `cloudiness<100`      |
| `>=`     | Lớn hơn hoặc bằng | `cloudiness>=50`      |
| `<=`     | Nhỏ hơn hoặc bằng | `cloudiness<=100`     |
| `~=`     | Pattern match     | `weatherType~="rain"` |

:::warning Lưu ý về attribute names
Attribute names trong `q` parameter phải khớp với cách lưu trong Orion-LD:

- Attributes có short name (như `cloudiness`, `relativeHumidity`): dùng trực tiếp
- Attributes có full URI: cần encode URL

```bash
# Short name attribute
curl "...?q=cloudiness>50"

# Full URI attribute (cần URL encode)
curl "...?q=https%3A%2F%2Fsmartdatamodels.org%2FdataModel.Weather%2Ftemperature>20"
```

:::

---

### Geo-Query: Tìm entities gần một điểm

```bash
# Tìm weather observations trong bán kính 5km từ Hà Nội
curl -G "http://localhost:8000/api/v1/public/ngsi-ld/entities" \
  --data-urlencode "type=WeatherObserved" \
  --data-urlencode "georel=near;maxDistance==5000" \
  --data-urlencode "geometry=Point" \
  --data-urlencode "coordinates=[105.8342,21.0278]" \
  --data-urlencode "limit=10"
```

**georel formats:**

| Format                       | Ý nghĩa                                  |
| ---------------------------- | ---------------------------------------- |
| `near;maxDistance==<meters>` | Trong bán kính (bắt buộc có maxDistance) |
| `within`                     | Nằm trong geometry                       |
| `contains`                   | Chứa geometry                            |
| `intersects`                 | Giao với geometry                        |
| `equals`                     | Trùng geometry                           |
| `disjoint`                   | Không giao với geometry                  |

---

### Lấy entity cụ thể theo ID

```bash
curl "http://localhost:8000/api/v1/public/ngsi-ld/entities/urn:ngsi-ld:WeatherObserved:HN-HD-001"
```

---

### Chỉ lấy một số attributes

```bash
# Chỉ lấy temperature và cloudiness
curl -G "http://localhost:8000/api/v1/public/ngsi-ld/entities" \
  --data-urlencode "type=WeatherObserved" \
  --data-urlencode "attrs=https://smartdatamodels.org/dataModel.Weather/temperature,cloudiness" \
  --data-urlencode "limit=5"
```

---

## JavaScript/TypeScript Client

```typescript
const PUBLIC_API_BASE = 'http://localhost:8000/api/v1/public/ngsi-ld';

// Lấy danh sách entity types
async function getEntityTypes() {
  const response = await fetch(`${PUBLIC_API_BASE}/types`);
  return response.json();
}

// Query entities
async function queryEntities(params: {
  type?: string;
  limit?: number;
  offset?: number;
  q?: string;
}) {
  const searchParams = new URLSearchParams();

  if (params.type) searchParams.append('type', params.type);
  if (params.limit) searchParams.append('limit', params.limit.toString());
  if (params.offset) searchParams.append('offset', params.offset.toString());
  if (params.q) searchParams.append('q', params.q);

  const response = await fetch(`${PUBLIC_API_BASE}/entities?${searchParams}`);
  return response.json();
}

// Lấy entity theo ID
async function getEntityById(id: string) {
  const response = await fetch(`${PUBLIC_API_BASE}/entities/${encodeURIComponent(id)}`);
  if (!response.ok) throw new Error('Entity not found');
  return response.json();
}

// Sử dụng
const weatherData = await queryEntities({
  type: 'WeatherObserved',
  limit: 10,
  q: 'cloudiness>50',
});

console.log(weatherData);
```

---

## Python Client

```python
import requests
from urllib.parse import urlencode

PUBLIC_API_BASE = 'http://localhost:8000/api/v1/public/ngsi-ld'

def get_entity_types():
    """Lấy danh sách entity types"""
    response = requests.get(f'{PUBLIC_API_BASE}/types')
    return response.json()

def query_entities(entity_type=None, limit=20, offset=0, q=None):
    """Query NGSI-LD entities"""
    params = {'limit': limit, 'offset': offset}

    if entity_type:
        params['type'] = entity_type
    if q:
        params['q'] = q

    response = requests.get(f'{PUBLIC_API_BASE}/entities', params=params)
    return response.json()

def get_entity_by_id(entity_id):
    """Lấy entity theo ID"""
    response = requests.get(f'{PUBLIC_API_BASE}/entities/{entity_id}')
    response.raise_for_status()
    return response.json()

# Sử dụng
weather_data = query_entities(
    entity_type='WeatherObserved',
    limit=10,
    q='cloudiness>50'
)

for entity in weather_data:
    print(f"ID: {entity['id']}")
    print(f"Temperature: {entity.get('https://smartdatamodels.org/dataModel.Weather/temperature', {}).get('value')}")
```

---

## NGSI-LD Data Structure

### Property

```json
{
  "temperature": {
    "type": "Property",
    "value": 25.5,
    "observedAt": "2025-12-03T10:00:00Z"
  }
}
```

### GeoProperty

```json
{
  "location": {
    "type": "GeoProperty",
    "value": {
      "type": "Point",
      "coordinates": [105.8342, 21.0278]
    }
  }
}
```

### Relationship

```json
{
  "locationId": {
    "type": "Relationship",
    "object": "urn:ngsi-ld:ObservationStation:HN-HD"
  }
}
```

---

## Smart Data Models References

API này sử dụng các data models từ [Smart Data Models](https://smartdatamodels.org/):

| Data Model         | Documentation                                                                                     |
| ------------------ | ------------------------------------------------------------------------------------------------- |
| WeatherObserved    | [Link](https://github.com/smart-data-models/dataModel.Weather/tree/master/WeatherObserved)        |
| WeatherForecast    | [Link](https://github.com/smart-data-models/dataModel.Weather/tree/master/WeatherForecast)        |
| WeatherAlert       | [Link](https://github.com/smart-data-models/dataModel.Weather/tree/master/WeatherAlert)           |
| AirQualityObserved | [Link](https://github.com/smart-data-models/dataModel.Environment/tree/master/AirQualityObserved) |
| AirQualityForecast | [Link](https://github.com/smart-data-models/dataModel.Environment/tree/master/AirQualityForecast) |

---

## Error Responses

### 400 Bad Request

```json
{
  "statusCode": 400,
  "message": "Invalid entity type 'InvalidType'. Allowed types: WeatherObserved, AirQualityObserved, WeatherForecast, AirQualityForecast, WeatherAlert",
  "error": "Bad Request"
}
```

### 404 Not Found

```json
{
  "statusCode": 404,
  "message": "Entity with ID 'urn:ngsi-ld:WeatherObserved:XXX' not found",
  "error": "Not Found"
}
```

---

## So sánh với Orion-LD trực tiếp

| Tính năng      | Public API                   | Orion-LD trực tiếp               |
| -------------- | ---------------------------- | -------------------------------- |
| Authentication | Không cần                    | Không có sẵn (cần cấu hình thêm) |
| Entity types   | Giới hạn 5 types             | Tất cả types                     |
| Operations     | Chỉ GET (read)               | Full CRUD                        |
| URL            | `/api/v1/public/ngsi-ld/...` | `:1026/ngsi-ld/v1/...`           |
| Rate limiting  | Không (demo)                 | Không                            |
| CORS           | Mở                           | Tùy cấu hình                     |

---

## Tiếp theo

- [Data Models](../data-model.md) - Chi tiết về NGSI-LD entities
- [Weather API](./weather.md) - API thời tiết (yêu cầu auth)
- [Air Quality API](./air-quality.md) - API chất lượng không khí (yêu cầu auth)
