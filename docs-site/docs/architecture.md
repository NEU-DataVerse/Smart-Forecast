---
sidebar_position: 3
title: Kiến trúc hệ thống
---

# 🏗️ Kiến trúc hệ thống

Tổng quan về kiến trúc và các thành phần của Smart Forecast.

---

## 📐 Sơ đồ kiến trúc tổng thể

```
                    ┌─────────────────────────────────────────┐
                    │              DATA SOURCES               │
                    │         (OpenWeatherMap APIs)           │
                    └─────────────────┬───────────────────────┘
                                      │
                                      ▼
┌─────────────────┐     ┌─────────────────────────────────────┐
│   Mobile App    │     │           Backend (NestJS)           │
│   (Expo RN)     │◄───►│  • Data Ingestion (NGSI-LD)         │
└─────────────────┘     │  • Alert Management                  │
                        │  • Incident Reports                  │
┌─────────────────┐     │  • Push Notifications (FCM)         │
│  Web Dashboard  │◄───►│  • REST API                         │
│   (Next.js)     │     └─────────────────┬───────────────────┘
└─────────────────┘                       │
                            ┌─────────────┼─────────────┐
                            │             │             │
                       ┌────▼────┐   ┌───▼────┐   ┌───▼────┐
                       │ Orion   │   │Postgres│   │ MinIO  │
                       │   -LD   │   │   DB   │   │Storage │
                       └────┬────┘   └────────┘   └────────┘
                            │
                       ┌────▼────┐
                       │ MongoDB │
                       └─────────┘
```

---

## 📦 Cấu trúc Monorepo

```
smart-forecast/
├── backend/          # NestJS API Server
├── web/              # Next.js Admin Dashboard
├── mobile/           # Expo React Native App
├── shared/           # Shared TypeScript Models & Constants
├── docs-site/        # Docusaurus Documentation
├── scripts/          # Utility Scripts
├── docker-compose.yml
└── pnpm-workspace.yaml
```

### Mô tả các thành phần

| Thư mục      | Công nghệ  | Mô tả                                            |
| ------------ | ---------- | ------------------------------------------------ |
| `backend/`   | NestJS     | REST API, xử lý business logic, tích hợp NGSI-LD |
| `web/`       | Next.js 15 | Dashboard quản trị cho Admin/Manager             |
| `mobile/`    | Expo       | Ứng dụng di động cho người dân                   |
| `shared/`    | TypeScript | Types, interfaces, constants dùng chung          |
| `docs-site/` | Docusaurus | Trang tài liệu (đang xem)                        |

---

## 🔄 Luồng dữ liệu

### 1. Thu thập dữ liệu (Data Ingestion)

```
OpenWeatherMap API
        │
        ▼
┌───────────────────┐
│  Ingestion Module │
│  (Backend NestJS) │
└─────────┬─────────┘
          │
          ▼
┌───────────────────┐
│  Transform to     │
│  NGSI-LD Entities │
│  (JSON-LD format) │
└─────────┬─────────┘
          │
    ┌─────┴─────┐
    │           │
    ▼           ▼
┌───────┐  ┌─────────┐
│Orion  │  │Postgres │
│  -LD  │  │(History)│
└───────┘  └─────────┘
```

### 2. Xử lý cảnh báo (Alert Flow)

```
┌─────────────────┐
│ Admin Dashboard │
│   (Next.js)     │
└────────┬────────┘
         │ POST /alerts
         ▼
┌─────────────────┐
│  Alert Module   │
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌─────────┐
│  FCM  │  │Postgres │
│(Push) │  │(Storage)│
└───┬───┘  └─────────┘
    │
    ▼
┌─────────────────┐
│   Mobile App    │
│ (Push Notification)
└─────────────────┘
```

### 3. Báo cáo sự cố (Incident Flow)

```
┌─────────────────┐
│   Mobile App    │
│  (Chụp ảnh +    │
│   GPS + Mô tả)  │
└────────┬────────┘
         │ POST /incidents
         ▼
┌─────────────────┐
│ Incident Module │
│   (Backend)     │
└────────┬────────┘
         │
    ┌────┴────┐
    │         │
    ▼         ▼
┌───────┐  ┌─────────┐
│ MinIO │  │Postgres │
│(Photos)  │(Metadata)
└───────┘  └─────────┘
         │
         ▼
┌─────────────────┐
│ Admin Dashboard │
│(Xem & Xử lý)    │
└─────────────────┘
```

---

## 🧩 Các thành phần chi tiết

### Backend (NestJS)

