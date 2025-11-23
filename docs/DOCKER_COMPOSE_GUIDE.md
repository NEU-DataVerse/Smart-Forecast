# Smart-Forecast Docker Compose Guide

Hướng dẫn chi tiết về Docker Compose cho Smart-Forecast

## 📚 Mục lục

- [Giới thiệu](#giới-thiệu)
- [Cấu trúc Services](#cấu-trúc-services)
- [Lệnh Docker Compose](#lệnh-docker-compose)
- [Quản lý Volumes](#quản-lý-volumes)
- [Quản lý Networks](#quản-lý-networks)
- [Health Checks](#health-checks)
- [Scaling Services](#scaling-services)
- [Best Practices](#best-practices)

## 🎯 Giới thiệu

Docker Compose giúp quản lý nhiều container Docker cùng lúc. File `docker-compose.yml` định nghĩa tất cả services, networks, và volumes.

## 🏗️ Cấu trúc Services

### 1. Orion Context Broker

```yaml
orion:
  - Image: fiware/orion-ld:latest
  - Port: 1026
  - Depends on: mongodb
  - Health check: curl /version
```

### 2. MongoDB

```yaml
mongodb:
  - Image: mongo:4.4
  - Port: 27017 (internal only)
  - Volume: mongo_data
  - Health check: mongo ping
```

### 3. PostgreSQL

```yaml
postgres:
  - Image: postgres:14-alpine
  - Port: 5432
  - Volume: postgres_data
  - Health check: pg_isready
```

### 4. MinIO

```yaml
minio:
  - Image: minio/minio:latest
  - API Port: 9000
  - Console Port: 9001
  - Volume: minio_data
  - Health check: curl /minio/health/live
```

## 🔧 Lệnh Docker Compose

### Khởi động Services

```bash
# Khởi động tất cả services
docker-compose up

# Khởi động ở background (detached mode)
docker-compose up -d

# Khởi động services cụ thể
docker-compose up -d orion mongodb

# Khởi động và rebuild images
docker-compose up -d --build

# Khởi động với scale
docker-compose up -d --scale backend=3
```

### Dừng Services

```bash
# Dừng tất cả services
docker-compose stop

# Dừng service cụ thể
docker-compose stop orion

# Dừng và xóa containers
docker-compose down

# Dừng, xóa containers và volumes
docker-compose down -v

# Dừng, xóa containers, volumes và images
docker-compose down -v --rmi all
```

### Quản lý Services

```bash
# Xem status tất cả services
docker-compose ps

# Xem logs tất cả services
docker-compose logs

# Xem logs realtime
docker-compose logs -f

# Xem logs của service cụ thể
docker-compose logs -f orion

# Xem logs 100 dòng cuối
docker-compose logs --tail=100

# Restart service
docker-compose restart orion

# Restart tất cả
docker-compose restart

# Pause service (tạm dừng)
docker-compose pause orion

# Unpause service
docker-compose unpause orion
```

### Exec Commands

```bash
# Chạy lệnh trong container
docker-compose exec postgres psql -U admin -d smart_forecast_db

# Chạy bash shell
docker-compose exec orion bash

# Chạy với user khác
docker-compose exec -u root postgres bash

# Chạy command không tương tác
docker-compose exec -T postgres psql -U admin -d smart_forecast_db -c "SELECT version();"
```

### Build & Pull

```bash
# Build tất cả services
docker-compose build

# Build service cụ thể
docker-compose build backend

# Build không dùng cache
docker-compose build --no-cache

# Pull tất cả images
docker-compose pull

# Pull image cụ thể
docker-compose pull orion
```

## 💾 Quản lý Volumes

### Xem Volumes

```bash
# List tất cả volumes
docker volume ls

# List volumes của project
docker volume ls | grep smart-forecast

# Inspect volume
docker volume inspect smart-forecast_postgres_data
```

### Backup Volumes

```bash
# Backup PostgreSQL
docker run --rm \
  -v smart-forecast_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/postgres-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .

# Backup MongoDB
docker run --rm \
  -v smart-forecast_mongo_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/mongo-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .

# Backup MinIO
docker run --rm \
  -v smart-forecast_minio_data:/data \
  -v $(pwd):/backup \
  alpine tar czf /backup/minio-backup-$(date +%Y%m%d-%H%M%S).tar.gz -C /data .
```

### Restore Volumes

```bash
# Restore PostgreSQL
docker run --rm \
  -v smart-forecast_postgres_data:/data \
  -v $(pwd):/backup \
  alpine tar xzf /backup/postgres-backup-YYYYMMDD-HHMMSS.tar.gz -C /data

# Tương tự cho MongoDB và MinIO
```

### Xóa Volumes

```bash
# Xóa volume cụ thể
docker volume rm smart-forecast_postgres_data

# Xóa tất cả unused volumes
docker volume prune

# Xóa volumes khi down
docker-compose down -v
```

## 🌐 Quản lý Networks

### Xem Networks

```bash
# List networks
docker network ls

# Inspect network
docker network inspect smart-forecast_smart-forecast-net

# Xem containers trong network
docker network inspect smart-forecast_smart-forecast-net --format '{{range .Containers}}{{.Name}} {{end}}'
```

### Debug Network

```bash
# Ping giữa containers
docker-compose exec orion ping mongodb

# Test kết nối
docker-compose exec orion curl http://mongodb:27017

# Kiểm tra DNS
docker-compose exec orion nslookup mongodb
```

## 🏥 Health Checks

### Kiểm tra Health Status

```bash
# Xem health status tất cả containers
docker-compose ps

# Xem chi tiết health check
docker inspect --format='{{json .State.Health}}' orion | jq

# Xem health check logs
docker inspect --format='{{range .State.Health.Log}}{{.Output}}{{end}}' orion
```

### Health Check Configuration

```yaml
healthcheck:
  test: ['CMD', 'curl', '-f', 'http://localhost:1026/version']
  interval: 30s # Kiểm tra mỗi 30 giây
  timeout: 10s # Timeout sau 10 giây
  retries: 3 # Thử lại 3 lần
  start_period: 40s # Grace period 40 giây
```

### Tùy chỉnh Health Check

Bạn có thể tùy chỉnh health check trong `docker-compose.yml`:

```yaml
healthcheck:
  test: ['CMD-SHELL', 'pg_isready -U ${POSTGRES_USER}']
  interval: 10s # Kiểm tra thường xuyên hơn
  timeout: 5s # Timeout nhanh hơn
  retries: 5 # Thử lại nhiều hơn
  start_period: 60s # Grace period dài hơn
```

## 📈 Scaling Services

### Scale Services

```bash
# Scale backend lên 3 instances
docker-compose up -d --scale backend=3

# Scale nhiều services
docker-compose up -d --scale backend=3 --scale worker=2

# Xem scaled instances
docker-compose ps
```

### Load Balancing

Để load balance giữa scaled services, cần thêm reverse proxy (nginx, traefik):

```yaml
nginx:
  image: nginx:alpine
  ports:
    - '80:80'
  depends_on:
    - backend
  volumes:
    - ./nginx.conf:/etc/nginx/nginx.conf
```

## 🎯 Best Practices

### 1. Sử dụng .env file

```bash
# Không commit .env vào git
echo ".env" >> .gitignore

# Sử dụng .env.example làm template
cp .env.example .env
```

### 2. Named Volumes vs Bind Mounts

```yaml
# Named volume (tốt cho production)
volumes:
  - postgres_data:/var/lib/postgresql/data

# Bind mount (tốt cho development)
volumes:
  - ./backend:/app
```

### 3. Dependency Management

```yaml
depends_on:
  orion:
    condition: service_healthy # Đợi service healthy
```

### 4. Resource Limits

```yaml
deploy:
  resources:
    limits:
      cpus: '0.5'
      memory: 512M
    reservations:
      cpus: '0.25'
      memory: 256M
```

### 5. Logging Configuration

```yaml
logging:
  driver: 'json-file'
  options:
    max-size: '10m'
    max-file: '3'
```

### 6. Security

```bash
# Không expose ports không cần thiết
# Sử dụng expose thay vì ports
expose:
  - "27017"

# Sử dụng secrets cho sensitive data
secrets:
  db_password:
    file: ./secrets/db_password.txt
```

### 7. Development vs Production

```bash
# Development
docker-compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up
```

## 🔍 Troubleshooting Tips

### Container không start

```bash
# Xem logs chi tiết
docker-compose logs orion

# Xem events
docker events --filter container=orion

# Inspect container
docker inspect orion
```

### Port conflicts

```bash
# Tìm process dùng port
netstat -ano | findstr :1026  # Windows
lsof -i :1026                  # Linux/Mac

# Kill process hoặc đổi port trong docker-compose.yml
```

### Volume issues

```bash
# Reset tất cả volumes
docker-compose down -v
docker volume prune
docker-compose up -d
```

### Network issues

```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

## 📚 Tài liệu tham khảo

- [Docker Compose Documentation](https://docs.docker.com/compose/)
- [Docker Compose File Reference](https://docs.docker.com/compose/compose-file/)
- [Docker Best Practices](https://docs.docker.com/develop/dev-best-practices/)

---

**Tip**: Bookmark tài liệu này để tra cứu nhanh các lệnh Docker Compose! 📖
