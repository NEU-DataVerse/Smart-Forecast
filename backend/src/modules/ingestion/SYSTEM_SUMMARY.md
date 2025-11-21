# 📝 Tóm Tắt Thiết Kế Hệ Thống Smart Forecast

## 🎯 Vấn Đề Cần Giải Quyết

Bạn đang xây dựng hệ thống Smart Forecast để:

1. Thu thập dữ liệu thời tiết & chất lượng không khí từ OpenWeatherMap
2. Lưu trữ theo chuẩn NGSI-LD vào Orion-LD Context Broker
3. Quản lý nhiều trạm thu thập dữ liệu ở các vị trí khác nhau

## ✅ Giải Pháp Đã Triển Khai

### 1. Cấu Trúc Dữ Liệu (`source_data.json`)

**Trước đây (Array đơn giản):**

```json
[
  {
    "name": "Hồ Hoàn Kiếm",
    "location": { "lat": 21.028511, "lon": 105.804817 }
  }
]
```

**Bây giờ (Structured format):**

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-21T00:00:00Z",
  "stations": [
    {
      "id": "urn:ngsi-ld:WeatherStation:hoan-kiem",
      "name": "Hồ Hoàn Kiếm",
      "code": "HN-HK-001",
      "status": "active",
      "priority": "high",
      "categories": ["urban", "tourist"],
      "location": { ... },
      "metadata": { ... }
    }
  ]
}
```

### 2. Station Management Module (Mới)

**Thành phần:**

- `StationManagerService` - Logic quản lý trạm
- `StationController` - REST API endpoints
- `station.dto.ts` - Data Transfer Objects

**Tính năng:**

- ✅ CRUD operations (Create, Read, Update, Delete)
- ✅ Activate/Deactivate stations
- ✅ Filter & Query (by city, district, status, priority)
- ✅ Import/Export batch
- ✅ Statistics & monitoring

### 3. Integration với Ingestion Service

**Thay đổi chính:**

```typescript
// CŨ: Load cứng từ file
constructor() {
  this.locations = JSON.parse(fs.readFileSync('source_data.json'));
}

// MỚI: Dynamic loading từ StationManager
constructor(
  private stationManager: StationManagerService
) {}

async ingestData() {
  const activeStations = await this.stationManager.findActive();
  // Chỉ thu thập từ trạm active
}
```

## 🏗️ Kiến Trúc Tổng Quan

```
┌────────────────────────────────────────────────┐
│           Station Management API               │
│  POST /stations - Tạo trạm mới                 │
│  GET  /stations - Xem danh sách                │
│  PUT  /stations/:id - Cập nhật                 │
│  POST /stations/:id/activate - Bật trạm        │
│  POST /stations/:id/deactivate - Tắt trạm     │
└──────────────┬─────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────┐
│        StationManagerService                   │
│  - Load/Save source_data.json                  │
│  - Filter active stations                      │
│  - CRUD operations                             │
└──────────────┬─────────────────────────────────┘
               │
               ▼
┌────────────────────────────────────────────────┐
│         IngestionService                       │
│  - Lấy trạm active từ StationManager           │
│  - Gọi OpenWeatherMap API                      │
│  - Transform sang NGSI-LD                      │
│  - Push lên Orion-LD                           │
└────────────────────────────────────────────────┘
```

## 📋 Workflow Chính

### Workflow 1: Thêm Trạm Mới

```
1. Admin tạo trạm mới qua API
   POST /api/v1/stations

2. StationManager lưu vào source_data.json
   - Tự động generate ID
   - Set status = "active"
   - Assign code (ST-001, ST-002...)

3. Scheduler tự động phát hiện
   - Chu kỳ tiếp theo sẽ thu thập dữ liệu
   - Không cần restart service
```

### Workflow 2: Thu Thập Dữ Liệu (Mỗi 30 phút)

```
1. Scheduler trigger (cron: 0,30 * * * *)

2. IngestionService.ingestAllData()
   └─> stationManager.findActive()
       → Chỉ lấy stations có status="active"

3. Với mỗi active station:
   ├─> Fetch từ OpenWeatherMap
   │   ├─ Current weather
   │   ├─ Weather forecast (7 days)
   │   ├─ Current air quality
   │   └─ Air quality forecast (4 days)
   │
   ├─> Transform sang NGSI-LD
   │   ├─ WeatherObserved
   │   ├─ WeatherForecast[]
   │   ├─ AirQualityObserved
   │   └─ AirQualityForecast[]
   │
   └─> Upsert vào Orion-LD

