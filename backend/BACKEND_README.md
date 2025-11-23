# Smart Forecast Backend - API Documentation

Backend service của Smart Forecast platform, xây dựng với NestJS.

## 📋 Các Issue đã hoàn thành

### ✅ P1-AUTH-01: Thiết kế DB (User)

- Tạo User entity với TypeORM
- Hỗ trợ 2 role: ADMIN và CITIZEN
- Tự động hash password với bcrypt
- Các trường: id, email, password, fullName, phoneNumber, avatarUrl, fcmToken, role, isActive

### ✅ P1-BE-02: Cấu hình cơ sở dữ liệu

- Thiết lập TypeORM kết nối PostgreSQL
- Database configuration trong `config/database.config.ts`
- Tự động sync schema trong development mode

### ✅ P1-BE-03: Cấu trúc Module

- Module auth: Xác thực và phân quyền
- Module user: Quản lý người dùng
- Module airquality: Dữ liệu chất lượng không khí (placeholder)
- Module incident: Báo cáo sự cố (placeholder)
- Common guards, decorators, interceptors

### ✅ P1-BE-04: Cấu hình Environment

- File .env và .env.example
- ConfigModule với app, database, jwt configs
- Quản lý biến môi trường tập trung

### ✅ Environmental Data API Modules (Air Quality & Weather) 🆕

- **Air Quality Module**: REST API để đọc dữ liệu chất lượng không khí
  - Current data (real-time từ Orion-LD)
  - Forecast data (4-day hourly từ Orion-LD)
  - Historical data (paginated từ PostgreSQL)
  - Support filtering by station, city, date range
- **Weather Module**: REST API để đọc dữ liệu thời tiết
  - Current weather (real-time từ Orion-LD)
  - Forecast weather (7-day daily từ Orion-LD)
  - Historical data (paginated từ PostgreSQL)
  - Support filtering by station, city, date range

- **Role-Based Access Control**:
  - Thêm role MANAGER (quản lý trạm, xem dữ liệu môi trường)
  - RolesGuard implementation
  - Apply guards lên Station, Ingestion, Air Quality, Weather endpoints

- **Database Optimization**:
  - Thêm composite indexes: `['locationId', 'dateObserved']`, `['dateObserved']`
  - Optimize time-series queries
  - Pagination support với metadata (total, page, limit, totalPages)

## 🎯 API Endpoints

### Authentication

