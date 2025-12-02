---
sidebar_position: 11
title: Troubleshooting
---

# Troubleshooting

Hướng dẫn khắc phục các lỗi thường gặp trong Smart Forecast.

---

## Docker Compose Errors

### Network not found

```
Error: network smart-forecast_smart-forecast-net not found
```

**Giải pháp:**

```bash
docker compose down
docker compose up -d
```

### Port already in use

```
Error: bind: address already in use
```

**Giải pháp:**

```bash
# Tìm process đang dùng port
# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# Linux/macOS
lsof -i :5432
kill -9 <PID>

# Hoặc đổi port trong docker-compose.yml
ports:
  - "5433:5432"
```

---

## Container Health Issues

### Container status "unhealthy"

**Kiểm tra:**

```bash
# Xem health logs
docker inspect --format='{{json .State.Health}}' <container_name>

# Xem container logs
docker compose logs <service_name>
```

**Giải pháp:**

```bash
# Restart container
docker compose restart <service_name>

# Hoặc recreate
docker compose up -d --force-recreate <service_name>
```

### Orion-LD không healthy

**Kiểm tra:**

```bash
docker compose logs orion
curl http://localhost:1026/version
```

**Giải pháp:**

```bash
# Đảm bảo MongoDB đang chạy
docker compose ps mongodb

# Restart
docker compose restart orion
```

### PostgreSQL không healthy

**Kiểm tra:**

```bash
docker compose logs postgres
docker compose exec postgres pg_isready -U admin
```

**Giải pháp:**

```bash
# Kiểm tra .env
cat .env | grep POSTGRES

# Reset (xóa data)
docker compose down -v
docker compose up -d
```

---

## Database Connection

### Cannot connect to PostgreSQL

```
FATAL: password authentication failed
```

**Giải pháp:**

```bash
# 1. Kiểm tra environment
cat backend/.env | grep DATABASE_URL

# 2. Reset database
docker compose down -v
docker compose up -d

# 3. Test connection
docker compose exec postgres psql -U admin -d smart_forecast_db
```

### Cannot connect to MongoDB

**Giải pháp:**

```bash
# Kiểm tra container
docker compose ps mongodb

# Test connection
docker compose exec mongodb mongosh

# Ping từ orion
docker compose exec orion ping mongodb
```

---

## Network Issues

### Services không connect được

```bash
# Xem network
docker network inspect smart-forecast-net

# Test ping
docker compose exec orion ping mongodb
docker compose exec backend ping postgres
```

**Giải pháp:**

```bash
# Recreate network
docker compose down
docker network prune
docker compose up -d
```

---

## Port Conflicts

| Service       | Default Port | Alternative |
| ------------- | ------------ | ----------- |
| Orion-LD      | 1026         | 1027        |
| PostgreSQL    | 5432         | 5433        |
| MinIO API     | 9000         | 9002        |
| MinIO Console | 9001         | 9003        |
| Backend       | 8000         | 8001        |
| Web           | 3000         | 3001        |

**Đổi port:**

```yaml
# docker-compose.yml
ports:
  - '5433:5432' # External:Internal
```

---

## Mobile App Issues

### Cannot connect to API

```
Network request failed
```

**Nguyên nhân:** Mobile không thể dùng `localhost`

**Giải pháp:**

```bash
# Tìm IP máy
# Windows
ipconfig

# macOS/Linux
ifconfig

# Cập nhật mobile/.env
EXPO_PUBLIC_BACKEND_API_URL=http://192.168.1.100:8000/api/v1
```

### Map không hiển thị

**Giải pháp:**

1. Kiểm tra API key MapLibre
2. Kiểm tra kết nối internet
3. Restart Expo dev server

---

## Backend Issues

### Database schema issues

```bash
# TypeORM đang dùng synchronize trong development
# Kiểm tra DATABASE_URL trong backend/.env
cat backend/.env | grep DATABASE_URL

# Restart backend để re-sync schema
pnpm run dev:backend
```

### JWT authentication fails

**Giải pháp:**

```bash
# Kiểm tra JWT_SECRET
cat backend/.env | grep JWT_SECRET

# Đảm bảo không có khoảng trắng/newline
# Restart backend
```

---

## Web Dashboard Issues

### Build fails

```bash
# Clear cache
rm -rf web/.next
pnpm run build:web
```

### API calls fail

**Kiểm tra:**

```bash
# CORS configuration trong backend
# Environment variables
cat web/.env.local
```

---

## Volume Issues

### Permission denied

```bash
# Reset volumes
docker compose down -v
docker volume prune
docker compose up -d
```

### Out of space

```bash
# Xem disk usage
docker system df

# Cleanup
docker system prune -a --volumes
```

---

## Debugging Commands

### Xem logs

```bash
# Tất cả services
docker compose logs

# Realtime
docker compose logs -f

# Service cụ thể
docker compose logs -f orion

# 100 dòng cuối
docker compose logs --tail=100
```

### Exec vào container

```bash
# Bash shell
docker compose exec orion bash

# PostgreSQL
docker compose exec postgres psql -U admin -d smart_forecast_db

# MongoDB
docker compose exec mongodb mongosh
```

### Resource monitoring

```bash
# Real-time stats
docker stats

# Một lần
docker stats --no-stream
```

---

## Emergency Reset

Khi tất cả không hoạt động:

```bash
# 1. Dừng tất cả
docker compose down -v

# 2. Xóa tất cả
docker system prune -a --volumes

# 3. Restart Docker

# 4. Pull images
docker compose pull

# 5. Khởi động
docker compose up -d

# 6. Kiểm tra
docker compose ps
```

---

## Health Check Checklist

Sau khi khởi động:

```bash
# 1. Containers đang chạy
docker compose ps

# 2. Test endpoints
curl http://localhost:1026/version          # Orion
curl http://localhost:8000/api/v1/health    # Backend
curl http://localhost:9000/minio/health/live # MinIO

# 3. Database connections
docker compose exec postgres psql -U admin -d smart_forecast_db -c "SELECT 1;"
docker compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# 4. Xem errors
docker compose logs | grep -i error
```

---

## Cần thêm trợ giúp?

1. Xem logs: `docker compose logs -f`
2. [FIWARE Documentation](https://fiware-orion.readthedocs.io/)
3. [Docker Documentation](https://docs.docker.com/)
4. [Tạo issue trên GitHub](https://github.com/NEU-DataVerse/Smart-Forecast/issues)

---

## Tiếp theo

- [Triển khai](./deployment) - Docker Compose setup
- [Hướng dẫn phát triển](./dev-guide) - Development workflow
- [Biến môi trường](./env) - Environment configuration
