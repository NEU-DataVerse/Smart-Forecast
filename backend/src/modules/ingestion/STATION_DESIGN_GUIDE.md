# 🏗️ Hướng Dẫn Thiết Kế Hệ Thống Quản Lý Trạm Thu Thập Dữ Liệu

## 📋 Tổng Quan

Tài liệu này mô tả thiết kế hệ thống Smart Forecast với khả năng quản lý các trạm thu thập dữ liệu môi trường từ OpenWeatherMap API. Hệ thống được thiết kế linh hoạt, dễ mở rộng và tuân theo chuẩn NGSI-LD.

## 🎯 Kiến Trúc Hệ Thống

### 1. Tổng Quan Kiến Trúc

```
┌──────────────────────────────────────────────────────────────┐
│                    Smart Forecast System                      │
├──────────────────────────────────────────────────────────────┤
│                                                               │
│  ┌─────────────────────┐      ┌─────────────────────┐       │
│  │  Station Manager    │      │  Ingestion Service  │       │
│  │  - CRUD Operations  │◄─────┤  - Data Collection  │       │
│  │  - Station Config   │      │  - Data Transform   │       │
│  │  - Status Control   │      │  - Error Handling   │       │
│  └──────────┬──────────┘      └──────────┬──────────┘       │
│             │                             │                   │
│             ▼                             ▼                   │
│  ┌─────────────────────────────────────────────────────┐    │
│  │           source_data.json (Config File)            │    │
│  │  - Station Metadata                                 │    │
│  │  - Location Coordinates                             │    │
│  │  - Status & Priority                                │    │
│  └─────────────────────────────────────────────────────┘    │
│                                                               │
└──────────────────────────────────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │      External Data Sources            │
         ├──────────────────────────────────────┤
         │  OpenWeatherMap API                  │
         │  - Current Weather & Air Quality     │
         │  - Forecast Data (7 days)            │
         └──────────────────────────────────────┘
                            │
                            ▼
         ┌──────────────────────────────────────┐
         │      FIWARE Orion-LD Broker          │
         ├──────────────────────────────────────┤
         │  NGSI-LD Entities:                   │
         │  - WeatherObserved                   │
         │  - WeatherForecast                   │
         │  - AirQualityObserved                │
         │  - AirQualityForecast                │
         └──────────────────────────────────────┘
```

### 2. Luồng Dữ Liệu (Data Flow)

```
┌─────────────────┐
│ 1. Station      │  ── Configure stations, set status (active/inactive)
│    Configuration│
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 2. Scheduler    │  ── Trigger every 30 minutes (cron job)
│    Trigger      │
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 3. Get Active   │  ── StationManager.findActive()
│    Stations     │      → Only active stations are selected
└────────┬────────┘
         │
         ▼
┌─────────────────┐
│ 4. For Each     │  ── Loop through active stations
│    Station      │
└────────┬────────┘
         │
         ├─────────────────────────┐
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│ 5a. Fetch       │       │ 5b. Fetch       │
│     Weather     │       │     Air Quality │
│     Data        │       │     Data        │
└────────┬────────┘       └────────┬────────┘
         │                         │
         ▼                         ▼
┌─────────────────┐       ┌─────────────────┐
│ 6a. Transform   │       │ 6b. Transform   │
│     to NGSI-LD  │       │     to NGSI-LD  │
│     (Weather)   │       │     (AirQuality)│
└────────┬────────┘       └────────┬────────┘
         │                         │
         └────────┬────────────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ 7. Upsert to    │
         │    Orion-LD     │
         └────────┬────────┘
                  │
                  ▼
         ┌─────────────────┐
         │ 8. Log Results  │
         │    & Errors     │
         └─────────────────┘
```

## 📁 Cấu Trúc File & Module

### 1. Station Data Structure (`source_data.json`)

```json
{
  "version": "1.0",
  "lastUpdated": "2025-11-21T00:00:00Z",
  "stations": [
    {
      "id": "urn:ngsi-ld:WeatherStation:hoan-kiem",
      "type": "WeatherStation",
      "name": "Hồ Hoàn Kiếm",
      "code": "HN-HK-001",
      "status": "active",
      "city": "Hanoi",
      "district": "Hoàn Kiếm",
      "ward": "Hàng Trống",
      "location": {
        "lat": 21.028511,
        "lon": 105.804817,
        "altitude": 12
      },
      "address": {
        "streetAddress": "Hồ Hoàn Kiếm",
        "addressLocality": "Hoàn Kiếm",
        "addressRegion": "Hà Nội",
        "addressCountry": "VN",
        "postalCode": "100000"
      },
      "timezone": "Asia/Ho_Chi_Minh",
      "timezoneOffset": 25200,
      "priority": "high",
      "categories": ["urban", "tourist", "heritage"],
      "metadata": {
        "installationDate": "2024-01-01",
        "operator": "Hanoi Environmental Department",
        "contact": "contact@example.com",
        "description": "Trạm quan trắc tại khu vực trung tâm lịch sử Hà Nội"
      }
    }
  ]
}
```

