# Cấu Trúc Dự Án Smart-Forecast

## Tổng Quan

Smart-Forecast là một dự án full-stack bao gồm backend API, web frontend, mobile app và thư viện shared components.

## Cấu Trúc Thư Mục

```
Smart-Forecast/
├── .github/              # GitHub Actions & CI/CD
│   └── workflows/        # CI/CD workflows
├── backend/              # Backend API (NestJS)
├── web/                  # Web Frontend (Next.js)
├── mobile/               # Mobile App (React Native/Expo)
├── shared/               # Shared Types & Constants (Monorepo)
├── scripts/              # Utility Scripts
├── docs/                 # Documentation
└── Root Files            # Configuration Files
```

## Chi Tiết Các Thư Mục

### 📁 `backend/` - Backend API

Backend được xây dựng bằng **NestJS** framework.

**Cấu trúc:**

```
backend/
├── src/
│   ├── main.ts                  # Entry point
│   ├── app.module.ts            # Root module
│   ├── app.controller.ts        # Root controller
│   ├── app.service.ts           # Root service
│   ├── auth/                    # Authentication module
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/                 # Data Transfer Objects
│   │   ├── interfaces/          # TypeScript interfaces
│   │   └── strategies/          # Auth strategies (JWT, etc.)
│   ├── user/                    # User management module
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── dto/
│   │   └── entities/            # Database entities
│   ├── incident/                # Incident management module
│   │   └── incident.module.ts
│   ├── airquality/              # Air quality module
│   │   └── airquality.module.ts
│   ├── config/                  # Configuration files
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   └── index.ts
│   └── common/                  # Common utilities
│       ├── decorators/          # Custom decorators
│       ├── guards/              # Route guards
│       └── interceptors/        # HTTP interceptors
├── test/                        # E2E tests
├── docs/                        # Backend documentation
├── Dockerfile                   # Docker configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

**Công nghệ:**

- NestJS
- TypeScript
- JWT Authentication
- RESTful API

---

### 📁 `web/` - Web Frontend

Web frontend được xây dựng bằng **Next.js**.

**Cấu trúc:**

```
web/
├── src/
│   ├── app/                     # Next.js App Router
│   │   └── ...                  # Pages & layouts
│   ├── hooks/                   # Custom React hooks
│   ├── services/                # API services
│   └── utils/                   # Utility functions
├── public/                      # Static assets
├── next.config.ts               # Next.js configuration
├── package.json                 # Dependencies
└── tsconfig.json                # TypeScript config
```

**Công nghệ:**

- Next.js
- React
- TypeScript
- Tailwind CSS (PostCSS)

---

### 📁 `mobile/` - Mobile Application

Mobile app được xây dựng bằng **React Native** với **Expo**.

**Cấu trúc:**

```
mobile/
├── app/                         # App screens
│   ├── _layout.tsx              # Root layout
│   ├── modal.tsx                # Modal screen
│   └── (tabs)/                  # Tab navigation
│       ├── _layout.tsx
│       ├── index.tsx            # Home tab
│       └── explore.tsx          # Explore tab
├── components/                  # Reusable components
│   ├── ui/                      # UI components
│   │   ├── collapsible.tsx
│   │   ├── icon-symbol.tsx
│   │   └── ...
│   ├── external-link.tsx
│   ├── haptic-tab.tsx
│   ├── hello-wave.tsx
│   ├── parallax-scroll-view.tsx
│   ├── themed-text.tsx
│   └── themed-view.tsx
├── constants/                   # App constants
│   └── theme.ts
├── hooks/                       # Custom hooks
│   ├── use-color-scheme.ts
│   └── use-theme-color.ts
├── assets/                      # Images & media
├── scripts/                     # Utility scripts
├── app.json                     # Expo configuration
└── package.json                 # Dependencies
```

**Công nghệ:**

- React Native
- Expo
- TypeScript
- Tab Navigation

---

### 📁 `shared/` - Shared Library

Thư viện chung chứa types và constants được sử dụng bởi cả backend, web và mobile.

**Cấu trúc:**

```
shared/
├── src/
│   ├── index.ts                 # Main export
│   ├── types/                   # TypeScript type definitions
│   │   ├── index.ts
│   │   ├── airquality.types.ts
│   │   ├── alert.types.ts
│   │   ├── api.types.ts
│   │   ├── auth.types.ts
│   │   ├── geojson.types.ts
│   │   ├── incident.types.ts
│   │   ├── user.types.ts
│   │   └── weather.types.ts
│   └── constants/               # Shared constants
│       ├── index.ts
│       ├── alert.ts
│       ├── incident.ts
│       ├── roles.ts
│       └── status.ts
├── package.json                 # Package configuration
└── tsconfig.json                # TypeScript config
```

**Mục đích:**

- Đảm bảo tính nhất quán của types giữa các phần của dự án
- Tránh code duplication
- Centralized constants management

**Chiến lược Monorepo:**

Shared library được sử dụng trực tiếp trong monorepo (KHÔNG publish lên npm) vì:

- ✅ **Phát triển nhanh hơn** - Không cần publish/update package
- ✅ **Type safety real-time** - TypeScript types sync ngay lập tức
- ✅ **Dễ debug** - Có thể trace code trực tiếp
- ✅ **Đơn giản hóa workflow** - Phù hợp với monorepo structure

**Cách sử dụng:**

```typescript
// backend/src/auth/auth.service.ts
import { UserRole, AuthResponse } from '@smart-forecast/shared';

