# 📦 Chi tiết từng Module Backend

> Tài liệu mô tả chức năng chi tiết của từng module trong hệ thống Smart Forecast Backend

---

## 1. **📥 ingestion** - Thu thập & chuẩn hóa dữ liệu

### Chức năng:

- Thu thập dữ liệu từ API bên ngoài (OpenWeatherMap)
- Chuẩn hóa về định dạng NGSI-LD (AirQualityObserved, WeatherObserved)
- Đẩy dữ liệu vào Orion-LD Context Broker
- Chạy tự động theo lịch (cron jobs)

### Luồng hoạt động:

```
[OWM API] → [Provider] → [Transformer] → [Orion Client] → [Orion-LD] → [PostgreSQL]
```

### API endpoints:

- `POST /ingestion/trigger/airquality` - Trigger thủ công (admin only)
- `POST /ingestion/trigger/weather` - Trigger thủ công (admin only)
- `GET /ingestion/status` - Xem trạng thái thu thập gần nhất

### Cron jobs:

- Mỗi 30 phút: Lấy dữ liệu chất lượng không khí
- Mỗi 15 phút: Lấy dữ liệu thời tiết

---

## 2. **🌫️ airquality** - Truy vấn chất lượng không khí

### Chức năng:

- Truy vấn dữ liệu chất lượng không khí từ Orion-LD hoặc PostgreSQL
- Cung cấp API cho Web/Mobile dashboard
- Lọc theo vị trí, thời gian, loại ô nhiễm

### API endpoints:

- `GET /airquality/current?lat=21.0285&lon=105.8542` - Dữ liệu hiện tại theo tọa độ
- `GET /airquality/history?from=2024-01-01&to=2024-01-31` - Dữ liệu lịch sử
- `GET /airquality/locations` - Danh sách các địa điểm có dữ liệu

### Response example:

```json
{
  "location": { "lat": 21.0285, "lon": 105.8542 },
  "timestamp": "2024-01-15T10:30:00Z",
  "pollutants": {
    "pm25": 45.2,
    "pm10": 78.5,
    "o3": 35.1,
    "no2": 25.3
  },
  "aqi": 78
}
```

---

## 3. **🌤️ weather** - Truy vấn thời tiết

### Chức năng:

- Truy vấn dữ liệu thời tiết từ Orion-LD hoặc PostgreSQL
- Cung cấp thông tin thời tiết hiện tại và dự báo
- Hỗ trợ truy vấn theo vị trí và thời gian

### API endpoints:

- `GET /weather/current?lat=21.0285&lon=105.8542` - Thời tiết hiện tại
- `GET /weather/forecast?lat=21.0285&lon=105.8542&hours=24` - Dự báo 24h
- `GET /weather/history?from=2024-01-01&to=2024-01-31` - Lịch sử thời tiết

### Response example:

```json
{
  "location": { "lat": 21.0285, "lon": 105.8542 },
  "timestamp": "2024-01-15T10:30:00Z",
  "temperature": 25.5,
  "humidity": 65,
  "windSpeed": 3.2,
  "rainfall": 0,
  "condition": "Partly Cloudy"
}
```

---

## 4. **🚨 alert** - Quản lý cảnh báo

### Chức năng:

- Tạo cảnh báo thủ công (admin)
- Tự động tạo cảnh báo khi vượt ngưỡng (threshold)
- Áp dụng các quy tắc cảnh báo tùy chỉnh
- Phân loại mức độ nghiêm trọng (INFO, WARNING, DANGER)

### Luồng hoạt động:

```
[Alert Monitor Scheduler] → Kiểm tra dữ liệu mỗi 5 phút
                                    ↓
                          [Threshold Processor] → So sánh với ngưỡng
                                    ↓
                          [Alert Service] → Tạo alert mới
                                    ↓
                          [Notification Service] → Gửi thông báo
```

### API endpoints:

- `POST /alerts` - Tạo cảnh báo mới (admin)
- `GET /alerts` - Lấy danh sách cảnh báo (có phân trang, filter)
- `GET /alerts/:id` - Chi tiết một cảnh báo
- `PATCH /alerts/:id` - Cập nhật cảnh báo (admin)
- `DELETE /alerts/:id` - Xóa cảnh báo (admin)

### Alert types:

- `FLOOD` - Ngập lụt
- `STORM` - Bão
- `AIR_POLLUTION` - Ô nhiễm không khí
- `EXTREME_HEAT` - Nắng nóng
- `HEAVY_RAIN` - Mưa lớn

### Severity levels:

- `INFO` - Thông tin
- `WARNING` - Cảnh báo
- `DANGER` - Nguy hiểm

---

