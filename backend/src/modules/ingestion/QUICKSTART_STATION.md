# 🚀 Hướng Dẫn Nhanh - Quản Lý Trạm Thu Thập Dữ Liệu

## 📌 Tổng Quan

Hệ thống Smart Forecast cho phép bạn quản lý các trạm thu thập dữ liệu môi trường một cách linh hoạt thông qua:

- ✅ REST API để CRUD trạm
- ✅ Bật/Tắt trạm động (không cần restart)
- ✅ Import/Export nhiều trạm cùng lúc
- ✅ Filter và query theo nhiều tiêu chí
- ✅ Tự động thu thập dữ liệu từ trạm active

## 🎯 Các Use Case Chính

### 1️⃣ Xem Danh Sách Trạm

```bash
# Xem tất cả trạm
curl http://localhost:8000/api/v1/stations

# Xem chỉ trạm active (đang hoạt động)
curl http://localhost:8000/api/v1/stations/active

# Filter theo thành phố
curl "http://localhost:8000/api/v1/stations?city=Hanoi"

# Filter theo status
curl "http://localhost:8000/api/v1/stations?status=active"
```

**Response mẫu:**

```json
{
  "count": 2,
  "stations": [
    {
      "id": "urn:ngsi-ld:WeatherStation:hoan-kiem",
      "name": "Hồ Hoàn Kiếm",
      "status": "active",
      "city": "Hanoi",
      "district": "Hoàn Kiếm",
      "location": {
        "lat": 21.028511,
        "lon": 105.804817
      },
      "priority": "high",
      "categories": ["urban", "tourist"]
    },
    ...
  ]
}
```

### 2️⃣ Thêm Trạm Mới

```bash
# Thêm 1 trạm
curl -X POST http://localhost:8000/api/v1/stations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Cầu Giấy",
    "city": "Hanoi",
    "district": "Cầu Giấy",
    "location": {
      "lat": 21.0333,
      "lon": 105.7946
    },
    "address": {
      "addressLocality": "Cầu Giấy",
      "addressCountry": "VN"
    },
    "priority": "high",
    "categories": ["urban", "education"]
  }'
```

**Response:**

```json
{
  "message": "Station created successfully",
  "station": {
    "id": "urn:ngsi-ld:WeatherStation:cau-giay",
    "name": "Cầu Giấy",
    "code": "ST-003",
    "status": "active",
    ...
  }
}
```

### 3️⃣ Tắt/Bật Trạm (Không Thu Thập Dữ Liệu)

```bash
# Tắt trạm (set status = inactive)
curl -X POST http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:ha-dong/deactivate

# Bật lại trạm
curl -X POST http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:ha-dong/activate
```

💡 **Lưu ý:** Khi trạm bị `deactivate`, nó sẽ **KHÔNG** được thu thập dữ liệu trong chu kỳ ingestion tự động tiếp theo.

### 4️⃣ Cập Nhật Thông Tin Trạm

```bash
# Cập nhật priority
curl -X PUT http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:cau-giay \
  -H "Content-Type: application/json" \
  -d '{
    "priority": "medium",
    "categories": ["urban", "education", "tech-hub"]
  }'
```

### 5️⃣ Xóa Trạm

```bash
# Xóa vĩnh viễn
curl -X DELETE http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:old-station
```

### 6️⃣ Import Nhiều Trạm Cùng Lúc

**Tạo file `my_stations.json`:**

```json
[
  {
    "name": "Đống Đa",
    "city": "Hanoi",
    "district": "Đống Đa",
    "location": { "lat": 21.0138, "lon": 105.8265 },
    "address": {
      "addressLocality": "Đống Đa",
      "addressCountry": "VN"
    }
  },
  {
    "name": "Long Biên",
    "city": "Hanoi",
    "district": "Long Biên",
    "location": { "lat": 21.045, "lon": 105.867 },
    "address": {
      "addressLocality": "Long Biên",
      "addressCountry": "VN"
    }
  }
]
```

**Import:**