4. Log kết quả
   - Success count
   - Failed count
   - Errors (nếu có)
```

### Workflow 3: Tắt Trạm Tạm Thời

```
1. Admin deactivate trạm
   POST /stations/:id/deactivate

2. StationManager cập nhật status="inactive"
   - Lưu vào source_data.json

3. Chu kỳ tiếp theo
   - Trạm này bị bỏ qua
   - Không gọi API OpenWeatherMap
   - Không tốn quota
```

## 🔑 Các Khái Niệm Quan Trọng

### Station Status

| Status        | Ý nghĩa         | Thu thập dữ liệu? |
| ------------- | --------------- | ----------------- |
| `active`      | Đang hoạt động  | ✅ Có             |
| `inactive`    | Tạm dừng        | ❌ Không          |
| `maintenance` | Đang bảo trì    | ❌ Không          |
| `retired`     | Ngừng vĩnh viễn | ❌ Không          |

### Priority Level

- **high**: Trạm quan trọng (trung tâm, du lịch) - ưu tiên xử lý lỗi
- **medium**: Trạm thông thường
- **low**: Trạm ít quan trọng

### Categories (Tags)

Dùng để phân loại và filter:

- `urban` - Đô thị
- `rural` - Nông thôn
- `industrial` - Công nghiệp
- `coastal` - Ven biển
- `tourist` - Du lịch
- `heritage` - Di sản
- `residential` - Dân cư
- `commercial` - Thương mại

## 📊 API Endpoints Chính

### Station Management

```bash
# Xem danh sách
GET    /api/v1/stations
GET    /api/v1/stations/active
GET    /api/v1/stations/:id

# CRUD
POST   /api/v1/stations          # Tạo mới
PUT    /api/v1/stations/:id      # Cập nhật
DELETE /api/v1/stations/:id      # Xóa

# Status control
POST   /api/v1/stations/:id/activate
POST   /api/v1/stations/:id/deactivate

# Batch operations
POST   /api/v1/stations/batch

# Import/Export
POST   /api/v1/stations/import
GET    /api/v1/stations/export/all

# Query
GET    /api/v1/stations/city/:city
GET    /api/v1/stations/district/:district
GET    /api/v1/stations/stats
```

### Data Ingestion

```bash
# Manual trigger
POST   /api/v1/ingestion/all
POST   /api/v1/ingestion/weather
POST   /api/v1/ingestion/air-quality

# Monitoring
GET    /api/v1/ingestion/health
GET    /api/v1/ingestion/locations
```

## 🎨 Use Cases Thực Tế

### Use Case 1: Mở Rộng Hệ Thống

**Tình huống:** Thêm 10 trạm mới ở Hà Nội

```bash
# Tạo file stations.json với 10 trạm
# Import 1 lần
curl -X POST http://localhost:8000/api/v1/stations/import \
  -H "Content-Type: application/json" \
  -d @stations.json

# Kết quả:
# - 10 trạm mới được tạo với status="active"
# - Chu kỳ tiếp theo tự động thu thập dữ liệu
# - Không cần restart service
```

### Use Case 2: Bảo Trì Trạm

**Tình huống:** Trạm "Hà Đông" gặp sự cố, cần tạm dừng

```bash
# Tắt trạm
curl -X POST http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:ha-dong/deactivate

# Kết quả:
# - Trạm set status="maintenance"
# - Không thu thập dữ liệu nữa
# - Tiết kiệm API quota
# - Không ảnh hưởng trạm khác

# Sau khi sửa xong, bật lại:
curl -X POST http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:ha-dong/activate
```

### Use Case 3: Tối Ưu API Quota

**Tình huống:** Free plan OWM (60 calls/phút), có 20 trạm

```bash
# Giữ 10 trạm priority="high" active
# Tắt 10 trạm priority="low"

curl -X POST http://localhost:8000/api/v1/stations/batch \
  -H "Content-Type: application/json" \
  -d '{
    "stationIds": ["id1", "id2", ..., "id10"],
    "operation": "deactivate"
  }'

# Kết quả:
# - Chỉ 10 trạm important được thu thập
# - API calls: 10 * 4 = 40 calls/chu kỳ
# - Đủ quota cho free plan
```

### Use Case 4: Phân Tích Theo Khu Vực

**Tình huống:** Xem dữ liệu tất cả trạm ở Hoàn Kiếm

```bash
# Lấy danh sách trạm
curl "http://localhost:8000/api/v1/stations?district=Hoàn Kiếm"

