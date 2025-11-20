# 👨‍💻 Development Guide

Hướng dẫn phát triển cho thành viên mới trong dự án Smart-Forecast.

## 📋 Mục lục

- [Cấu trúc dự án](#cấu-trúc-dự-án)
- [Setup môi trường](#setup-môi-trường)
- [Backend Development (NestJS)](#backend-development-nestjs)
- [Web Development (Next.js)](#web-development-nextjs)
- [Mobile Development (Expo)](#mobile-development-expo)
- [Shared Package](#shared-package)
- [Testing](#testing)
- [Common Tasks](#common-tasks)
- [Best Practices](#best-practices)

---

## 🏗️ Cấu trúc dự án

```
Smart-Forecast/
├── package.json              # Root package với workspace scripts
├── pnpm-workspace.yaml       # PNPM workspace config
├── .env                      # Environment variables
├── docker-compose.yml        # Docker services
│
├── backend/                  # NestJS Backend API
│   ├── src/
│   ├── test/
│   ├── package.json
│   └── tsconfig.json
│
├── web/                      # Next.js Web Frontend
│   ├── src/
│   │   ├── app/             # App router
│   │   ├── components/      # React components
│   │   └── services/        # API services
│   ├── package.json
│   └── next.config.ts
│
├── mobile/                   # Expo Mobile App
│   ├── app/                 # Expo router
│   ├── components/          # React Native components
│   ├── package.json
│   └── app.json
│
└── shared/                   # Shared TypeScript types
    ├── src/
    │   ├── types/           # Type definitions
    │   └── constants/       # Shared constants
    ├── package.json
    └── tsconfig.json
```

---

## ⚙️ Setup môi trường

### 1️⃣ Prerequisites

Cài đặt các công cụ sau:

```bash
# Node.js (>= 20.x)
node --version

# PNPM (>= 8.x)
npm install -g pnpm
pnpm --version

# Git
git --version

# Docker & Docker Compose (cho backend services)
docker --version
docker-compose --version
```

### 2️⃣ Clone và Setup

```bash
# Clone repository
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast

# Cài đặt dependencies cho tất cả packages
pnpm install

# Build shared package (BẮT BUỘC!)
pnpm run build:shared

# Setup Docker services (nếu cần backend)
./scripts/setup.sh  # Linux/Mac
scripts\setup.bat   # Windows
```

### 3️⃣ Environment Variables

```bash
# Tạo file .env
cp .env.example .env

# Cấu hình các biến quan trọng
# - JWT_SECRET
# - OWM_API_KEY (OpenWeatherMap)
# - Database credentials
```

---

## 🔧 Backend Development (NestJS)

### Quick Start

```bash
# Chạy backend development server
pnpm run dev:backend

# Hoặc dùng Makefile
make dev-backend

# Backend sẽ chạy tại: http://localhost:8000
```

### Available Commands

```bash
# Development
pnpm run dev:backend          # Start với hot-reload
pnpm run start:backend        # Start production mode

# Build
pnpm run build:backend        # Build backend

# Testing
pnpm run test:backend         # Run unit tests
pnpm run test:e2e            # Run E2E tests
pnpm run test:cov            # Test với coverage

# Code Quality
pnpm run lint:backend         # Check linting
pnpm --filter backend run lint:fix  # Fix linting issues
```

### Cấu trúc Backend

```
backend/src/
├── main.ts                   # Entry point
├── app.module.ts            # Root module
├── config/                  # Configuration
│   ├── database.config.ts
│   ├── jwt.config.ts
│   └── orion.config.ts
├── modules/
│   ├── auth/               # Authentication
│   ├── user/               # User management
│   ├── alert/              # Alert system
│   ├── incident/           # Incident reporting
│   ├── airquality/         # Air quality data
│   ├── weather/            # Weather data
│   ├── ingestion/          # Data ingestion
│   └── persistence/        # Data persistence
└── common/
    ├── decorators/
    ├── filters/
    ├── guards/
    ├── interceptors/
    └── pipes/
```

### API Documentation

```bash
# Start backend và truy cập:
http://localhost:8000/api
```

### Database

```bash
# Kết nối PostgreSQL
make db-shell

# Hoặc
docker exec -it postgres psql -U admin -d smart_forecast_db
```

### Common Tasks

#### Tạo Module mới

```bash
cd backend

# Tạo resource hoàn chỉnh (module, controller, service, entity)
npx nest g resource modules/my-resource

# Hoặc từng phần
npx nest g module modules/my-module
npx nest g controller modules/my-module
npx nest g service modules/my-module
```

#### Thêm Dependency

```bash
# Thêm vào backend package
pnpm add axios --filter backend

# Dev dependency
pnpm add -D @types/axios --filter backend
```

#### Debug

```bash
# Chạy với debug mode
pnpm --filter backend run start:debug

# Attach debugger trong VS Code (port 9229)
```

---

## 🌐 Web Development (Next.js)

### Quick Start

```bash
# Chạy web development server
pnpm run dev:web

# Hoặc
make dev-web

# Web sẽ chạy tại: http://localhost:3000
```

### Available Commands

```bash
# Development
pnpm run dev:web             # Start với hot-reload
pnpm run start:web           # Start production mode

# Build
pnpm run build:web           # Build web app

# Testing
pnpm run test:web            # Run tests

# Code Quality
pnpm run lint:web            # Check linting
pnpm --filter web run lint -- --fix  # Fix linting issues
```

### Cấu trúc Web

```
web/src/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Root layout
│   ├── page.tsx             # Home page
│   ├── dashboard/           # Dashboard pages
│   ├── alerts/              # Alerts pages
│   └── incidents/           # Incidents pages
├── components/
│   ├── ui/                  # shadcn/ui components
│   ├── layout/              # Layout components
│   ├── alerts/              # Alert components
│   └── map/                 # Map components
├── services/
│   ├── api.ts               # API client
│   ├── auth.ts              # Auth service
│   └── alerts.ts            # Alerts service
├── hooks/
│   ├── useAuth.ts
│   └── useAlerts.ts
├── context/
│   └── AuthContext.tsx
└── lib/
    └── utils.ts
```

### Environment Variables

```env
# web/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token
```

### Common Tasks

#### Tạo Component mới

```bash
# Trong web/src/components/
mkdir my-component
touch my-component/MyComponent.tsx
touch my-component/index.ts
```

#### Thêm UI Component (shadcn/ui)

```bash
cd web

# Thêm button component
npx shadcn-ui@latest add button

# Thêm form components
npx shadcn-ui@latest add form input
```

#### Thêm Page mới

```bash
# Tạo page tại web/src/app/my-page/page.tsx
mkdir -p web/src/app/my-page
touch web/src/app/my-page/page.tsx
```

#### API Integration

```typescript
// web/src/services/api.ts
import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
});

// Sử dụng shared types
import type { IAlert, IIncident } from '@smart-forecast/shared';

export const getAlerts = async (): Promise<IAlert[]> => {
  const { data } = await api.get('/alerts');
  return data;
};
```

---

## 📱 Mobile Development (Expo)

### Quick Start

```bash
# Chạy mobile development server
pnpm run dev:mobile

# Hoặc
make dev-mobile

# Expo DevTools sẽ mở tại: http://localhost:8081
```

### Available Commands

```bash
# Development
pnpm run dev:mobile          # Start Expo dev server
pnpm --filter mobile run android  # Run trên Android
pnpm --filter mobile run ios      # Run trên iOS
pnpm --filter mobile run web      # Run trên web browser

# Testing
pnpm run lint:mobile         # Check linting

# Reset
pnpm --filter mobile run reset-project  # Reset về template gốc
```

### Cấu trúc Mobile

```
mobile/
├── app/                      # Expo Router
│   ├── _layout.tsx          # Root layout
│   ├── index.tsx            # Home screen
│   ├── (tabs)/              # Tab navigation
│   │   ├── index.tsx        # Home tab
│   │   └── explore.tsx      # Explore tab
│   └── modal.tsx            # Modal screen
├── components/
│   ├── ui/                  # UI components
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/
│   └── theme.ts
├── hooks/
│   └── use-color-scheme.ts
└── assets/
    └── images/
```

### Environment Variables

```env
# mobile/.env
EXPO_PUBLIC_API_URL=http://localhost:8000/api/v1
```

### Testing trên Device

#### Option 1: Expo Go (Khuyến nghị cho dev)

```bash
# 1. Install Expo Go app trên điện thoại
# iOS: App Store
# Android: Google Play Store

# 2. Start dev server
pnpm run dev:mobile

# 3. Scan QR code bằng Expo Go
```

#### Option 2: Development Build

```bash
cd mobile

# Build cho Android
eas build --profile development --platform android

# Build cho iOS (cần Mac)
eas build --profile development --platform ios
```

#### Option 3: Android Emulator / iOS Simulator

```bash
# Android Emulator
pnpm --filter mobile run android

# iOS Simulator (chỉ trên Mac)
pnpm --filter mobile run ios
```

### Common Tasks

#### Tạo Screen mới

```bash
# Trong mobile/app/
touch app/profile.tsx
```

#### Thêm React Native Package

```bash
# Thêm navigation component
pnpm add @react-navigation/native --filter mobile

# Expo packages
pnpm add expo-camera --filter mobile
```

#### API Integration

```typescript
// mobile/services/api.ts
import axios from 'axios';
import Constants from 'expo-constants';
import type { IAlert } from '@smart-forecast/shared';

const api = axios.create({
  baseURL: Constants.expoConfig?.extra?.apiUrl || 'http://localhost:8000/api/v1',
});

export const getAlerts = async (): Promise<IAlert[]> => {
  const { data } = await api.get('/alerts');
  return data;
};
```

---

## 📦 Shared Package

### Mục đích

Package `shared` chứa:

- ✅ TypeScript types/interfaces dùng chung
- ✅ Constants và enums
- ✅ Utility types

### Build Shared Package

```bash
# Build (BẮT BUỘC trước khi chạy backend/web/mobile)
pnpm run build:shared

# Watch mode (tự động rebuild khi có thay đổi)
pnpm run dev:shared
```

### Cấu trúc

```
shared/src/
├── index.ts                 # Main export
├── types/
│   ├── user.types.ts       # User types
│   ├── alert.types.ts      # Alert types
│   ├── incident.types.ts   # Incident types
│   ├── weather.types.ts    # Weather types
│   └── api.types.ts        # API response types
└── constants/
    ├── roles.ts            # User roles
    ├── status.ts           # Status constants
    └── labels.ts           # Label mappings
```

### Sử dụng Shared Types

```typescript
// Trong backend/src/modules/user/user.service.ts
import { UserRole, IUser } from '@smart-forecast/shared';

// Trong web/src/services/api.ts
import type { IAlert, IIncident } from '@smart-forecast/shared';

// Trong mobile/services/api.ts
import type { IUser, UserRole } from '@smart-forecast/shared';
```

### Thêm Type mới

```typescript
// shared/src/types/my-feature.types.ts
export interface IMyFeature {
  id: string;
  name: string;
  createdAt: Date;
}

// shared/src/index.ts
export * from './types/my-feature.types';
```

Sau đó rebuild:

```bash
pnpm run build:shared
```

---

## 🧪 Testing

### Run All Tests

```bash
# Run tests cho tất cả packages
pnpm run test

# Run với watch mode
pnpm -r run test:watch
```

### Backend Tests

```bash
# Unit tests
pnpm run test:backend

# E2E tests
pnpm run test:e2e

# Coverage
pnpm run test:cov

# Watch mode
pnpm --filter backend run test:watch
```

### Web Tests

```bash
# Component tests
pnpm run test:web

# Watch mode
pnpm --filter web run test:watch
```

### Writing Tests

#### Backend (Jest)

```typescript
// backend/src/modules/user/user.service.spec.ts
import { Test } from '@nestjs/testing';
import { UserService } from './user.service';

describe('UserService', () => {
  let service: UserService;

  beforeEach(async () => {
    const module = await Test.createTestingModule({
      providers: [UserService],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should create a user', async () => {
    const result = await service.create({ email: 'test@test.com' });
    expect(result).toBeDefined();
  });
});
```

---

## 🔄 Common Tasks

### 1. Start toàn bộ stack

```bash
# Terminal 1: Docker services
make up

# Terminal 2: Backend
pnpm run dev:backend

# Terminal 3: Web
pnpm run dev:web

# Terminal 4: Mobile (optional)
pnpm run dev:mobile
```

### 2. Thêm dependency mới

```bash
# Backend
pnpm add lodash --filter backend
pnpm add -D @types/lodash --filter backend

# Web
pnpm add react-query --filter web

# Mobile
pnpm add expo-camera --filter mobile

# Shared (tránh thêm dependencies!)
# Shared chỉ nên chứa types, không runtime code
```

### 3. Update dependencies

```bash
# Check outdated packages
pnpm outdated

# Update all packages
pnpm update --recursive --latest

# Update specific package
pnpm update axios --filter backend
```

### 4. Clean & Rebuild

```bash
# Clean tất cả
pnpm run clean

# Reinstall dependencies
pnpm install

# Rebuild shared
pnpm run build:shared

# Rebuild tất cả
pnpm run build:all
```

### 5. Code Formatting

```bash
# Format tất cả code
pnpm run format

# Check formatting
pnpm run format:check

# Lint và fix
pnpm run lint:fix
```

### 6. Git Workflow

```bash
# Tạo branch mới
git checkout -b feature/my-feature

# Commit theo Conventional Commits
git add .
git commit -m "feat(backend): add new endpoint"

# Push và tạo PR
git push origin feature/my-feature
```

---

## ✅ Best Practices

### 1. **Luôn build shared trước**

```bash
# Trước khi start development
pnpm run build:shared

# Hoặc chạy watch mode trong terminal riêng
pnpm run dev:shared
```

### 2. **Sử dụng Shared Types**

```typescript
// ✅ Good
import { IUser, UserRole } from '@smart-forecast/shared';

// ❌ Bad - duplicate types
interface IUser {
  /* ... */
}
```

### 3. **Environment Variables**

```bash
# ✅ Good - dùng .env
DATABASE_URL=postgres://...

# ❌ Bad - hardcode
const dbUrl = 'postgres://localhost:5432/mydb';
```

### 4. **Git Commits**

```bash
# ✅ Good - descriptive
feat(auth): add JWT authentication
fix(api): resolve CORS issue
docs: update README

# ❌ Bad - vague
update code
fix bug
wip
```

### 5. **Code Organization**

```typescript
// ✅ Good - organized imports
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { IUser, UserRole } from '@smart-forecast/shared';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';

// ❌ Bad - messy imports
import { User } from './entities/user.entity';
import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
```

### 6. **Error Handling**

```typescript
// ✅ Good - specific errors
try {
  await this.userService.create(dto);
} catch (error) {
  if (error instanceof ConflictException) {
    throw new ConflictException('Email already exists');
  }
  throw new InternalServerErrorException('Failed to create user');
}

// ❌ Bad - generic
try {
  await this.userService.create(dto);
} catch (error) {
  console.log(error);
}
```

### 7. **Testing**

```typescript
// ✅ Good - clear test names
it('should create a user with valid email', async () => {
  // ...
});

it('should throw error when email is invalid', async () => {
  // ...
});

// ❌ Bad - unclear
it('test 1', async () => {
  // ...
});
```

---

## 🆘 Troubleshooting

### Backend không start được

```bash
# Check dependencies
pnpm install

# Check shared package
pnpm run build:shared

# Check Docker services
make health

# Xem logs
make logs-postgres
```

### Web build lỗi

```bash
# Clear Next.js cache
rm -rf web/.next

# Rebuild
pnpm run build:web
```

### Mobile không kết nối được API

```bash
# Check API URL trong .env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:8000/api/v1

# Không dùng localhost trên mobile, dùng IP thực
```

### Shared types không cập nhật

```bash
# Rebuild shared
pnpm run build:shared

# Restart dev servers
# Backend, web, mobile cần restart để nhận types mới
```

### PNPM store issues

```bash
# Clear PNPM cache
pnpm store prune

# Reinstall
rm -rf node_modules
pnpm install
```

---

## 📚 Resources

### Documentation

- [NestJS Docs](https://docs.nestjs.com/)
- [Next.js Docs](https://nextjs.org/docs)
- [Expo Docs](https://docs.expo.dev/)
- [PNPM Docs](https://pnpm.io/)

### Style Guides

- [TypeScript Style Guide](https://google.github.io/styleguide/tsguide.html)
- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Flow](https://www.atlassian.com/git/tutorials/comparing-workflows/gitflow-workflow)

### Tools

- [VS Code](https://code.visualstudio.com/)
- [Postman](https://www.postman.com/) - API testing
- [Docker Desktop](https://www.docker.com/products/docker-desktop)

---

## 🎯 Quick Reference

| Task                 | Command                 |
| -------------------- | ----------------------- |
| Install dependencies | `pnpm install`          |
| Build shared         | `pnpm run build:shared` |
| Start backend        | `pnpm run dev:backend`  |
| Start web            | `pnpm run dev:web`      |
| Start mobile         | `pnpm run dev:mobile`   |
| Run all tests        | `pnpm run test`         |
| Lint all code        | `pnpm run lint`         |
| Format all code      | `pnpm run format`       |
| Build all            | `pnpm run build:all`    |
| Docker up            | `make up`               |
| Docker down          | `make down`             |

---

## 🤝 Contributing

Đọc thêm:

- [CONTRIBUTING.md](../.team/CONTRIBUTING.md) - Git workflow chi tiết
- [AUTOMATION_GUIDE.md](AUTOMATION_GUIDE.md) - Makefile và scripts

---

**Happy Coding! 🚀**

_Nếu có thắc mắc, tạo issue hoặc hỏi trong team chat._
