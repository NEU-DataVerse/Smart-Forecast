# 🔧 Troubleshooting Guide

Hướng dẫn khắc phục các lỗi thường gặp với Smart-Forecast

## 📋 Mục lục

- [Docker Compose Errors](#docker-compose-errors)
- [Container Health Issues](#container-health-issues)
- [Database Connection Issues](#database-connection-issues)
- [Network Issues](#network-issues)
- [Port Conflicts](#port-conflicts)
- [Volume Issues](#volume-issues)

## 🐳 Docker Compose Errors

### ❌ Error: "network smart-forecast-net not found"

**Lỗi:**

```
Error: network smart-forecast_smart-forecast-net not found
```

**Giải pháp:**

```bash
# Tạo lại network
docker-compose down
docker-compose up -d
```

### ❌ Error: "Bind for 0.0.0.0:XXXX failed: port is already allocated"

**Lỗi:**

```
Error starting userland proxy: listen tcp4 0.0.0.0:5432: bind: address already in use
```

**Giải pháp:**

**Cách 1:** Tìm và dừng process đang dùng port

```bash
# Windows
netstat -ano | findstr :5432
taskkill /PID <PID> /F

# Linux/Mac
lsof -i :5432
kill -9 <PID>
```

**Cách 2:** Đổi port trong `docker-compose.yml`

```yaml
ports:
  - '5433:5432' # Đổi 5432 thành 5433
```

## 🏥 Container Health Issues

### ⚠️ Container có status "unhealthy"

**Kiểm tra:**

```bash
# Xem health check logs
docker inspect --format='{{json .State.Health}}' <container_name> | jq

# Xem container logs
docker-compose logs <service_name>
```

**Giải pháp chung:**

```bash
# Restart container
docker-compose restart <service_name>

# Hoặc recreate container
docker-compose up -d --force-recreate <service_name>
```

### 🔴 Orion không healthy

**Kiểm tra:**

```bash
# Xem logs
docker-compose logs orion

# Test endpoint
curl http://localhost:1026/version
```

**Giải pháp:**

```bash
# Đảm bảo MongoDB đang chạy
docker-compose ps mongodb

# Restart orion
docker-compose restart orion

# Hoặc rebuild
docker-compose up -d --build orion
```

### 🔴 PostgreSQL không healthy

**Kiểm tra:**

```bash
# Xem logs
docker-compose logs postgres

# Kiểm tra pg_isready
docker-compose exec postgres pg_isready -U admin
```

**Giải pháp:**

```bash
# Kiểm tra environment variables
cat .env | grep POSTGRES

# Restart
docker-compose restart postgres

# Reset volume nếu cần (⚠️ xóa data)
docker-compose down -v
docker-compose up -d
```

### 🔴 MongoDB không healthy

**Kiểm tra:**

```bash
# Xem logs
docker-compose logs mongodb

# Test mongo command
docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"
```

**Giải pháp:**

```bash
# Restart
docker-compose restart mongodb

# Hoặc reset volume (⚠️ xóa data)
docker-compose down -v
docker volume rm smartforecast_mongo_data
docker-compose up -d
```

## 💾 Database Connection Issues

### ❌ Cannot connect to PostgreSQL

**Lỗi:**

```
FATAL: password authentication failed for user "admin"
```

**Giải pháp:**

```bash
# 1. Kiểm tra .env file
cat .env | grep POSTGRES_USER
cat .env | grep POSTGRES_PASSWORD

# 2. Recreate với environment mới
docker-compose down -v
docker-compose up -d

# 3. Test connection
docker-compose exec postgres psql -U admin -d smart_forecast_db
```

### ❌ Cannot connect to MongoDB

**Giải pháp:**

```bash
# 1. Kiểm tra container đang chạy
docker-compose ps mongodb

# 2. Test connection
docker-compose exec mongodb mongo

# 3. Kiểm tra từ orion
docker-compose exec orion ping mongodb
```

## 🌐 Network Issues

### ❌ Services không thể connect với nhau

**Kiểm tra:**

```bash
# Xem network
docker network inspect smartforecast_smart-forecast-net

# Test ping
docker-compose exec orion ping mongodb
docker-compose exec orion ping postgres
```

**Giải pháp:**

```bash
# Recreate network
docker-compose down
docker network prune
docker-compose up -d
```

### ❌ DNS resolution failed

**Giải pháp:**

```bash
# Restart Docker Desktop
# Hoặc restart Docker daemon (Linux)
sudo systemctl restart docker

# Recreate containers
docker-compose up -d --force-recreate
```

## 🚪 Port Conflicts

### Các port đang sử dụng:

| Service       | Port | Alternative |
| ------------- | ---- | ----------- |
| Orion         | 1026 | 1027        |
| PostgreSQL    | 5432 | 5433        |
| MinIO API     | 9000 | 9002        |
| MinIO Console | 9001 | 9003        |
| Backend API   | 8000 | 8001        |

**Cách đổi port:**

Sửa trong `docker-compose.yml`:

```yaml
ports:
  - '5433:5432' # External:Internal
```

## 💽 Volume Issues

### ❌ Volume permission denied

**Lỗi:**

```
mkdir: cannot create directory '/data/db': Permission denied
```

**Giải pháp:**

```bash
# Xóa volume và tạo lại
docker-compose down -v
docker volume prune
docker-compose up -d
```

### ❌ Volume out of space

**Kiểm tra:**

```bash
# Xem disk usage
docker system df

# Xem volume size
docker system df -v
```

**Giải pháp:**

```bash
# Cleanup unused volumes
docker volume prune

# Cleanup all unused resources
docker system prune -a --volumes
```

### 🗑️ Reset tất cả volumes

**⚠️ CẢNH BÁO: Sẽ xóa TẤT CẢ dữ liệu!**

```bash
# Dừng containers
docker-compose down -v

# Xóa volumes cụ thể
docker volume rm smartforecast_postgres_data
docker volume rm smartforecast_mongo_data
docker volume rm smartforecast_minio_data

# Hoặc xóa tất cả
docker volume prune

# Khởi động lại
docker-compose up -d
```

## 🔍 General Debugging

### Xem logs chi tiết

```bash
# Tất cả services
docker-compose logs

# Realtime
docker-compose logs -f

# Một service cụ thể
docker-compose logs -f orion

# Với timestamp
docker-compose logs -f -t

# 100 dòng cuối
docker-compose logs --tail=100

# Logs từ 5 phút trước
docker-compose logs --since 5m
```

### Exec vào container

```bash
# Bash shell
docker-compose exec orion bash
docker-compose exec postgres sh

# Chạy command
docker-compose exec postgres psql -U admin -d smart_forecast_db
docker-compose exec mongodb mongo

# Với user root
docker-compose exec -u root orion bash
```

### Inspect container

```bash
# Xem config đầy đủ
docker inspect orion

# Xem health check
docker inspect --format='{{json .State.Health}}' orion | jq

# Xem environment variables
docker inspect --format='{{json .Config.Env}}' orion | jq

# Xem volumes
docker inspect --format='{{json .Mounts}}' postgres | jq
```

### Resource monitoring

```bash
# Real-time stats
docker stats

# Một lần
docker stats --no-stream

# Specific containers
docker stats orion postgres mongodb
```

## 🆘 Emergency Reset

Nếu tất cả các cách trên không work:

```bash
# 1. Dừng tất cả
docker-compose down -v

# 2. Xóa tất cả containers, images, volumes
docker system prune -a --volumes

# 3. Restart Docker Desktop / Docker daemon

# 4. Pull images lại
docker-compose pull

# 5. Khởi động lại
docker-compose up -d

# 6. Kiểm tra
docker-compose ps
```

## 📞 Cần trợ giúp thêm?

1. Xem logs chi tiết: `docker-compose logs -f`
2. Kiểm tra [FIWARE Documentation](https://fiware-orion.readthedocs.io/)
3. Kiểm tra [Docker Documentation](https://docs.docker.com/)
4. Tạo issue trên GitHub repository

## ✅ Health Check Checklist

Sau khi khởi động, kiểm tra:

```bash
# 1. Tất cả containers đang chạy
docker-compose ps

# 2. Tất cả services healthy
# Tất cả phải có status (healthy)

# 3. Test endpoints
curl http://localhost:1026/version        # Orion
curl http://localhost:8000/api/v1         # Backend
curl http://localhost:9000/minio/health/live  # MinIO

# 4. Test database connections
docker-compose exec postgres psql -U admin -d smart_forecast_db -c "SELECT 1;"
docker-compose exec mongodb mongo --eval "db.adminCommand('ping')"

# 5. Xem logs không có error
docker-compose logs | grep -i error
```

---

**Note:** Giữ file này để tra cứu nhanh khi gặp vấn đề! 🔖