# Query dữ liệu từ Orion-LD
curl "http://localhost:1026/ngsi-ld/v1/entities?type=WeatherObserved&q=address.addressLocality=='Hoàn Kiếm'"
```

## 🚀 Lợi Ích Của Thiết Kế

### 1. Linh Hoạt

- ✅ Thêm/Xóa trạm không cần restart
- ✅ Bật/Tắt trạm động
- ✅ Import hàng loạt

### 2. Dễ Quản Lý

- ✅ REST API đầy đủ
- ✅ Filter, query mạnh mẽ
- ✅ Statistics & monitoring

### 3. Tiết Kiệm Chi Phí

- ✅ Chỉ thu thập từ trạm active
- ✅ Kiểm soát API quota
- ✅ Priority-based processing

### 4. Dễ Mở Rộng

- ✅ Có thể thay JSON bằng Database
- ✅ Support caching
- ✅ Batch operations

### 5. NGSI-LD Compliant

- ✅ URN-based IDs
- ✅ Structured addresses
- ✅ Geo-location support

## 📈 Roadmap Tương Lai

### Phase 2: Database Integration

```typescript
// Thay thế JSON bằng PostgreSQL/MongoDB
@Entity('weather_stations')
export class WeatherStationEntity { ... }
```

### Phase 3: Real-time Monitoring

```typescript
// WebSocket notifications
stationService.on('stationDown', (stationId) => {
  notificationService.alert('Station offline');
});
```

### Phase 4: Auto-discovery

```typescript
// Tự động phát hiện trạm mới từ external API
async discoverStations(region: string) {
  const discovered = await externalAPI.getStations(region);
  // Auto-create stations
}
```

### Phase 5: ML Integration

```typescript
// Dự đoán lỗi trạm
async predictFailure(stationId: string) {
  const history = await getStationHistory(stationId);
  const prediction = await mlModel.predict(history);
  if (prediction.failureRisk > 0.8) {
    await this.setMaintenance(stationId);
  }
}
```

## 📚 Files Quan Trọng

```
backend/src/modules/ingestion/
├── dto/
│   └── station.dto.ts                    # DTO definitions
├── providers/
│   └── station-manager.provider.ts       # Core logic
├── station.controller.ts                 # REST API
├── ingestion.service.ts                  # Updated to use StationManager
├── ingestion.module.ts                   # Module config
├── source_data.json                      # Station database
├── STATION_DESIGN_GUIDE.md              # Chi tiết đầy đủ
└── QUICKSTART_STATION.md                # Hướng dẫn nhanh
```

## 🎓 Các Nguyên Tắc Thiết Kế

1. **Single Responsibility**: Mỗi service có 1 nhiệm vụ rõ ràng
2. **Dependency Injection**: Loose coupling giữa các components
3. **Configuration over Code**: Dùng JSON config thay vì hardcode
4. **RESTful API**: Tuân thủ chuẩn REST
5. **NGSI-LD Compliance**: Tương thích chuẩn FIWARE
6. **Fail-safe**: Lỗi 1 trạm không ảnh hưởng trạm khác

## 💡 Tips & Best Practices

### 1. Naming Convention

```
ID format: urn:ngsi-ld:WeatherStation:{location-slug}
Code format: {CITY_CODE}-{DISTRICT_CODE}-{NUMBER}
Example: HN-HK-001, HN-HD-002
```

### 2. Location Accuracy

- Dùng Google Maps để lấy tọa độ chính xác
- Độ chính xác: 6 chữ số thập phân (~0.1m)

### 3. Priority Assignment

- `high`: Trung tâm thành phố, du lịch, quan trọng
- `medium`: Khu dân cư, văn phòng
- `low`: Ngoại thành, ít dân cư

### 4. Categories Best Practices

- Tối đa 3-5 categories/trạm
- Dùng consistent naming
- Có thể dùng để filter sau này

### 5. Backup Strategy

```bash
# Daily backup
curl "http://localhost:8000/api/v1/stations/export/all?includeInactive=true" \
  > "backups/stations_$(date +%Y%m%d).json"
```

---

**Tác giả:** Smart Forecast Development Team  
**Version:** 1.0.0  
**Ngày cập nhật:** 21/11/2025