```bash
curl -X POST http://localhost:8000/api/v1/stations/import \
  -H "Content-Type: application/json" \
  -d @my_stations.json
```

**Response:**

```json
{
  "message": "Import completed",
  "imported": 2,
  "skipped": 0,
  "errors": []
}
```

### 7️⃣ Batch Operations (Nhiều Trạm)

```bash
# Tắt nhiều trạm cùng lúc
curl -X POST http://localhost:8000/api/v1/stations/batch \
  -H "Content-Type: application/json" \
  -d '{
    "stationIds": [
      "urn:ngsi-ld:WeatherStation:ha-dong",
      "urn:ngsi-ld:WeatherStation:long-bien"
    ],
    "operation": "deactivate"
  }'

# Bật lại
curl -X POST http://localhost:8000/api/v1/stations/batch \
  -H "Content-Type: application/json" \
  -d '{
    "stationIds": [
      "urn:ngsi-ld:WeatherStation:ha-dong",
      "urn:ngsi-ld:WeatherStation:long-bien"
    ],
    "operation": "activate"
  }'
```

### 8️⃣ Xem Thống Kê

```bash
curl http://localhost:8000/api/v1/stations/stats
```

**Response:**

```json
{
  "message": "Station statistics",
  "total": 5,
  "active": 4,
  "inactive": 1,
  "maintenance": 0,
  "retired": 0,
  "byCity": {
    "Hanoi": 5
  },
  "byPriority": {
    "high": 2,
    "medium": 2,
    "low": 1
  }
}
```

### 9️⃣ Query Theo Khu Vực

```bash
# Lấy tất cả trạm ở Hoàn Kiếm
curl http://localhost:8000/api/v1/stations/district/Hoàn%20Kiếm

# Lấy tất cả trạm ở Hà Nội
curl http://localhost:8000/api/v1/stations/city/Hanoi
```

### 🔟 Export & Backup

```bash
# Export tất cả (bao gồm inactive)
curl "http://localhost:8000/api/v1/stations/export/all?includeInactive=true" \
  > backup_all_stations.json

# Export chỉ active stations
curl "http://localhost:8000/api/v1/stations/export/all" \
  > active_stations.json
```

## 🔄 Workflow Thu Thập Dữ Liệu

```
1. Hệ thống chạy scheduler mỗi 30 phút
   ↓
2. Lấy danh sách trạm ACTIVE từ StationManager
   ↓
3. Với mỗi trạm active:
   - Gọi OpenWeatherMap API
   - Transform sang NGSI-LD
   - Đẩy vào Orion-LD
   ↓
4. Log kết quả (success/failed)
```

**Trigger thủ công:**

```bash
# Thu thập tất cả dữ liệu (weather + air quality)
curl -X POST http://localhost:8000/api/v1/ingestion/all

# Response:
{
  "message": "Full data ingestion completed",
  "airQuality": {
    "success": 4,
    "failed": 0,
    "forecastSuccess": 4,
    "forecastFailed": 0
  },
  "weather": {
    "success": 4,
    "failed": 0,
    "forecastSuccess": 4,
    "forecastFailed": 0
  }
}
```

## 📊 Các Trường Quan Trọng

### Status (Trạng thái)

- `active`: Đang hoạt động, thu thập dữ liệu
- `inactive`: Tạm dừng, không thu thập dữ liệu
- `maintenance`: Đang bảo trì
- `retired`: Đã ngừng hoạt động vĩnh viễn

### Priority (Độ ưu tiên)

- `high`: Ưu tiên cao (trung tâm thành phố, khu du lịch)
- `medium`: Ưu tiên trung bình
- `low`: Ưu tiên thấp

### Categories (Phân loại)

- `urban`: Đô thị
- `rural`: Nông thôn
- `industrial`: Khu công nghiệp
- `coastal`: Ven biển
- `tourist`: Khu du lịch
- `residential`: Khu dân cư
- `commercial`: Thương mại

## 🎨 Frontend Integration

### React/Next.js Example