**Các trường quan trọng:**

- **id**: URN duy nhất theo chuẩn NGSI-LD
- **status**: `active`, `inactive`, `maintenance`, `retired`
- **priority**: `high`, `medium`, `low` - Độ ưu tiên khi có lỗi
- **categories**: Tags phân loại (urban, rural, industrial, coastal, etc.)
- **location**: Tọa độ GPS chính xác (lat, lon, altitude)

### 2. Module Structure

```
ingestion/
├── dto/
│   ├── station.dto.ts                    # DTOs cho Station API
│   └── ingestion-status.dto.ts           # DTOs cho Ingestion API
├── providers/
│   ├── station-manager.provider.ts       # ⭐ Quản lý trạm
│   ├── openweathermap.provider.ts        # OWM API client
│   └── orion-client.provider.ts          # Orion-LD client
├── schedulers/
│   └── ingestion.scheduler.ts            # Cron jobs
├── station.controller.ts                 # ⭐ Station REST API
├── ingestion.controller.ts               # Ingestion REST API
├── ingestion.service.ts                  # Core ingestion logic
├── ingestion.module.ts                   # Module config
├── source_data.json                      # ⭐ Station database
└── README.md
```

## 🔧 Các Thành Phần Chính

### 1. StationManagerService

**Chức năng:**

- Quản lý CRUD operations cho trạm
- Load/Save từ `source_data.json`
- Filter, query, statistics
- Import/Export stations

**Key Methods:**

```typescript
// Lấy tất cả trạm
async findAll(query?: StationQueryDto): Promise<WeatherStation[]>

// Lấy chỉ trạm active (cho ingestion)
async findActive(): Promise<WeatherStation[]>

// Tạo trạm mới
async create(dto: CreateStationDto): Promise<WeatherStation>

// Cập nhật trạm
async update(id: string, dto: UpdateStationDto): Promise<WeatherStation>

// Xóa trạm
async delete(id: string): Promise<void>

// Bật/Tắt trạm
async activate(id: string): Promise<WeatherStation>
async deactivate(id: string): Promise<WeatherStation>

// Thống kê
async getStatistics(): Promise<StationStats>

// Import/Export
async importStations(stations[]): Promise<ImportResult>
async exportStations(includeInactive): Promise<WeatherStation[]>
```

### 2. Station REST API

**Base URL:** `/api/v1/stations`

#### Các Endpoint Chính:

##### a. Quản lý trạm cơ bản

```bash
# 1. Lấy tất cả trạm
GET /api/v1/stations
Query params: city, district, status, priority, category, limit, offset

# 2. Lấy trạm active
GET /api/v1/stations/active

# 3. Lấy trạm theo ID
GET /api/v1/stations/:id

# 4. Tạo trạm mới
POST /api/v1/stations
Body: CreateStationDto

# 5. Cập nhật trạm
PUT /api/v1/stations/:id
Body: UpdateStationDto

# 6. Xóa trạm
DELETE /api/v1/stations/:id
```

##### b. Quản lý trạng thái

```bash
# 7. Bật trạm (set status = active)
POST /api/v1/stations/:id/activate

# 8. Tắt trạm (set status = inactive)
POST /api/v1/stations/:id/deactivate

# 9. Batch operations (nhiều trạm cùng lúc)
POST /api/v1/stations/batch
Body: {
  "stationIds": ["id1", "id2"],
  "operation": "activate" | "deactivate" | "delete"
}
```

##### c. Query & Analytics

```bash
# 10. Lấy trạm theo thành phố
GET /api/v1/stations/city/:cityName

# 11. Lấy trạm theo quận/huyện
GET /api/v1/stations/district/:districtName

# 12. Thống kê
GET /api/v1/stations/stats

# 13. Thông tin data source
GET /api/v1/stations/info
```

##### d. Import/Export

