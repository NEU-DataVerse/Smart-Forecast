# 🚀 Quick Start Guide

Hướng dẫn nhanh để chạy Smart-Forecast trong 3 phút!

## ✅ Prerequisites

Đảm bảo bạn đã cài đặt:

- Docker Desktop (Windows/Mac) hoặc Docker Engine (Linux)
- Git

## 📝 Các bước thực hiện

### 1. Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 2. Tạo file cấu hình

```bash
# Windows (Git Bash)
cp .env.example .env

# Windows (PowerShell)
copy .env.example .env

# Linux/Mac
cp .env.example .env
```

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

- ✅ FIWARE Orion-LD Context Broker (port 1026)
- ✅ MongoDB cho Orion (port 27017)
- ✅ PostgreSQL Database (port 5432)
- ✅ MinIO Object Storage (port 9000, console 9001)

## 📋 Các lệnh thường dùng

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

## 🔧 Tiếp theo

1. **Khám phá FIWARE Orion**: Xem [FIWARE Tutorial](https://fiware-tutorials.readthedocs.io/)
2. **Phát triển Backend**: Uncomment backend service trong `docker-compose.yml`
3. **Phát triển Frontend**: Chạy web/mobile app từ thư mục tương ứng

## ❓ Gặp vấn đề?

Xem [Troubleshooting](README.md#troubleshooting) trong README.md

## 🛠️ Development Mode

### Chạy Backend (NestJS)

```bash
cd backend
npm install
npm run start:dev
```

### Chạy Web Frontend (Next.js)

```bash
cd web
npm install
npm run dev
```

### Chạy Mobile App (Expo)

```bash
cd mobile
npm install
npx expo start
```

---

**Happy Coding! 🎨**