```typescript
// services/stationService.ts
export const stationService = {
  async getAll(filters?: StationFilters) {
    const params = new URLSearchParams(filters);
    const res = await fetch(`/api/v1/stations?${params}`);
    return res.json();
  },

  async getActive() {
    const res = await fetch('/api/v1/stations/active');
    return res.json();
  },

  async create(data: CreateStationDto) {
    const res = await fetch('/api/v1/stations', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return res.json();
  },

  async activate(id: string) {
    const res = await fetch(`/api/v1/stations/${id}/activate`, {
      method: 'POST',
    });
    return res.json();
  },

  async deactivate(id: string) {
    const res = await fetch(`/api/v1/stations/${id}/deactivate`, {
      method: 'POST',
    });
    return res.json();
  }
};

// components/StationList.tsx
export function StationList() {
  const [stations, setStations] = useState([]);

  useEffect(() => {
    stationService.getAll({ city: 'Hanoi', status: 'active' })
      .then(data => setStations(data.stations));
  }, []);

  const handleToggleStatus = async (station) => {
    if (station.status === 'active') {
      await stationService.deactivate(station.id);
    } else {
      await stationService.activate(station.id);
    }
    // Refresh list
  };

  return (
    <div>
      {stations.map(station => (
        <StationCard
          key={station.id}
          station={station}
          onToggle={() => handleToggleStatus(station)}
        />
      ))}
    </div>
  );
}
```

## 🛠️ Các Lệnh Thường Dùng

```bash
# 1. Kiểm tra hệ thống
curl http://localhost:8000/api/v1/ingestion/health

# 2. Xem info data source
curl http://localhost:8000/api/v1/stations/info

# 3. Reload stations từ file
curl -X POST http://localhost:8000/api/v1/stations/reload

# 4. Lấy 1 trạm cụ thể
curl http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:hoan-kiem

# 5. Trigger ingestion ngay
curl -X POST http://localhost:8000/api/v1/ingestion/all

# 6. Xem logs
docker logs -f backend --tail 100
```

## ⚠️ Lưu Ý Quan Trọng

1. **Rate Limiting OWM API:**
   - Free plan: 60 calls/phút
   - Mỗi chu kỳ ingestion: 4 calls/trạm
   - Nên có tối đa ~10 trạm active với free plan

2. **Backup Regular:**

   ```bash
   # Chạy mỗi ngày
   curl "http://localhost:8000/api/v1/stations/export/all?includeInactive=true" \
     > "backups/stations_$(date +%Y%m%d).json"
   ```

3. **Status Management:**
   - Chỉ `active` stations mới được thu thập dữ liệu
   - Thay đổi status không cần restart service
   - Nên set `inactive` cho trạm gặp lỗi liên tục

4. **Location Accuracy:**
   - Tọa độ GPS phải chính xác để OpenWeatherMap trả về đúng dữ liệu
   - Nên dùng Google Maps để lấy tọa độ chính xác

## 🐛 Troubleshooting

### Vấn đề: Trạm mới không xuất hiện trong ingestion

```bash
# Kiểm tra status
curl http://localhost:8000/api/v1/stations/:id

# Nếu status = inactive, bật lại:
curl -X POST http://localhost:8000/api/v1/stations/:id/activate
```

### Vấn đề: Import bị lỗi

```bash
# Kiểm tra format JSON
cat my_stations.json | jq

# Đảm bảo có đủ các field bắt buộc:
# - name, district, location.lat, location.lon
# - address.addressLocality, address.addressCountry
```

### Vấn đề: File source_data.json bị lỗi

```bash
# Restore từ backup
cp backup_stations.json backend/src/modules/ingestion/source_data.json

# Reload
curl -X POST http://localhost:8000/api/v1/stations/reload
```

## 📚 Tài Liệu Chi Tiết

Xem file `STATION_DESIGN_GUIDE.md` để có hướng dẫn chi tiết về:

- Kiến trúc hệ thống
- API đầy đủ
- Security & authentication
- Testing strategies
- Performance optimization
- Advanced features

---

**Version:** 1.0.0  
**Last Updated:** November 21, 2025
