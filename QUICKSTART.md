# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy Smart-Forecast trong 3 phút!

## ✅ Prerequisites

Đảm bảo bạn đã cài đặt:

- **Docker Desktop** (Windows/Mac) hoặc Docker Engine (Linux)
- **Git**
- **Node.js** >= 20.x (cho development)
- **pnpm** >= 8.x (package manager)

### Cài đặt pnpm nhanh:

```bash
# Cách 1: Sử dụng npm
npm install -g pnpm

# Cách 2: Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# Cách 3: macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Kiểm tra cài đặt
pnpm --version
```

## 📝 Các bước thực hiện

### 1. Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 1.5. Cài đặt dependencies

```bash
# Cài đặt tất cả packages trong monorepo
pnpm install

# Build shared package (bắt buộc)
pnpm run build:shared
```

### 2. Tạo các file cấu hình environment

Hệ thống sử dụng 4 file .env riêng biệt:

```bash
# Tự động (khuyến nghị)
bash scripts/setup.sh     # Linux/Mac/Git Bash
scripts\setup.bat         # Windows

# Hoặc thủ công
cp docker/.env.infrastructure.example docker/.env.infrastructure
cp backend/.env.example backend/.env
cp web/.env.local.example web/.env.local
cp mobile/.env.example mobile/.env
```

**Quan trọng:** Chỉnh sửa `backend/.env` để thêm API key:

```bash
OPENWEATHER_API_KEY=your_api_key_here
```

(Đăng ký miễn phí tại: https://openweathermap.org/api)

### 3. Khởi động Docker Compose

```bash
docker-compose up -d
```

### 4. Đợi các services khởi động (khoảng 1-2 phút)

Kiểm tra trạng thái:

```bash
docker-compose ps
```

Tất cả services nên có status `Up` và health `healthy`.

### 5. Kiểm tra các services

#### FIWARE Orion Context Broker

```bash
curl http://localhost:1026/version
```

Kết quả mong đợi:

```json
{
  "orion": {
    "version": "...",
    "uptime": "...",
    ...
  }
}
```

#### MinIO Object Storage Console

Mở browser: http://localhost:9001

- Username: `minioadmin`
- Password: `minioadmin`

#### PostgreSQL Database

```bash
docker exec -it postgres psql -U admin -d smart_forecast_db -c "\dt"
```

## 🎉 Hoàn tất!

Bây giờ bạn có:

- ✅ PNPM monorepo với tất cả dependencies
- ✅ Shared package đã được build
- ✅ FIWARE Orion-LD Context Broker (port 1026)
- ✅ MongoDB cho Orion (port 27017)
- ✅ PostgreSQL Database (port 5432)
- ✅ MinIO Object Storage (port 9000, console 9001)

## 📋 Các lệnh thường dùng

### Docker Commands

```bash
# Xem logs tất cả services
docker-compose logs

# Xem logs của một service
docker-compose logs -f orion

# Restart một service
docker-compose restart orion

# Dừng tất cả
docker-compose down

# Dừng và xóa data
docker-compose down -v

# Rebuild và restart
docker-compose up -d --build
```

### PNPM Workspace Commands

```bash
# Cài đặt dependencies cho tất cả packages
pnpm install

# Build shared package
pnpm run build:shared

# Chạy lệnh cho package cụ thể
pnpm --filter backend run start:dev
pnpm --filter web run dev
pnpm --filter mobile run start

# Thêm package vào workspace
pnpm add axios --filter backend
pnpm add react-query --filter web

# Chạy lệnh cho tất cả packages
pnpm -r run lint
pnpm -r run test
```

## 🔧 Tiếp theo

1. **Khám phá PNPM Workspace**:
   - Xem `.team/QUICK_REFERENCE.md` cho hướng dẫn chi tiết
   - Đọc về [PNPM Workspaces](https://pnpm.io/workspaces)

2. **Khám phá FIWARE Orion**:
   - Xem [FIWARE Tutorial](https://fiware-tutorials.readthedocs.io/)

3. **Phát triển Backend**:
   - `pnpm --filter backend run start:dev`

4. **Phát triển Frontend**:
   - Web: `pnpm --filter web run dev`
   - Mobile: `pnpm --filter mobile run start`

## ❓ Gặp vấn đề?

Xem [Troubleshooting](README.md#troubleshooting) trong README.md

## 🛠️ Development Mode

### Chạy Backend (NestJS)

```bash
pnpm --filter backend run start:dev
```

### Chạy Web Frontend (Next.js)

```bash
pnpm --filter web run dev
```

### Chạy Mobile App (Expo)

```bash
pnpm --filter mobile run start
```

---

**Happy Coding! 🎨**
