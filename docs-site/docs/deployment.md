---
sidebar_position: 4
title: Triển khai
---

# Triển khai

Hướng dẫn triển khai Smart Forecast với Docker Compose.

---

## Yêu cầu hệ thống

| Thành phần     | Phiên bản |
| -------------- | --------- |
| Docker         | ≥ 20.10   |
| Docker Compose | ≥ 2.0     |
| RAM            | ≥ 4GB     |
| Disk           | ≥ 10GB    |

---

## Cấu trúc Docker Services

```
┌─────────────────────────────────────────────────────────────────┐
│                      Docker Compose                              │
├─────────────┬─────────────┬─────────────┬───────────────────────┤
│   Backend   │     Web     │    MinIO    │       Orion-LD        │
│   :8000     │   :8001     │ :8002/:8003 │    (internal)         │
├─────────────┴─────────────┴─────────────┴───────────────────────┤
│   PostgreSQL (internal)  │  MongoDB (internal)                   │
├─────────────────────────────────────────────────────────────────┤
│                  smart-forecast-net (network)                    │
└─────────────────────────────────────────────────────────────────┘
```

### Services

| Service    | Image                         | Port External      | Port Internal | Mô tả                  |
| ---------- | ----------------------------- | ------------------ | ------------- | ---------------------- |
| `backend`  | smartforecast-backend         | **8000**           | 8000          | NestJS API Server      |
| `web`      | smartforecast-web             | **8001**           | 3000          | Next.js Web Dashboard  |
| `minio`    | minio/minio:latest            | **8002**, **8003** | 9000, 9001    | Object Storage         |
| `orion`    | fiware/orion-ld:latest        | -                  | 1026          | NGSI-LD Context Broker |
| `mongodb`  | mongo:4.4                     | -                  | 27017         | Database cho Orion-LD  |
| `postgres` | postgis/postgis:14-3.4-alpine | -                  | 5432          | Database chính         |

:::info Port Range
Project được cấu hình sử dụng port **8000-8010** để phù hợp với các server có giới hạn port.
:::

---

## Quick Start

### 1. Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 2. Cấu hình môi trường

```bash
cp .env.example .env
```

Chỉnh sửa file `.env`:

```bash
# ===== BẮT BUỘC thay đổi cho production =====
POSTGRES_PASSWORD=your_secure_password
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
MINIO_ROOT_PASSWORD=your_secure_password
JWT_SECRET=your_very_long_random_secret_key_at_least_32_chars

# ===== API Keys =====
OPENWEATHERMAP_API_KEY=your_actual_api_key

# ===== Server URLs (thay YOUR_SERVER_IP) =====
CORS_ORIGINS=http://YOUR_SERVER_IP:8001
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:8000/api/v1
NEXT_PUBLIC_MINIO_URL=http://YOUR_SERVER_IP:8002
```

### 3. Build và khởi động

```bash
# Build và start tất cả services
docker compose up -d --build
```

### 4. Tạo database tables (lần đầu)

```bash
# Chạy với DB_SYNC=true để tạo tables
DB_SYNC=true docker compose up -d backend

# Đợi backend healthy (~30s)
docker compose ps
```

### 5. Seed dữ liệu mẫu

```bash
docker compose exec backend node dist/database/seeds/seed.js
```

### 6. Kiểm tra

```bash
# Xem status
docker compose ps

# Tất cả services phải hiển thị "healthy"
```

### 7. Truy cập

| Service       | URL                               |
| ------------- | --------------------------------- |
| Web Dashboard | http://YOUR_SERVER_IP:8001        |
| Backend API   | http://YOUR_SERVER_IP:8000/api/v1 |
| Swagger Docs  | http://YOUR_SERVER_IP:8000/api    |
| MinIO Console | http://YOUR_SERVER_IP:8003        |

---

## Cấu hình chi tiết

### Biến môi trường

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

#### Database

```bash
# PostgreSQL
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=smart_forecast_db

# MongoDB (cho Orion-LD)
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=your_secure_password
```

#### Storage

```bash
# MinIO Object Storage
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_secure_password
MINIO_BUCKET_NAME=incidents
```

#### Backend