```
backend/src/
├── main.ts                   # Entry point
├── app.module.ts             # Root module
├── config/                   # Configuration
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── orion.config.ts
├── modules/
│   ├── auth/                 # JWT Authentication
│   ├── user/                 # User Management
│   ├── alert/                # Alert System
│   ├── incident/             # Incident Reports
│   ├── air-quality/          # Air Quality Data
│   ├── weather/              # Weather Data
│   ├── ingestion/            # Data Ingestion
│   ├── station/              # Station Management
│   └── persistence/          # Data Persistence
└── common/
    ├── decorators/
    ├── guards/               # RBAC Guards
    └── interceptors/
```

### Web Dashboard (Next.js)

```
web/src/
├── app/                      # App Router
│   ├── dashboard/            # Dashboard pages
│   ├── alerts/               # Alert management
│   ├── incidents/            # Incident management
│   └── reports/              # Reports & Export
├── components/
│   ├── ui/                   # shadcn/ui components
│   ├── charts/               # Recharts components
│   └── map/                  # Leaflet/MapLibre
└── services/
    └── api.ts                # API client
```

### Mobile App (Expo)

```
mobile/
├── app/                      # Expo Router
│   ├── (tabs)/               # Tab navigation
│   ├── login.tsx             # Auth screen
│   └── +not-found.tsx
├── components/
│   ├── AlertCard.tsx
│   ├── EnvCard.tsx
│   └── MapView/
├── services/
│   └── api.ts
└── store/                    # Zustand state
```

---

## 🗄️ Database Schema

### PostgreSQL Tables

| Table                 | Mô tả                                          |
| --------------------- | ---------------------------------------------- |
| `users`               | Thông tin người dùng (admin, manager, citizen) |
| `alerts`              | Cảnh báo thiên tai, môi trường                 |
| `incidents`           | Báo cáo sự cố từ người dân                     |
| `stations`            | Trạm quan trắc                                 |
| `weather_history`     | Lịch sử dữ liệu thời tiết                      |
| `air_quality_history` | Lịch sử dữ liệu chất lượng không khí           |

### MongoDB Collections (Orion-LD)

| Collection | Entity Type          | Mô tả                        |
| ---------- | -------------------- | ---------------------------- |
| `entities` | `WeatherObserved`    | Dữ liệu thời tiết real-time  |
| `entities` | `AirQualityObserved` | Dữ liệu chất lượng không khí |

---

## 🔌 Tích hợp FIWARE

### NGSI-LD Context Broker

Smart Forecast sử dụng **Orion-LD** làm Context Broker để quản lý dữ liệu môi trường theo chuẩn **NGSI-LD**.

### Tại sao dùng NGSI-LD?

- ✅ **Tiêu chuẩn ETSI** - Chuẩn quốc tế cho dữ liệu ngữ cảnh
- ✅ **Linked Data** - Dữ liệu liên kết với JSON-LD
- ✅ **Smart Data Models** - Sử dụng data models chuẩn của FIWARE
- ✅ **Interoperability** - Dễ dàng tích hợp với các hệ thống khác

### Smart Data Models sử dụng

| Model                | Mô tả                                       |
| -------------------- | ------------------------------------------- |
| `WeatherObserved`    | Dữ liệu thời tiết (nhiệt độ, độ ẩm, gió...) |
| `AirQualityObserved` | Chất lượng không khí (AQI, PM2.5, PM10...)  |

---

## 🔐 Authentication & Authorization

### JWT Authentication

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Client    │────►│   Backend   │────►│  Database   │
│             │     │  (JWT Auth) │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Role-Based Access Control (RBAC)

| Role      | Quyền hạn                                 |
| --------- | ----------------------------------------- |
| `ADMIN`   | Toàn quyền quản lý hệ thống               |
| `MANAGER` | Quản lý alerts, incidents, xem reports    |
| `CITIZEN` | Xem dữ liệu, nhận cảnh báo, gửi incidents |

---

## 📱 Push Notifications

### Firebase Cloud Messaging (FCM)

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   Backend   │────►│   Firebase  │────►│  Mobile App │
│             │     │     FCM     │     │             │
└─────────────┘     └─────────────┘     └─────────────┘
```

### Loại thông báo

- **Alert Notifications** - Cảnh báo thiên tai, môi trường
- **Incident Updates** - Cập nhật trạng thái sự cố
- **System Notifications** - Thông báo hệ thống

---

## 📖 Tiếp theo

- [Triển khai](./deployment) - Docker Compose và scripts
- [API Documentation](./api) - REST API endpoints
- [Data Models](./data-model) - NGSI-LD entities chi tiết