**POST** `/api/v1/auth/register` - Đăng ký tài khoản (Citizen)

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789"
}
```

**POST** `/api/v1/auth/login` - Đăng nhập

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**GET** `/api/v1/auth/me` - Lấy thông tin user hiện tại (cần JWT token)

### Users

**GET** `/api/v1/users` - Danh sách users (cần auth)

**GET** `/api/v1/users/:id` - Chi tiết user (cần auth)

### 🌬️ Air Quality (ADMIN, MANAGER required)

**GET** `/api/v1/air-quality/current` - Dữ liệu chất lượng không khí hiện tại (từ Orion-LD)

- Query params: `?stationId=xxx&city=xxx`
- Returns: Real-time air quality data với pollutants (CO, NO, NO2, O3, SO2, PM2.5, PM10, NH3) và AQI

**GET** `/api/v1/air-quality/forecast` - Dự báo chất lượng không khí 4 ngày (từ Orion-LD)

- Query params: `?stationId=xxx`
- Returns: Hourly forecast array với validFrom/validTo timestamps

**GET** `/api/v1/air-quality/history` - Lịch sử dữ liệu chất lượng không khí (từ PostgreSQL)

- Query params: `?stationId=xxx&startDate=ISO8601&endDate=ISO8601&page=1&limit=50`
- Returns: Paginated historical data với metadata

**GET** `/api/v1/air-quality/station/:stationId` - Dữ liệu mới nhất của trạm cụ thể

### 🌦️ Weather (ADMIN, MANAGER required)

**GET** `/api/v1/weather/current` - Dữ liệu thời tiết hiện tại (từ Orion-LD)

- Query params: `?stationId=xxx&city=xxx`
- Returns: Real-time weather với temperature, humidity, pressure, wind, precipitation, etc.

**GET** `/api/v1/weather/forecast` - Dự báo thời tiết 7 ngày (từ Orion-LD)

- Query params: `?stationId=xxx`
- Returns: Daily forecast array với validFrom/validTo timestamps

**GET** `/api/v1/weather/history` - Lịch sử dữ liệu thời tiết (từ PostgreSQL)

- Query params: `?stationId=xxx&startDate=ISO8601&endDate=ISO8601&page=1&limit=50`
- Returns: Paginated historical data với metadata

**GET** `/api/v1/weather/station/:stationId` - Dữ liệu mới nhất của trạm cụ thể

### 📍 Stations (ADMIN, MANAGER required)

**GET** `/api/v1/stations` - Danh sách tất cả trạm quan trắc

- Query params: `?city=xxx&district=xxx&status=ACTIVE&priority=HIGH`

**GET** `/api/v1/stations/active` - Danh sách trạm đang hoạt động

**GET** `/api/v1/stations/stats` - Thống kê trạm quan trắc

**GET** `/api/v1/stations/:id` - Chi tiết trạm cụ thể

**POST** `/api/v1/stations` - Tạo trạm mới

**PUT** `/api/v1/stations/:id` - Cập nhật trạm

**DELETE** `/api/v1/stations/:id` - Xóa trạm (soft delete)

**POST** `/api/v1/stations/:id/activate` - Kích hoạt trạm

**POST** `/api/v1/stations/:id/deactivate` - Vô hiệu hóa trạm

### 🔄 Data Ingestion (ADMIN, MANAGER required)

**POST** `/api/v1/ingestion/air-quality` - Trigger thu thập dữ liệu air quality thủ công

**POST** `/api/v1/ingestion/weather` - Trigger thu thập dữ liệu weather thủ công

**POST** `/api/v1/ingestion/all` - Trigger thu thập tất cả dữ liệu

**GET** `/api/v1/ingestion/health` - Health check (OpenWeatherMap + Orion-LD)

**GET** `/api/v1/ingestion/stats` - Thống kê ingestion

> **Note**: Data ingestion tự động chạy mỗi 30 phút qua cron scheduler

## 📊 Response Format Examples

### Air Quality Current/Forecast Response:

```json
{
  "data": [
    {
      "id": "urn:ngsi-ld:AirQualityObserved:HN-BA-DINH-001-20251122T100000Z",
      "stationId": "urn:ngsi-ld:ObservationStation:HN-BA-DINH-001",
      "location": { "lat": 21.0285, "lon": 105.8542 },
      "address": "Hanoi, Vietnam",
      "dateObserved": "2025-11-22T10:00:00Z",
      "pollutants": {
        "co": 203.6,
        "no": 0.0,
        "no2": 0.4,
        "o3": 75.1,
        "so2": 0.6,
        "pm25": 23.3,
        "pm10": 92.2,
        "nh3": 0.1
      },
      "aqi": {
        "openWeather": { "index": 3, "level": "Moderate" },
        "epaUS": { "index": 75, "level": "Moderate" }
      }
    }
  ],
  "source": "orion-ld",
  "timestamp": "2025-11-22T10:05:00Z"
}
```

### History Response (Paginated):

```json
{
  "data": [...],
  "meta": {
    "total": 1500,
    "page": 1,
    "limit": 50,
    "totalPages": 30
  }
}
```

## 🔑 User Roles

| Role        | Permissions                                                           |
| ----------- | --------------------------------------------------------------------- |
| **ADMIN**   | Full access - quản lý users, stations, ingestion, xem tất cả dữ liệu  |
| **MANAGER** | Quản lý stations, trigger ingestion, xem environmental data dashboard |
| **CITIZEN** | Nhận alerts, báo cáo sự cố (mobile app)                               |

## 🔐 Sử dụng Shared Types

Backend sử dụng types từ package `@smart-forecast/shared`:

```typescript
import { UserRole, IUser, ILoginRequest, IJwtPayload } from '@smart-forecast/shared';

// DTO implements shared interface
export class LoginDto implements ILoginRequest {
  email: string;
  password: string;
}
```

## 🚀 Chạy ứng dụng

```bash
# Build shared package trước
cd ../shared && npm run build

# Về backend và cài đặt
cd ../backend
npm install

# Copy file env
cp .env.example .env

# Chạy development
npm run start:dev
```

Application sẽ chạy tại: `http://localhost:8000`

API docs: `http://localhost:8000/api/v1`

## 📦 Dependencies chính

- @nestjs/core, @nestjs/common - NestJS framework
- @nestjs/typeorm, typeorm, pg - Database ORM
- @nestjs/jwt, @nestjs/passport - Authentication
- @smart-forecast/shared - Shared types & constants
- bcrypt - Password hashing
- class-validator, class-transformer - Validation

## 🗄️ Database Schema

### Table: users

| Column      | Type      | Constraints       |
| ----------- | --------- | ----------------- |
| id          | UUID      | PRIMARY KEY       |
| email       | VARCHAR   | UNIQUE, NOT NULL  |
| password    | VARCHAR   | NOT NULL          |
| fullName    | VARCHAR   | NULL              |
| phoneNumber | VARCHAR   | NULL              |
| avatarUrl   | VARCHAR   | NULL              |
| fcmToken    | VARCHAR   | NULL              |
| role        | ENUM      | DEFAULT 'CITIZEN' |
| isActive    | BOOLEAN   | DEFAULT true      |
| createdAt   | TIMESTAMP | DEFAULT NOW()     |
| updatedAt   | TIMESTAMP | DEFAULT NOW()     |

## 👥 Team NEU-DataVerse

- Khải - Backend Lead, DevOps
- Đạt - Frontend Web
- Bích - Frontend Mobile & Documentation
