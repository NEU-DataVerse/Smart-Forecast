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
┌─────────────────────────────────────────────────────────┐
│                    Docker Compose                        │
├─────────────┬─────────────┬─────────────┬───────────────┤
│   Orion-LD  │  PostgreSQL │   MongoDB   │     MinIO     │
│   :1026     │   :5432     │   :27017    │  :9000/:9001  │
├─────────────┴─────────────┴─────────────┴───────────────┤
│               smart-forecast-net (network)               │
└─────────────────────────────────────────────────────────┘
```

### Services

| Service    | Image                         | Port             | Mô tả                  |
| ---------- | ----------------------------- | ---------------- | ---------------------- |
| `orion`    | fiware/orion-ld:latest        | 1026             | NGSI-LD Context Broker |
| `mongodb`  | mongo:4.4                     | 27017 (internal) | Database cho Orion-LD  |
| `postgres` | postgis/postgis:14-3.4-alpine | 5432             | Database chính         |
| `minio`    | minio/minio:latest            | 9000, 9001       | Object Storage         |

---

## Cấu hình

### Biến môi trường

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Các biến quan trọng:

```bash
# Database
POSTGRES_USER=admin
POSTGRES_PASSWORD=your_secure_password
POSTGRES_DB=smart_forecast_db

# MinIO
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=your_secure_password

# Orion-LD
ORION_PORT=1026
```

### docker-compose.yml

```yaml
services:
  orion:
    image: fiware/orion-ld:latest
    ports:
      - '1026:1026'
    depends_on:
      mongodb:
        condition: service_healthy
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:1026/version']
      interval: 30s
      timeout: 10s
      retries: 3

  mongodb:
    image: mongo:4.4
    volumes:
      - mongo_data:/data/db
    healthcheck:
      test: ['CMD', 'mongo', '--eval', "db.adminCommand('ping')"]
      interval: 30s
      timeout: 10s
      retries: 3

  postgres:
    image: postgis/postgis:14-3.4-alpine
    ports:
      - '5432:5432'
    volumes:
      - postgres_data:/var/lib/postgresql/data
    environment:
      - POSTGRES_USER=${POSTGRES_USER}
      - POSTGRES_PASSWORD=${POSTGRES_PASSWORD}
      - POSTGRES_DB=${POSTGRES_DB}
    healthcheck:
      test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER}']
      interval: 30s
      timeout: 10s
      retries: 3

  minio:
    image: minio/minio:latest
    command: server /data --console-address ":9001"
    ports:
      - '9000:9000'
      - '9001:9001'
    volumes:
      - minio_data:/data
    healthcheck:
      test: ['CMD', 'curl', '-f', 'http://localhost:9000/minio/health/live']
      interval: 30s
      timeout: 10s
      retries: 3

volumes:
  mongo_data:
  postgres_data:
  minio_data:

networks:
  default:
    name: smart-forecast-net
```

---

## Các lệnh triển khai

### Sử dụng Makefile (khuyến nghị)

```bash
# Xem tất cả lệnh
make help

# Khởi động services
make up

# Dừng services
make down

# Xem logs
make logs

# Xem status
make ps

# Kiểm tra health
make health

# Restart services
make restart

# Clean toàn bộ (cẩn thận - xóa data)
make clean
```

### Sử dụng Docker Compose trực tiếp

```bash
# Khởi động
docker compose up -d

# Dừng
docker compose down

# Xem logs
docker compose logs -f

# Xem logs service cụ thể
docker compose logs -f orion

# Restart
docker compose restart

# Xem status
docker compose ps

# Rebuild
docker compose up -d --build

# Xóa tất cả (bao gồm volumes)
docker compose down -v
```

---

## Setup Scripts

### Linux/macOS

```bash
# Cấp quyền execute
chmod +x scripts/setup.sh
chmod +x scripts/health-check.sh

# Chạy setup
./scripts/setup.sh
```

Script sẽ:

1. Kiểm tra Docker & Docker Compose
2. Tạo file `.env` từ template
3. Tạo các thư mục cần thiết
4. Pull Docker images
5. Khởi động services
6. Kiểm tra health

### Windows

```cmd
# Command Prompt
scripts\setup.bat

# PowerShell
.\scripts\setup.bat
```

### Health Check

```bash
# Linux/macOS/Git Bash
./scripts/health-check.sh