```bash
# JWT Authentication
JWT_SECRET=your_very_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=7d

# CORS - origins được phép truy cập API (comma-separated)
CORS_ORIGINS=http://192.168.1.100:8001,https://your-domain.com

# Database sync - chỉ bật lần đầu để tạo tables
DB_SYNC=false

# External APIs
OPENWEATHERMAP_API_KEY=your_api_key

# Firebase (optional - cho push notifications)
FIREBASE_PROJECT_ID=
FIREBASE_PRIVATE_KEY=
FIREBASE_CLIENT_EMAIL=

# Google OAuth (optional - cho mobile login)
GOOGLE_CLIENT_ID=
```

#### Frontend

```bash
# API URL mà browser sẽ gọi
NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:8000/api/v1

# MinIO URL để load ảnh
NEXT_PUBLIC_MINIO_URL=http://YOUR_SERVER_IP:8002
```

---

## Các lệnh Docker Compose

### Quản lý services

```bash
# Khởi động tất cả
docker compose up -d

# Khởi động với rebuild
docker compose up -d --build

# Dừng tất cả
docker compose down

# Restart service cụ thể
docker compose restart backend

# Rebuild service cụ thể
docker compose up -d --build backend
```

### Xem logs

```bash
# Tất cả services
docker compose logs -f

# Service cụ thể
docker compose logs -f backend
docker compose logs -f web

# Chỉ 50 dòng cuối
docker compose logs --tail 50 backend
```

### Kiểm tra status

```bash
# Status tất cả containers
docker compose ps

# Chi tiết resource usage
docker stats
```

### Truy cập container

```bash
# Vào shell của backend
docker compose exec backend sh

# Chạy command trong container
docker compose exec backend node dist/database/seeds/seed.js
```

---

## Database Management

### Tạo tables (lần đầu)

```bash
# Bật DB_SYNC để TypeORM tự động tạo tables
DB_SYNC=true docker compose up -d backend

# Đợi ~30s rồi tắt DB_SYNC
docker compose up -d backend
```

### Seed dữ liệu

```bash
# Seed nếu database rỗng
docker compose exec backend node dist/database/seeds/seed.js

# Force reseed (xóa và seed lại)
docker compose exec backend node dist/database/seeds/seed.js force

# Seed base data (không có fake weather/air-quality)
docker compose exec backend node dist/database/seeds/seed.js --skip-env

# Xóa tất cả dữ liệu
docker compose exec backend node dist/database/seeds/seed.js clear
```

#### Dữ liệu được seed

| Bảng                   | Mô tả                        | Số lượng      |
| ---------------------- | ---------------------------- | ------------- |
| `users`                | Tài khoản người dùng         | 3             |
| `observation_station`  | Trạm quan trắc               | 4             |
| `weather_observed`     | Dữ liệu thời tiết            | ~256 (7 ngày) |
| `air_quality_observed` | Dữ liệu chất lượng không khí | ~256 (7 ngày) |
| `incidents`            | Báo cáo sự cố                | 11            |
| `alert_thresholds`     | Ngưỡng cảnh báo              | 19            |
| `alerts`               | Cảnh báo môi trường          | 10            |

:::tip Tài khoản mặc định
Sau khi seed, có thể đăng nhập với:

- **Admin**: admin@smartforecast.vn / Admin@123
- **User**: user@smartforecast.vn / User@123
  :::

### Backup

```bash
# Backup PostgreSQL
docker compose exec postgres pg_dump -U admin smart_forecast_db > backup.sql

# Backup tất cả volumes
docker run --rm \
  -v smartforecast_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore

```bash
# Restore PostgreSQL
cat backup.sql | docker compose exec -T postgres psql -U admin smart_forecast_db
```

---

## Production Deployment

### Checklist trước khi deploy

- [ ] Đổi tất cả passwords trong `.env`
- [ ] Cấu hình `JWT_SECRET` với chuỗi random dài
- [ ] Cấu hình `CORS_ORIGINS` với domain/IP server
- [ ] Cấu hình `NEXT_PUBLIC_API_URL` và `NEXT_PUBLIC_MINIO_URL`
- [ ] Có API key OpenWeatherMap hợp lệ
- [ ] Server có đủ RAM (≥4GB) và disk (≥10GB)
- [ ] Ports 8000-8003 được mở trên firewall

### Deploy step-by-step

```bash
# 1. Clone và checkout
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast

# 2. Cấu hình .env
cp .env.example .env
nano .env  # Chỉnh sửa các biến

# 3. Build images
docker compose build

# 4. Start infrastructure trước
docker compose up -d postgres mongodb orion minio

# 5. Đợi healthy
sleep 60
docker compose ps

# 6. Start backend với DB_SYNC
DB_SYNC=true docker compose up -d backend

# 7. Đợi backend healthy và seed data
sleep 30
docker compose exec backend node dist/database/seeds/seed.js

# 8. Restart backend (tắt DB_SYNC)
docker compose up -d backend

# 9. Start web
docker compose up -d web

# 10. Verify
docker compose ps
curl http://localhost:8000/api
```

### Cấu hình Mobile App

Sau khi server chạy, cập nhật `mobile/.env`:

```bash
EXPO_PUBLIC_API_URL=http://YOUR_SERVER_IP:8000/api/v1
EXPO_PUBLIC_MINIO_URL=http://YOUR_SERVER_IP:8002
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

---

## Health Checks

### Kiểm tra thủ công

```bash
# Backend API
curl http://localhost:8000/api

# Web Frontend
curl -I http://localhost:8001

# MinIO
curl http://localhost:8002/minio/health/live

# PostgreSQL
docker compose exec postgres pg_isready -U admin

# Orion-LD (internal)
docker compose exec orion curl http://localhost:1026/version
```

### Kết quả mong đợi

```bash
$ docker compose ps

NAME       STATUS
backend    Up (healthy)
web        Up (healthy)
minio      Up (healthy)
postgres   Up (healthy)
mongodb    Up (healthy)
orion      Up (healthy)
```

---

## Troubleshooting

### Backend unhealthy / Web không start

**Nguyên nhân**: Web depends on backend healthy, nếu backend unhealthy thì web sẽ không start.

```bash
# Kiểm tra logs backend
docker compose logs backend --tail 50

# Thường do thiếu biến môi trường hoặc database connection
```

### "Network error" khi login từ web

**Nguyên nhân**: CORS chưa được cấu hình đúng.

```bash
# Thêm origin vào .env
CORS_ORIGINS=http://YOUR_SERVER_IP:8001

# Rebuild backend
docker compose up -d --build backend
```

### "relation does not exist" khi seed

**Nguyên nhân**: Database tables chưa được tạo.

```bash
# Chạy với DB_SYNC=true
DB_SYNC=true docker compose up -d backend

# Đợi backend restart xong rồi seed
sleep 30
docker compose exec backend node dist/database/seeds/seed.js
```

### Container không start / Port conflict

```bash
# Kiểm tra port đang dùng (Linux/macOS)
lsof -i :8000

# Windows
netstat -ano | findstr :8000

# Stop process hoặc đổi port trong docker-compose.yml
```

### Build quá lâu / Cache issues

```bash
# Build không dùng cache
docker compose build --no-cache backend
docker compose build --no-cache web

# Xóa tất cả và build lại
docker compose down -v
docker system prune -a
docker compose up -d --build
```

### Reset toàn bộ

```bash
# Xóa containers và volumes
docker compose down -v

# Xóa images
docker rmi smartforecast-backend smartforecast-web

# Build và start lại từ đầu
docker compose up -d --build
DB_SYNC=true docker compose up -d backend
docker compose exec backend node dist/database/seeds/seed.js
docker compose up -d
```

---

## Service URLs Summary

| Service       | Local URL                    | Production URL                    |
| ------------- | ---------------------------- | --------------------------------- |
| Web Dashboard | http://localhost:8001        | http://YOUR_SERVER_IP:8001        |
| Backend API   | http://localhost:8000/api/v1 | http://YOUR_SERVER_IP:8000/api/v1 |
| Swagger Docs  | http://localhost:8000/api    | http://YOUR_SERVER_IP:8000/api    |
| MinIO API     | http://localhost:8002        | http://YOUR_SERVER_IP:8002        |
| MinIO Console | http://localhost:8003        | http://YOUR_SERVER_IP:8003        |

---

## Triển khai từ GitHub Release