```bash
# 14. Import nhiều trạm
POST /api/v1/stations/import
Body: [StationData1, StationData2, ...]

# 15. Export tất cả trạm
GET /api/v1/stations/export/all?includeInactive=true

# 16. Reload từ file
POST /api/v1/stations/reload
```

### 3. IngestionService (Cải tiến)

**Thay đổi chính:**

- Không còn load trực tiếp từ `source_data.json`
- Sử dụng `StationManager.findActive()` để lấy danh sách trạm
- Chỉ thu thập dữ liệu từ trạm có `status = 'active'`

**Before (Old):**

```typescript
constructor() {
  this.locations = JSON.parse(fs.readFileSync('source_data.json'));
}
```

**After (New):**

```typescript
constructor(
  private stationManager: StationManagerService,
) {}

async ingestData() {
  const activeStations = await this.stationManager.findActive();
  // Process only active stations
}
```

## 🚀 Workflow Sử Dụng

### 1. Setup Ban Đầu

```bash
# Bước 1: Khởi tạo hệ thống với 2 trạm mặc định
# File source_data.json đã có sẵn
cd backend
pnpm install
pnpm run start:dev

# Bước 2: Kiểm tra trạm hiện có
curl http://localhost:8000/api/v1/stations

# Response:
{
  "count": 2,
  "stations": [
    {
      "id": "urn:ngsi-ld:WeatherStation:hoan-kiem",
      "name": "Hồ Hoàn Kiếm",
      "status": "active",
      ...
    },
    {
      "id": "urn:ngsi-ld:WeatherStation:ha-dong",
      "name": "Hà Đông",
      "status": "active",
      ...
    }
  ]
}
```

### 2. Thêm Trạm Mới

```bash
# Thêm trạm Long Biên
curl -X POST http://localhost:8000/api/v1/stations \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Long Biên",
    "city": "Hanoi",
    "district": "Long Biên",
    "location": {
      "lat": 21.0450,
      "lon": 105.8670
    },
    "address": {
      "addressLocality": "Long Biên",
      "addressCountry": "VN"
    },
    "priority": "medium",
    "categories": ["urban", "commercial"]
  }'

# Response:
{
  "message": "Station created successfully",
  "station": {
    "id": "urn:ngsi-ld:WeatherStation:long-bien",
    "name": "Long Biên",
    "status": "active",
    "code": "ST-003",
    ...
  }
}
```

### 3. Quản Lý Trạng Thái Trạm

```bash
# Tạm dừng trạm Hà Đông (không thu thập dữ liệu)
curl -X POST http://localhost:8000/api/v1/stations/urn:ngsi-ld:WeatherStation:ha-dong/deactivate

# Kiểm tra lại trạm active
curl http://localhost:8000/api/v1/stations/active

# Response: Chỉ còn 2 trạm (Hoàn Kiếm và Long Biên)
{
  "count": 2,
  "stations": [...]
}
```

### 4. Trigger Ingestion

```bash
# Thu thập dữ liệu từ các trạm active
curl -X POST http://localhost:8000/api/v1/ingestion/all

# Response:
{
  "message": "Full data ingestion completed",
  "airQuality": {
    "success": 2,
    "failed": 0,
    "forecastSuccess": 2,
    "forecastFailed": 0
  },
  "weather": {
    "success": 2,
    "failed": 0,
    "forecastSuccess": 2,
    "forecastFailed": 0
  }
}
```

### 5. Import Nhiều Trạm Cùng Lúc

```bash
# Tạo file stations_hanoi.json
cat > stations_hanoi.json << 'EOF'
[
  {
    "name": "Cầu Giấy",
    "city": "Hanoi",
    "district": "Cầu Giấy",
    "location": { "lat": 21.0333, "lon": 105.7946 },
    "address": {
      "addressLocality": "Cầu Giấy",
      "addressCountry": "VN"
    }
  },
  {
    "name": "Đống Đa",
    "city": "Hanoi",
    "district": "Đống Đa",
    "location": { "lat": 21.0138, "lon": 105.8265 },
    "address": {
      "addressLocality": "Đống Đa",
      "addressCountry": "VN"
    }
  }
]
EOF

# Import vào hệ thống
curl -X POST http://localhost:8000/api/v1/stations/import \
  -H "Content-Type: application/json" \
  -d @stations_hanoi.json

# Response:
{
  "message": "Import completed",
  "imported": 2,
  "skipped": 0,
  "errors": []
}
```

### 6. Query & Filter