// web/src/services/api.ts
import { ApiResponse, IncidentType } from '@smart-forecast/shared';

// mobile/app/types.ts
import { WeatherData } from '@smart-forecast/shared';
```

---

### 📁 `scripts/` - Utility Scripts

Scripts hỗ trợ cho development và deployment.

**Nội dung:**

```
scripts/
├── setup.sh                     # Setup script cho Unix/Linux
├── setup.bat                    # Setup script cho Windows
├── health-check.sh              # Health check script
└── README.md                    # Scripts documentation
```

---

### 📁 `docs/` - Documentation

Tài liệu kỹ thuật của dự án.

**Nội dung:**

```
docs/
├── CI-CD-GUIDE.md               # CI/CD setup guide
├── DOCKER_COMPOSE_GUIDE.md      # Docker Compose guide
└── TROUBLESHOOTING.md           # Troubleshooting guide
```

---

### 📁 `.github/` - GitHub Configuration

GitHub Actions workflows và CI/CD configuration.

**Nội dung:**

```
.github/
└── workflows/
    ├── ci-simple.yml            # CI pipeline đơn giản
    ├── ci-smart.yml             # CI với change detection (Recommended)
    ├── ci.yml                   # CI đầy đủ với artifacts
    ├── README.md                # Hướng dẫn chi tiết
    └── SETUP.md                 # Quick start guide
```

**CI/CD Workflows:**

#### 1. CI Simple (`ci-simple.yml`)

- Build tất cả modules mỗi lần
- Phù hợp cho team nhỏ, mới bắt đầu
- Thời gian: ~6-8 phút

#### 2. CI Smart (`ci-smart.yml`) ⭐ Recommended

- **Change detection** - Chỉ build module có thay đổi
- Tiết kiệm 40-60% thời gian
- Thời gian: ~2-8 phút (tùy module)
- Phù hợp cho production

#### 3. CI Full (`ci.yml`)

- Upload build artifacts
- Advanced features
- Phù hợp cho complex pipelines

**Workflow Process:**

```
Pull Request
     ↓
Detect Changes
     ↓
Install Dependencies (Cached)
     ↓
Build Shared Library
     ↓
┌────┼────┬────┐
↓    ↓    ↓    ↓
Backend Web Mobile
(Lint, Test, Build in parallel)
     ↓