## 5. **📢 notification** - Gửi thông báo đa kênh

### Chức năng:

- Gửi thông báo qua Firebase Cloud Messaging (FCM)
- Hỗ trợ mở rộng: Email, SMS
- Lưu lịch sử thông báo
- Xử lý bất đồng bộ qua queue (Bull/Redis)

### Luồng hoạt động:

```
[Alert/Incident Service] → [Notification Service] → [Queue]
                                                        ↓
                                              [FCM Provider] → [User Device]
                                              [Email Provider] (future)
                                              [SMS Provider] (future)
```

### Notification types:

- `ALERT` - Cảnh báo khẩn cấp
- `INCIDENT_UPDATE` - Cập nhật sự cố
- `SYSTEM` - Thông báo hệ thống

### Targeting:

- `ALL` - Gửi cho tất cả người dùng
- `LOCATION` - Gửi theo vị trí (geofencing)
- `USER_IDS` - Gửi cho danh sách user cụ thể

---

## 6. **📋 incident** - Báo cáo sự cố

### Chức năng:

- Người dân gửi báo cáo sự cố (ngập lụt, cây đổ, sạt lở...)
- Upload ảnh kèm theo (lưu vào MinIO)
- Ghi nhận vị trí GPS
- Admin cập nhật trạng thái xử lý

### Luồng hoạt động:

```
[Mobile App] → POST /incidents (multipart/form-data)
                    ↓
         [Incident Controller]
                    ↓
         ┌─────────┴──────────┐
         ↓                    ↓
[File Service]      [Incident Service]
   → MinIO             → PostgreSQL
```

### API endpoints:

- `POST /incidents` - Tạo báo cáo mới (citizen)
- `GET /incidents` - Lấy danh sách sự cố (có filter theo status, type)
- `GET /incidents/:id` - Chi tiết sự cố
- `PATCH /incidents/:id` - Cập nhật trạng thái (admin)
- `POST /incidents/:id/photos` - Thêm ảnh cho sự cố

### Incident status:

- `PENDING` - Chờ xử lý
- `IN_PROGRESS` - Đang xử lý
- `RESOLVED` - Đã giải quyết
- `REJECTED` - Từ chối

### Incident types:

- `FLOOD` - Ngập lụt
- `TREE_DOWN` - Cây đổ
- `LANDSLIDE` - Sạt lở
- `ROAD_DAMAGE` - Đường hư hỏng
- `OTHER` - Khác

---

## 8. **🔐 auth** - Xác thực người dùng

### Chức năng:

- Đăng ký tài khoản (citizen)
- Đăng nhập (admin/citizen)
- Tạo JWT token
- Hash password (bcrypt)
- Refresh token

### API endpoints:

- `POST /auth/register` - Đăng ký (citizen)
- `POST /auth/login` - Đăng nhập
- `POST /auth/refresh` - Refresh token
- `POST /auth/logout` - Đăng xuất

### User roles:

- `ADMIN` - Quản trị viên (tạo alert, quản lý incident)
- `CITIZEN` - Người dân (xem alert, gửi incident)

### JWT payload:

```json
{
  "sub": "user_id",
  "email": "user@example.com",
  "role": "CITIZEN",
  "iat": 1705308600,
  "exp": 1705395000
}
```

---

## 9. **👤 user** - Quản lý người dùng

### Chức năng:

- CRUD người dùng
- Quản lý FCM device tokens (cho push notification)
- Cập nhật profile
- Quản lý quyền

### API endpoints:

- `GET /users/me` - Lấy thông tin user hiện tại
- `PATCH /users/me` - Cập nhật profile
- `POST /users/me/devices` - Đăng ký FCM token
- `DELETE /users/me/devices/:token` - Xóa FCM token
- `GET /users` - Lấy danh sách user (admin only)
- `GET /users/:id` - Chi tiết user (admin only)

### User entity:

