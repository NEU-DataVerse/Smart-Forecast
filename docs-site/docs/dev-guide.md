---
sidebar_position: 7
title: Hướng dẫn phát triển
---

# 👨‍💻 Hướng dẫn phát triển

Hướng dẫn chi tiết cho developers tham gia dự án Smart Forecast.

---

## 📋 Prerequisites

| Công cụ | Phiên bản | Ghi chú               |
| ------- | --------- | --------------------- |
| Node.js | ≥ 20.x    | LTS version           |
| pnpm    | ≥ 8.x     | `npm install -g pnpm` |
| Docker  | ≥ 20.10   | Docker Desktop        |
| Git     | Latest    | Version control       |

### Kiểm tra cài đặt

```bash
node --version    # v20.x.x
pnpm --version    # 8.x.x
docker --version  # Docker version 24.x.x
git --version     # git version 2.x.x
```

---

## 🚀 Quick Start

### 1. Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 2. Cài đặt dependencies

```bash
pnpm install
```

### 3. Build shared package

```bash
pnpm run build:shared
```

### 4. Setup Docker services

```bash
# Linux/macOS
./scripts/setup.sh

# Windows
scripts\setup.bat
```

### 5. Chạy development servers

```bash
# Terminal 1: Backend
pnpm run dev:backend

# Terminal 2: Web
pnpm run dev:web

# Terminal 3: Mobile
pnpm run dev:mobile
```

---

## 🏗️ Cấu trúc dự án

```
Smart-Forecast/
├── backend/           # NestJS API Server
├── web/               # Next.js Dashboard
├── mobile/            # Expo React Native App
├── shared/            # Shared TypeScript Types
├── docs-site/         # Docusaurus Documentation
├── scripts/           # Utility Scripts
├── docker-compose.yml
└── pnpm-workspace.yaml
```

---

## 🔧 Backend Development (NestJS)

### Khởi động

```bash
# Development mode
pnpm run dev:backend
# → http://localhost:8000

# Hoặc dùng Makefile
make dev-backend
```

### Các lệnh thường dùng

```bash
# Development
pnpm run dev:backend          # Hot-reload mode
pnpm run start:backend        # Production mode

# Build
pnpm run build:backend

# Testing
pnpm run test:backend         # Unit tests
pnpm run test:e2e            # E2E tests
pnpm run test:cov            # Coverage report

# Linting
pnpm run lint:backend
pnpm --filter backend run lint:fix
```

### Cấu trúc code

```
backend/src/
├── main.ts                   # Entry point
├── app.module.ts            # Root module
├── config/                  # Configuration
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── orion.config.ts
├── modules/
│   ├── auth/               # JWT Authentication
│   ├── user/               # User Management
│   ├── alert/              # Alert System
│   ├── incident/           # Incident Reports
│   ├── air-quality/        # Air Quality Data
│   ├── weather/            # Weather Data
│   ├── ingestion/          # Data Ingestion
│   └── station/            # Station Management
└── common/
    ├── decorators/         # Custom decorators
    ├── guards/             # Auth guards (RBAC)
    ├── filters/            # Exception filters
    └── interceptors/       # Request interceptors
```

### Tạo module mới

```bash
cd backend

# Tạo resource hoàn chỉnh
npx nest g resource modules/my-resource

# Tạo từng phần
npx nest g module modules/my-module
npx nest g controller modules/my-module
npx nest g service modules/my-module
```

### Database migrations

```bash
# Chạy migrations
pnpm --filter backend run migration:run

# Tạo migration mới
pnpm --filter backend run migration:create my-migration

# Revert migration
pnpm --filter backend run migration:revert
```

---

## 🌐 Web Development (Next.js)

### Khởi động

```bash
# Development mode
pnpm run dev:web
# → http://localhost:3000

# Hoặc dùng Makefile
make dev-web
```

### Các lệnh thường dùng

```bash
# Development
pnpm run dev:web              # Hot-reload mode
pnpm run start:web            # Production mode

# Build
pnpm run build:web

# Linting
pnpm run lint:web
```

### Cấu trúc code

```
web/src/
├── app/                      # Next.js App Router
│   ├── layout.tsx
│   ├── page.tsx
│   ├── dashboard/
│   ├── alerts/
│   └── incidents/
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── charts/              # Recharts components
│   └── map/                 # Map components
├── services/
│   └── api.ts               # API client
├── hooks/                   # Custom hooks
└── lib/
    └── utils.ts
```

### Thêm UI components (shadcn/ui)

```bash
cd web

# Thêm component
npx shadcn-ui@latest add button
npx shadcn-ui@latest add form input
npx shadcn-ui@latest add dialog
```

### API Integration

```typescript
// web/src/services/api.ts
import axios from 'axios';
import type { IAlert } from '@smart-forecast/shared';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

export const getAlerts = async (): Promise<IAlert[]> => {
  const { data } = await api.get('/alerts');
  return data;
};
```

---

## 📱 Mobile Development (Expo)