CI Success ✅
```

**Xem thêm:** `.github/workflows/README.md` và `.github/workflows/SETUP.md`

---

## Root Files

### Configuration Files

- **`docker-compose.yml`** - Docker Compose configuration
- **`Makefile`** - Make commands for common tasks
- **`package.json`** - Root package.json cho monorepo

### Documentation Files

- **`README.md`** - Main project documentation
- **`QUICKSTART.md`** - Quick start guide
- **`CHEATSHEET.md`** - Command cheatsheet
- **`CI-CD-QUICKREF.md`** - CI/CD quick reference
- **`CHANGELOG_DOCKER.md`** - Docker changelog
- **`LICENSE`** - Project license

---

## Workflow Phát Triển

### 1. Development Environment Setup

```bash
# Clone repository
git clone <repository-url>

# Run setup script
./scripts/setup.sh        # Unix/Linux
scripts\setup.bat         # Windows

# Start with Docker Compose
docker-compose up
```

### 2. Development Commands

#### Backend

```bash
cd backend
npm install
npm run start:dev         # Development mode
npm run test              # Run tests
```

#### Web

```bash
cd web
npm install
npm run dev               # Development server
npm run build             # Production build
```

#### Mobile

```bash
cd mobile
npm install
npm start                 # Start Expo
npm run ios               # iOS simulator
npm run android           # Android emulator
```

#### Shared

```bash
cd shared
npm install
npm run build             # Build shared library
```

---

## Kiến Trúc Hệ Thống

### Stack Công Nghệ

- **Backend:** NestJS + TypeScript + PostgreSQL/MongoDB
- **Web:** Next.js + React + TypeScript
- **Mobile:** React Native + Expo + TypeScript
- **Shared:** TypeScript
- **DevOps:** Docker + Docker Compose + CI/CD

### Module Architecture

```
┌─────────────┐     ┌─────────────┐
│   Mobile    │     │     Web     │
│  (Expo)     │     │  (Next.js)  │
└──────┬──────┘     └──────┬──────┘
       │                   │
       └────────┬──────────┘
                │
         ┌──────▼──────┐
         │   Shared    │
         │   Library   │
         └──────┬──────┘
                │
         ┌──────▼──────┐
         │   Backend   │
         │  (NestJS)   │
         └──────┬──────┘
                │
         ┌──────▼──────┐
         │  Database   │
         └─────────────┘
```

---

## Modules Chính

### Authentication (`auth/`)

- User login/logout
- JWT token management
- Authentication strategies
- Role-based access control

### User Management (`user/`)

- User CRUD operations
- User profiles
- User roles & permissions

### Incident Management (`incident/`)

- Incident reporting
- Incident tracking
- Incident analytics

### Air Quality (`airquality/`)

- Air quality data collection
- Air quality monitoring
- Air quality alerts

---

## Testing

### Backend Tests

```bash
cd backend
npm run test              # Unit tests
npm run test:e2e          # E2E tests
npm run test:cov          # Coverage report
```

### Web Tests

```bash
cd web
npm run test              # Component tests
```

---

## Deployment

### Docker

```bash
# Build all services
docker-compose build

# Start all services
docker-compose up -d

# View logs
docker-compose logs -f

# Stop all services
docker-compose down
```

### Production Build

```bash
# Backend
cd backend
npm run build

# Web
cd web
npm run build

# Mobile
cd mobile
npm run build
```

---

## Best Practices

1. **Code Organization:** Sử dụng module-based structure
2. **Type Safety:** Sử dụng TypeScript và shared types
3. **Testing:** Viết tests cho critical features
4. **Documentation:** Cập nhật docs khi thay đổi architecture
5. **Version Control:** Follow Git workflow và conventional commits
6. **CI/CD:** Sử dụng automated testing và deployment

---

## Contributing

1. Tạo feature branch từ `main`
2. Implement changes
3. Write/update tests
4. Update documentation
5. Create pull request
6. Wait for review và merge

---

## Liên Hệ & Support

- **Repository:** [GitHub Repository]
- **Documentation:** Xem thư mục `docs/`
- **Issues:** GitHub Issues

---

_Last Updated: November 13, 2025_