```typescript
{
  id: string;
  email: string;
  password: string; // hashed
  role: 'ADMIN' | 'CITIZEN';
  fullName: string;
  phone?: string;
  devices: DeviceToken[]; // FCM tokens
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 10. **🏥 health** - Monitoring & Health Check

### Chức năng:

- Kiểm tra tình trạng hệ thống
- Health check cho PostgreSQL, Orion-LD, MinIO, Redis
- Cung cấp metrics cho monitoring tools (Prometheus, Grafana)

### API endpoints:

- `GET /health` - Tổng quan health check
- `GET /health/db` - PostgreSQL status
- `GET /health/orion` - Orion-LD status
- `GET /health/minio` - MinIO status
- `GET /health/redis` - Redis status

### Response example:

```json
{
  "status": "ok",
  "uptime": 3600,
  "timestamp": "2024-01-15T10:30:00Z",
  "services": {
    "database": { "status": "ok", "latency": "15ms" },
    "orion": { "status": "ok", "latency": "50ms" },
    "minio": { "status": "ok", "latency": "20ms" },
    "redis": { "status": "ok", "latency": "5ms" }
  }
}
```

---

## 🔧 Chi tiết các thành phần hỗ trợ

### **common/** - Cross-cutting concerns

**decorators/**

- `@Roles('admin')` - RBAC decorator
- `@Public()` - Bỏ qua JWT guard
- `@CurrentUser()` - Lấy user từ request
- `@ApiResponse()` - Swagger documentation

**guards/**

- `JwtAuthGuard` - Verify JWT token
- `RolesGuard` - Check user roles
- `ThrottleGuard` - Rate limiting (DOS protection)

**interceptors/**

- `LoggingInterceptor` - Log request/response
- `TimeoutInterceptor` - Request timeout (30s)
- `TransformInterceptor` - Chuẩn hóa response format

**filters/**

- `HttpExceptionFilter` - Handle HTTP errors
- `AllExceptionsFilter` - Catch-all handler

**pipes/**

- `ValidationPipe` - DTO validation
- `ParseObjectIdPipe` - Parse MongoDB ObjectId

**middleware/**

- `LoggerMiddleware` - Request logger
- `CorrelationIdMiddleware` - Track request ID

---

### **config/** - Configuration

**Quản lý environment variables:**

```env
# app.config.ts
PORT=8000
NODE_ENV=production
CORS_ORIGIN=http://localhost:3000

# database.config.ts
DB_HOST=postgres
DB_PORT=5432
DB_NAME=smartforecast

# jwt.config.ts
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d

# orion.config.ts
ORION_URL=http://orion:1026

# minio.config.ts
MINIO_ENDPOINT=minio
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin

# firebase.config.ts
FIREBASE_PROJECT_ID=your_project_id
FIREBASE_PRIVATE_KEY=...

# redis.config.ts
REDIS_HOST=redis
REDIS_PORT=6379
```

---

### **database/** - Database infrastructure

**migrations/** - TypeORM migrations

- `1705308600000-CreateUserTable.ts`
- `1705308700000-CreateIncidentTable.ts`
- `1705308800000-CreateAlertTable.ts`

**seeds/** - Test data

- `user.seed.ts` - Admin user
- `alert-rules.seed.ts` - Threshold rules

---

### **shared/** - Shared resources

**interfaces/**

- `BaseEntity` - id, createdAt, updatedAt
- `Pagination` - page, limit, total

**constants/**

- `APP_CONSTANTS` - App-wide values
- `ERROR_MESSAGES` - Localized error messages
- `NGSI_LD_CONSTANTS` - Context URLs

**utils/**

- `dateUtils.ts` - Format, parse dates
- `geoUtils.ts` - Calculate distance, GeoJSON helpers

**types/**

- `express.d.ts` - Extend Express Request with `user`

---

## 📋 Đề xuất cải tiến

### ✅ Cần thêm:

1. **Module `health`** - Health check endpoints
2. **Redis configuration** - Cho caching & queue
3. **Middleware folder** - Logger, correlation ID
4. **Interfaces trong modules** - Chuẩn hóa provider pattern
5. **Queue trong notification** - Xử lý bất đồng bộ
6. **shared/types** - Extend Express Request
7. **User device entity** - Lưu FCM tokens

### 🔄 Nên điều chỉnh:

1. **Tách `database/` ra ngoài `src/`** - Migrations nên ở root level
2. **Thêm `tests/` cho mỗi module** - Unit tests, E2E tests
3. **Swagger documentation** - OpenAPI spec
4. **Docker multi-stage build** - Optimize image size

### 🚀 Mở rộng sau này:

1. **Module `geofencing`** - Gửi alert theo vị trí
2. **Module `forecast`** - Machine learning dự báo
3. **Module `audit`** - Audit logs
4. **Module `reporting`** - PDF/Excel export

---

## 🎯 Kết luận

Cấu trúc backend hiện tại **đã khá tốt** và tuân thủ các nguyên tắc:

- ✅ Separation of Concerns
- ✅ Domain-Driven Design
- ✅ Scalability
- ✅ Maintainability

Với các **đề xuất bổ sung** trên, hệ thống sẽ:

- 🔒 An toàn hơn (health check, monitoring)
- ⚡ Hiệu năng cao hơn (Redis caching, queue)
- 🧪 Dễ test hơn (test structure)
- 📈 Dễ mở rộng hơn (clear interfaces, patterns)