```bash
# 1. Lấy tất cả trạm ở Hà Nội
curl "http://localhost:8000/api/v1/stations?city=Hanoi"

# 2. Lấy trạm có priority cao
curl "http://localhost:8000/api/v1/stations?priority=high"

# 3. Lấy trạm theo category
curl "http://localhost:8000/api/v1/stations?category=urban"

# 4. Pagination
curl "http://localhost:8000/api/v1/stations?limit=10&offset=0"

# 5. Combine filters
curl "http://localhost:8000/api/v1/stations?city=Hanoi&status=active&priority=high"
```

### 7. Thống Kê

```bash
# Xem thống kê tổng quan
curl http://localhost:8000/api/v1/stations/stats

# Response:
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
    "high": 1,
    "medium": 3,
    "low": 1
  }
}
```

### 8. Export & Backup

```bash
# Export tất cả trạm (bao gồm inactive)
curl "http://localhost:8000/api/v1/stations/export/all?includeInactive=true" \
  > backup_stations.json

# Export chỉ trạm active
curl "http://localhost:8000/api/v1/stations/export/all" \
  > active_stations.json
```

## 🎨 Thiết Kế Database (Tương Lai)

Hiện tại sử dụng `source_data.json`, nhưng có thể mở rộng sang database:

### Option 1: PostgreSQL + TypeORM

```typescript
@Entity('weather_stations')
export class WeatherStationEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  name: string;

  @Column({ type: 'enum', enum: StationStatus })
  status: StationStatus;

  @Column('geography', { spatialFeatureType: 'Point', srid: 4326 })
  location: Point;

  @Column('json')
  address: StationAddress;

  @Column('simple-array')
  categories: string[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

### Option 2: MongoDB

```typescript
@Schema()
export class WeatherStation {
  @Prop({ required: true })
  name: string;

  @Prop({ type: Object })
  location: {
    type: 'Point';
    coordinates: [number, number];
  };

  @Prop({ type: String, enum: StationStatus })
  status: StationStatus;

  @Prop({ type: [String] })
  categories: string[];
}
```

## 🔐 Security & Best Practices

### 1. Authentication cho Station API

**Recommendation:** Thêm JWT auth cho các endpoint quan trọng

```typescript
@Controller('stations')
@UseGuards(JwtAuthGuard)
export class StationController {
  @Get()
  @Public() // Cho phép public đọc
  async getAll() {}

  @Post()
  @Roles('admin') // Chỉ admin mới tạo được
  async create() {}

  @Delete(':id')
  @Roles('admin', 'operator')
  async delete() {}
}
```

### 2. Validation

```typescript
import { IsNotEmpty, IsLatitude, IsLongitude } from 'class-validator';

export class CreateStationDto {
  @IsNotEmpty()
  @MinLength(3)
  name: string;

  @ValidateNested()
  @Type(() => LocationDto)
  location: LocationDto;
}

class LocationDto {
  @IsLatitude()
  lat: number;

  @IsLongitude()
  lon: number;
}
```

### 3. Rate Limiting

```typescript
@Controller('stations')
@UseGuards(ThrottlerGuard)
@Throttle(10, 60) // 10 requests per minute
export class StationController {}
```

### 4. Audit Log

```typescript
async create(dto: CreateStationDto) {
  const station = await this.stationManager.create(dto);

  // Log audit trail
  await this.auditLog.log({
    action: 'STATION_CREATED',
    userId: currentUser.id,
    stationId: station.id,
    timestamp: new Date()
  });

  return station;
}
```

## 📊 Monitoring & Alerting

### 1. Station Health Metrics

```typescript
interface StationHealth {
  stationId: string;
  lastDataTimestamp: Date;
  consecutiveFailures: number;
  avgResponseTime: number;
  status: 'healthy' | 'degraded' | 'down';
}
```

### 2. Alerting Rules

```yaml
alerts:
  - name: station_down
    condition: consecutiveFailures > 3
    action: send_email

  - name: no_data_24h
    condition: lastDataTimestamp < now() - 24h
    action: send_notification

  - name: high_error_rate
    condition: errorRate > 0.2
    action: create_incident