# Hoặc dùng Makefile
make health
```

---

## Quản lý dữ liệu

### Seed Database

Sau khi khởi động Docker services, cần seed dữ liệu mẫu:

```bash
cd backend
npm run seed:force
```

#### Các lệnh seed

| Command                   | Mô tả                                              |
| ------------------------- | -------------------------------------------------- |
| `npm run seed`            | Seed nếu DB rỗng                                   |
| `npm run seed:force`      | Force reseed (xóa và seed lại tất cả)              |
| `npm run seed:base`       | Seed base data (không có fake weather/air-quality) |
| `npm run seed:base:force` | Force reseed base data                             |
| `npm run seed:clear`      | Xóa tất cả dữ liệu                                 |

#### Dữ liệu được seed

| Bảng                   | Mô tả                        | Số lượng      |
| ---------------------- | ---------------------------- | ------------- |
| `users`                | Tài khoản người dùng         | 3             |
| `observation_station`  | Trạm quan trắc               | 4             |
| `weather_observed`     | Dữ liệu thời tiết            | ~256 (7 ngày) |
| `air_quality_observed` | Dữ liệu chất lượng không khí | ~256 (7 ngày) |
| `incidents`            | Báo cáo sự cố                | 11            |
| `alert_thresholds`     | Ngưỡng cảnh báo              | 4             |
| `alerts`               | Cảnh báo môi trường          | 10            |

:::tip Sử dụng dữ liệu thật từ OpenWeatherMap
Nếu muốn sử dụng dữ liệu thật thay vì fake data:

```bash
# 1. Seed base data (users, stations, incidents, alerts)
npm run seed:base:force

# 2. Vào Dashboard web → "Thu thập dữ liệu lịch sử" để lấy data thật
```

:::

### Backup

```bash
# Backup tất cả
make backup

# Backup riêng lẻ
# PostgreSQL
docker run --rm \
  -v smart-forecast_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/postgres-$(date +%Y%m%d).tar.gz -C /data .

# MongoDB
docker run --rm \
  -v smart-forecast_mongo_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/mongo-$(date +%Y%m%d).tar.gz -C /data .

# MinIO
docker run --rm \
  -v smart-forecast_minio_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar czf /backup/minio-$(date +%Y%m%d).tar.gz -C /data .
```

### Restore

```bash
# PostgreSQL
docker compose stop postgres
docker run --rm \
  -v smart-forecast_postgres_data:/data \
  -v $(pwd)/backups:/backup \
  alpine tar xzf /backup/postgres-YYYYMMDD.tar.gz -C /data
docker compose start postgres
```

### Xóa volumes

```bash
# Xóa tất cả volumes
docker compose down -v

# Xóa volume cụ thể
docker volume rm smart-forecast_postgres_data

# Prune unused volumes
docker volume prune
```

---

## Health Checks

### Kiểm tra thủ công

```bash
# Orion-LD
curl http://localhost:1026/version

# PostgreSQL
docker compose exec postgres pg_isready -U admin

# MinIO
curl http://localhost:9000/minio/health/live
```

### Kết quả mong đợi

```
================================
Smart-Forecast Health Check
================================

Testing Service Endpoints...
-----------------------------------
Testing Orion Context Broker... OK
Testing Backend API... OK
Testing MinIO Health... OK

Testing Database Connections...
-----------------------------------
Testing PostgreSQL... OK
Testing MongoDB... OK

All services are running and healthy!
```

---

## Service URLs

| Service       | URL                   | Credentials             |
| ------------- | --------------------- | ----------------------- |
| Orion-LD      | http://localhost:1026 | -                       |
| MinIO Console | http://localhost:9001 | minioadmin / minioadmin |
| PostgreSQL    | localhost:5432        | admin / admin           |
| Backend API   | http://localhost:8000 | -                       |
| Web Dashboard | http://localhost:3000 | -                       |

---

## Scaling

### Scale services

```bash
# Scale backend lên 3 instances
docker compose up -d --scale backend=3

# Xem scaled instances
docker compose ps
```

### Resource limits

Thêm vào `docker-compose.yml`:

```yaml
services:
  backend:
    deploy:
      resources:
        limits:
          cpus: '0.5'
          memory: 512M
        reservations:
          cpus: '0.25'
          memory: 256M
```

---

## Troubleshooting

### Container không start

```bash
# Xem logs chi tiết
docker compose logs orion

# Inspect container
docker inspect orion
```

### Port conflict

```bash
# Tìm process dùng port (Linux/macOS)
lsof -i :1026

# Windows
netstat -ano | findstr :1026

# Đổi port trong docker-compose.yml
ports:
  - "1027:1026"  # Map sang port khác
```

### Health check failed

```bash
# Chờ thêm 1-2 phút để services khởi động
sleep 60

# Kiểm tra lại
make health

# Reset nếu cần
make clean
make up
```

### Volume issues

```bash
# Reset volumes
docker compose down -v
docker volume prune -f
docker compose up -d
```

---

## Tiếp theo

- [API Documentation](./api) - REST API endpoints
- [Hướng dẫn phát triển](./dev-guide) - Development workflow
- [Troubleshooting](./troubleshooting) - Xử lý lỗi chi tiết