Ngoài việc build từ source với Docker, bạn có thể triển khai trực tiếp từ các artifacts trong [GitHub Releases](https://github.com/NEU-DataVerse/Smart-Forecast/releases).

### Artifacts có sẵn

| File                   | Mô tả                                         |
| ---------------------- | --------------------------------------------- |
| `backend-dist.zip`     | NestJS backend đã build (dist + dependencies) |
| `web-dist.zip`         | Next.js web app (standalone build)            |
| `smart-forecast-*.apk` | Android APK                                   |

### Triển khai Backend

```bash
# 1. Download và giải nén
wget https://github.com/NEU-DataVerse/Smart-Forecast/releases/latest/download/backend-dist.zip
unzip backend-dist.zip -d backend

# 2. Tạo file .env
cat > backend/.env << 'EOF'
NODE_ENV=production
PORT=8000
DATABASE_URL=postgresql://admin:password@localhost:5432/smart_forecast_db
MONGO_URL=mongodb://admin:password@localhost:27017/orion?authSource=admin
ORION_LD_URL=http://localhost:1026
JWT_SECRET=your_very_secure_jwt_secret_key_change_this_in_production
JWT_EXPIRATION=7d
OPENWEATHERMAP_API_KEY=your_openweathermap_api_key
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=your_minio_password
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=incidents
EOF

# 3. Khởi động
cd backend
node dist/main.js
```

:::tip Sử dụng PM2
Để chạy backend như service:

```bash
npm install -g pm2
pm2 start dist/main.js --name smart-forecast-backend
pm2 save
pm2 startup
```

:::

### Triển khai Web

```bash
# 1. Download và giải nén
wget https://github.com/NEU-DataVerse/Smart-Forecast/releases/latest/download/web-dist.zip
unzip web-dist.zip -d web

# 2. Set biến môi trường và khởi động
cd web
export NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:8000/api/v1
export NEXT_PUBLIC_MINIO_URL=http://YOUR_SERVER_IP:8002
export PORT=3000
node server.js
```

Hoặc sử dụng Docker:

```dockerfile
FROM node:20-alpine
WORKDIR /app
COPY . .
ENV PORT=3000
ENV NEXT_PUBLIC_API_URL=http://YOUR_SERVER_IP:8000/api/v1
ENV NEXT_PUBLIC_MINIO_URL=http://YOUR_SERVER_IP:8002
EXPOSE 3000
CMD ["node", "server.js"]
```

### Cài đặt Mobile App

1. Download file `smart-forecast-*.apk` từ [Releases](https://github.com/NEU-DataVerse/Smart-Forecast/releases)
2. Cho phép cài đặt từ nguồn không xác định trên thiết bị Android
3. Cài đặt file APK

:::warning Lưu ý
APK được build với URLs production mặc định. Nếu bạn self-host, cần fork repo và build lại với URLs của bạn trong `mobile/eas.json`.
:::

### Biến môi trường cần thiết

#### Backend (bắt buộc)

| Biến                     | Mô tả                                                       |
| ------------------------ | ----------------------------------------------------------- |
| `DATABASE_URL`           | PostgreSQL connection string                                |
| `JWT_SECRET`             | Secret key cho JWT (≥32 ký tự)                              |
| `OPENWEATHERMAP_API_KEY` | API key từ [OpenWeatherMap](https://openweathermap.org/api) |

#### Backend (optional)

| Biến                    | Mô tả                                        |
| ----------------------- | -------------------------------------------- |
| `FIREBASE_PROJECT_ID`   | Firebase project ID (cho push notifications) |
| `FIREBASE_PRIVATE_KEY`  | Firebase service account private key         |
| `FIREBASE_CLIENT_EMAIL` | Firebase service account email               |
| `GOOGLE_CLIENT_ID`      | Google OAuth Client ID (cho mobile login)    |

#### Web

| Biến                    | Mô tả                 |
| ----------------------- | --------------------- |
| `NEXT_PUBLIC_API_URL`   | URL của backend API   |
| `NEXT_PUBLIC_MINIO_URL` | URL của MinIO storage |

---

## Tiếp theo

- [API Documentation](./api) - REST API endpoints
- [Hướng dẫn phát triển](./dev-guide) - Development workflow
- [Troubleshooting](./troubleshooting) - Xử lý lỗi chi tiết