```

## 🧪 Testing

### Unit Tests

```typescript
describe('StationManagerService', () => {
  let service: StationManagerService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [StationManagerService],
    }).compile();
    service = module.get(StationManagerService);
  });

  it('should create a new station', async () => {
    const dto: CreateStationDto = {
      name: 'Test Station',
      district: 'Test District',
      location: { lat: 21.0, lon: 105.0 },
      address: { addressLocality: 'Test', addressCountry: 'VN' },
    };

    const station = await service.create(dto);
    expect(station.id).toBeDefined();
    expect(station.status).toBe(StationStatus.ACTIVE);
  });

  it('should filter active stations', async () => {
    const active = await service.findActive();
    expect(active.every((s) => s.status === StationStatus.ACTIVE)).toBe(true);
  });
});
```

### Integration Tests

```typescript
describe('Station API (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const module = await Test.createTestingModule({
      imports: [IngestionModule],
    }).compile();
    app = module.createNestApplication();
    await app.init();
  });

  it('/stations (GET)', () => {
    return request(app.getHttpServer())
      .get('/stations')
      .expect(200)
      .expect((res) => {
        expect(res.body.stations).toBeInstanceOf(Array);
      });
  });

  it('/stations (POST)', () => {
    return request(app.getHttpServer())
      .post('/stations')
      .send({ name: 'New Station', ... })
      .expect(201);
  });
});
```

## 📈 Performance Optimization

### 1. Caching

```typescript
@Injectable()
export class StationManagerService {
  private cache: Map<string, WeatherStation> = new Map();
  private cacheExpiry: number = 5 * 60 * 1000; // 5 minutes

  async findById(id: string): Promise<WeatherStation> {
    // Check cache first
    if (this.cache.has(id)) {
      return this.cache.get(id);
    }

    const station = await this.loadFromFile(id);
    this.cache.set(id, station);
    return station;
  }
}
```

### 2. Batch Processing

```typescript
async ingestAllData() {
  const stations = await this.stationManager.findActive();

  // Process in batches of 5 to avoid rate limits
  const batchSize = 5;
  for (let i = 0; i < stations.length; i += batchSize) {
    const batch = stations.slice(i, i + batchSize);
    await Promise.all(batch.map(s => this.ingestStation(s)));

    // Wait between batches
    await this.delay(1000);
  }
}
```

## 🌟 Tính Năng Mở Rộng

### 1. Dynamic Station Discovery

```typescript
// Tự động phát hiện trạm mới từ external API
async discoverStations(region: string) {
  const discovered = await externalAPI.getStationsInRegion(region);

  for (const station of discovered) {
    const exists = await this.findByLocation(station.lat, station.lon);
    if (!exists) {
      await this.create({
        name: station.name,
        location: station.location,
        status: StationStatus.INACTIVE, // Require manual activation
      });
    }
  }
}
```

### 2. Station Groups

```typescript
interface StationGroup {
  id: string;
  name: string;
  stationIds: string[];
  priority: number;
}

// Ingest by group
async ingestGroup(groupId: string) {
  const group = await this.findGroupById(groupId);
  const stations = await this.findByIds(group.stationIds);
  // ...
}
```

### 3. Custom Data Collection Intervals

```typescript
interface StationSchedule {
  stationId: string;
  cronExpression: string; // '*/10 * * * *' for every 10 minutes
  enabled: boolean;
}

// Different schedules for different stations
@Cron('*/10 * * * *')
async ingestHighPriority() {
  const stations = await this.stationManager.findAll({ priority: 'high' });
  await this.ingest(stations);
}

@Cron('*/30 * * * *')
async ingestMediumPriority() {
  const stations = await this.stationManager.findAll({ priority: 'medium' });
  await this.ingest(stations);
}
```

## 📚 Tài Liệu Tham Khảo

- [FIWARE NGSI-LD Specification](https://www.etsi.org/deliver/etsi_gs/CIM/001_099/009/01.04.01_60/gs_cim009v010401p.pdf)
- [OpenWeatherMap API Documentation](https://openweathermap.org/api)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Smart Data Models](https://smartdatamodels.org/)

## 🆘 Troubleshooting

### Issue 1: Trạm mới không xuất hiện trong ingestion

**Nguyên nhân:** Status không phải `active`

**Giải pháp:**

```bash
curl -X POST http://localhost:8000/api/v1/stations/:id/activate
```

### Issue 2: File source_data.json bị corrupt

**Giải pháp:**

```bash
# Restore from backup
cp backup_stations.json backend/src/modules/ingestion/source_data.json

# Or reload from API
curl -X POST http://localhost:8000/api/v1/stations/reload
```

### Issue 3: Lỗi khi import stations

**Nguyên nhân:** Missing required fields

**Giải pháp:**
Đảm bảo mỗi station có đủ:

- `name`
- `district`
- `location.lat`
- `location.lon`
- `address.addressLocality`
- `address.addressCountry`

---

**Version:** 1.0.0  
**Last Updated:** November 21, 2025  
**Author:** Smart Forecast Development Team