### Khởi động

```bash
# Start Expo dev server
pnpm run dev:mobile
# → http://localhost:8081

# Hoặc dùng Makefile
make dev-mobile
```

### Các lệnh thường dùng

```bash
# Development
pnpm run dev:mobile           # Start dev server
pnpm --filter mobile run android  # Run Android
pnpm --filter mobile run ios      # Run iOS

# Linting
pnpm run lint:mobile

# Reset project
pnpm --filter mobile run reset-project
```

### Cấu trúc code

```
mobile/
├── app/                      # Expo Router
│   ├── _layout.tsx
│   ├── login.tsx
│   └── (tabs)/
│       ├── index.tsx        # Home tab
│       └── explore.tsx      # Explore tab
├── components/
│   ├── AlertCard.tsx
│   ├── EnvCard.tsx
│   └── MapView/
├── services/
│   └── api.ts
├── store/                   # Zustand state
└── hooks/
```

### Environment cho Mobile

:::caution Lưu ý quan trọng
Mobile **KHÔNG** sử dụng `localhost`. Phải dùng IP máy của bạn!
:::

```bash
# Tìm IP của bạn
# Windows: ipconfig
# macOS/Linux: ifconfig

# mobile/.env
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api/v1
EXPO_PUBLIC_MINIO_URL=http://192.168.1.100:9000
```

---

## 📦 Shared Package

Shared package chứa types, interfaces và constants dùng chung.

### Build

```bash
pnpm run build:shared
```

### Cấu trúc

```
shared/src/
├── types/
│   ├── user.types.ts
│   ├── alert.types.ts
│   └── incident.types.ts
├── constants/
│   ├── roles.ts
│   └── status.ts
└── index.ts
```

### Sử dụng trong các packages

```typescript
// Import từ shared
import { IUser, IAlert, UserRole } from '@smart-forecast/shared';
```

:::warning Lưu ý
Sau khi thay đổi shared package, **PHẢI** build lại:

```bash
pnpm run build:shared
```

:::

---

## ⚙️ Environment Variables

### Cấu trúc files

```
docker/.env.infrastructure    # Docker services
backend/.env                  # Backend API
web/.env.local               # Web frontend
mobile/.env                  # Mobile app
```

### Setup

```bash
# Copy tất cả file .env.example
cp docker/.env.infrastructure.example docker/.env.infrastructure
cp backend/.env.example backend/.env
cp web/.env.local.example web/.env.local
cp mobile/.env.example mobile/.env
```

### Backend (.env)

```bash
# Database
DATABASE_URL=postgresql://admin:admin@localhost:5432/smart_forecast_db
MONGO_URL=mongodb://admin:admin@localhost:27017/orion?authSource=admin

# API Keys
OPENWEATHER_API_KEY=your_api_key
JWT_SECRET=change_this_in_production

# Services
ORION_LD_URL=http://localhost:1026
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
```

### Web (.env.local)

```bash
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MINIO_URL=http://localhost:9000
```

### Mobile (.env)

```bash
# Thay YOUR_IP bằng IP máy của bạn
EXPO_PUBLIC_API_URL=http://YOUR_IP:8000/api/v1
EXPO_PUBLIC_MINIO_URL=http://YOUR_IP:9000
```

---

## 🧪 Testing

### Backend

```bash
# Unit tests
pnpm run test:backend

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov
```

### Web

```bash
pnpm run test:web
```

### Mobile

```bash
pnpm run test:mobile
```

---

## 📝 Code Style

### ESLint & Prettier

```bash
# Lint toàn bộ project
pnpm run lint

# Lint từng package
pnpm run lint:backend
pnpm run lint:web
pnpm run lint:mobile

# Fix issues
pnpm --filter backend run lint:fix
```

### Commit Conventions

Sử dụng [Conventional Commits](https://www.conventionalcommits.org/):

```
feat(backend): add weather forecast API
fix(mobile): resolve map loading issue
docs: update API documentation
chore(deps): update dependencies
```

### Branch Naming

```
feature/add-alert-module
fix/weather-api-timeout
docs/update-readme
chore/update-dependencies
```

---

## 🔄 Common Workflows

### Thêm dependency

```bash
# Backend
pnpm add axios --filter backend

# Web
pnpm add react-query --filter web

# Mobile
pnpm add zustand --filter mobile

# Dev dependency
pnpm add -D @types/node --filter backend
```

### Debug Backend

```bash
# Start với debug mode
pnpm --filter backend run start:debug

# Attach VS Code debugger (port 9229)
```

### Database shell

```bash
# PostgreSQL
make db-shell
# hoặc
docker compose exec postgres psql -U admin -d smart_forecast_db

# MongoDB
make mongo-shell
# hoặc
docker compose exec mongodb mongosh
```

---

## 📖 Tiếp theo

- [Kiến trúc hệ thống](./architecture) - System architecture
- [API Documentation](./api) - REST API endpoints
- [Troubleshooting](./troubleshooting) - Xử lý lỗi
