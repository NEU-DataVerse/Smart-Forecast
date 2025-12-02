---
sidebar_position: 2
title: Bắt đầu nhanh
---

# 🚀 Bắt đầu nhanh

Hướng dẫn cài đặt và chạy Smart Forecast trong vài phút.

---

## ✅ Yêu cầu hệ thống

### Phần mềm cần thiết

| Phần mềm           | Phiên bản | Ghi chú                                        |
| ------------------ | --------- | ---------------------------------------------- |
| **Docker**         | >= 20.10  | [Download](https://www.docker.com/get-started) |
| **Docker Compose** | >= 2.0    | Đi kèm Docker Desktop                          |
| **Node.js**        | >= 18.x   | [Download](https://nodejs.org/)                |
| **pnpm**           | >= 8.x    | Package manager cho monorepo                   |
| **Git**            | Latest    | [Download](https://git-scm.com/)               |

### Kiểm tra phiên bản

```bash
docker --version
docker compose version
node --version
pnpm --version
git --version
```

### Cài đặt pnpm

```bash
# Sử dụng npm
npm install -g pnpm

# Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -
```

---

## 📥 Cài đặt

### 1️⃣ Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 2️⃣ Cài đặt dependencies

```bash
# Cài đặt tất cả packages trong monorepo
pnpm install

# Build shared package (BẮT BUỘC!)
pnpm run build:shared
```

### 3️⃣ Cấu hình môi trường

```bash
# Tự động copy tất cả file .env.example (khuyến nghị)
bash scripts/setup.sh     # Linux/Mac/Git Bash
scripts\setup.bat         # Windows

# Hoặc thủ công
cp .env.example .env
cp backend/.env.example backend/.env
cp web/.env.local.example web/.env.local
cp mobile/.env.example mobile/.env
```

### 4️⃣ Cấu hình API Keys

Chỉnh sửa `backend/.env`:

```bash
# OpenWeatherMap API Key (bắt buộc)
# Đăng ký miễn phí tại: https://openweathermap.org/api
OPENWEATHERMAP_API_KEY=your_api_key_here

# JWT Secret (thay đổi trong production)
JWT_SECRET=your_secure_secret_key
```

---

## 🐳 Khởi động với Docker

### Quick Start (1 lệnh)

```bash
docker compose up -d
```

### Kiểm tra trạng thái

```bash
# Xem trạng thái containers
docker compose ps

# Xem logs
docker compose logs -f
```

### Truy cập các dịch vụ

| Dịch vụ           | URL                       | Mô tả              |
| ----------------- | ------------------------- | ------------------ |
| **Backend API**   | http://localhost:8000/api | REST API & Swagger |
| **Orion-LD**      | http://localhost:1026     | Context Broker     |
| **MinIO Console** | http://localhost:9001     | Object Storage UI  |
| **PostgreSQL**    | localhost:5432            | Database           |

### Credentials mặc định

| Dịch vụ        | Username   | Password   |
| -------------- | ---------- | ---------- |
| **MinIO**      | minioadmin | minioadmin |
| **PostgreSQL** | admin      | admin      |
| **MongoDB**    | admin      | admin      |

---

## 💻 Development Mode

### Chạy Backend

```bash
# Terminal 1: Backend NestJS
pnpm run dev:backend

# API sẽ chạy tại: http://localhost:8000
```

### Chạy Web Dashboard

```bash
# Terminal 2: Web Next.js
pnpm run dev:web

# Web sẽ chạy tại: http://localhost:3000
```

### Chạy Mobile App

```bash
# Terminal 3: Mobile Expo
pnpm run dev:mobile

# Expo DevTools sẽ mở tại: http://localhost:8081
```

:::caution Lưu ý cho Mobile
Không sử dụng `localhost` trong `mobile/.env`. Thay bằng IP máy của bạn:

```bash
# Tìm IP: ipconfig (Windows) hoặc ifconfig (Mac/Linux)
EXPO_PUBLIC_BACKEND_API_URL=http://192.168.1.100:8000/api/v1
```

:::

---

## 🧪 Kiểm tra hệ thống

### Health Check

```bash
# Orion-LD
curl http://localhost:1026/version

# Backend API
curl http://localhost:8000/api/v1

# MinIO
curl http://localhost:9000/minio/health/live
```

### Kết nối Database

```bash
# PostgreSQL
docker exec -it postgres psql -U admin -d smart_forecast_db

# MongoDB
docker exec -it mongodb mongosh
```

---

## 🛑 Dừng dịch vụ

```bash
# Dừng tất cả (giữ data)
docker compose down

# Dừng và xóa data
docker compose down -v

# Dừng và xóa images
docker compose down --rmi all
```

---

## ❓ Gặp vấn đề?

Xem [Troubleshooting](./troubleshooting) để giải quyết các lỗi thường gặp.

---

## 📖 Tiếp theo

- [Kiến trúc hệ thống](./architecture) - Hiểu về cách hệ thống hoạt động
- [Hướng dẫn phát triển](./dev-guide) - Cho developers
- [API Documentation](./api) - Khám phá các endpoints
