# 📝 Cheat Sheet - Các lệnh thường dùng

## 🚀 Khởi động nhanh

```bash
# 1. Tạo file .env
cp .env.example .env

# 2. Khởi động tất cả services
docker-compose up -d

# 3. Xem trạng thái
docker-compose ps
```

## 🔧 Quản lý Services

```bash
# Xem logs tất cả services
docker-compose logs

# Xem logs realtime
docker-compose logs -f

# Xem logs một service
docker-compose logs -f orion

# Restart một service
docker-compose restart orion

# Dừng tất cả
docker-compose down

# Dừng và xóa data
docker-compose down -v
```

## 🏥 Health Check

```bash
# Xem health status
docker-compose ps

# Test Orion
curl http://localhost:1026/version

# Test Backend
curl http://localhost:8000/api/v1

# Test MinIO
curl http://localhost:9000/minio/health/live
```

## 💾 Database

### PostgreSQL

```bash
# Connect
docker exec -it postgres psql -U admin -d smart_forecast_db

# Backup
docker exec postgres pg_dump -U admin smart_forecast_db > backup.sql

# Restore
docker exec -i postgres psql -U admin smart_forecast_db < backup.sql

# List tables
docker exec postgres psql -U admin -d smart_forecast_db -c "\dt"
```

### MongoDB

```bash
# Connect
docker exec -it mongodb mongo

# List databases
docker exec mongodb mongo --eval "show dbs"

# Backup
docker exec mongodb mongodump --out /backup

# Restore
docker exec mongodb mongorestore /backup
```

## 📦 MinIO Object Storage

```bash
# Web Console
http://localhost:9001
Username: minioadmin
Password: minioadmin

# API
http://localhost:9000
```

## 🔍 Debug

```bash
# Exec vào container
docker-compose exec orion bash
docker-compose exec postgres sh

# Xem chi tiết container
docker inspect orion

# Xem resource usage
docker stats

# Xem network
docker network inspect smart-forecast_smart-forecast-net
```

## 🧹 Cleanup

```bash
# Xóa containers và networks
docker-compose down

# Xóa containers, networks và volumes
docker-compose down -v

# Xóa tất cả (bao gồm images)
docker-compose down -v --rmi all

# Xóa unused volumes
docker volume prune

# Xóa unused images
docker image prune

# Xóa tất cả unused resources
docker system prune -a --volumes
```

## 🛠️ Development

```bash
# Backend (NestJS)
pnpm --filter backend run start:dev

# Web (Next.js)
pnpm --filter web run dev

# Mobile (Expo)
pnpm --filter mobile run start
```

## 📊 Monitoring

```bash
# Xem CPU, Memory usage
docker stats

# Xem logs với timestamp
docker-compose logs -f -t

# Xem logs từ 5 phút trước
docker-compose logs --since 5m

# Xem 100 dòng cuối
docker-compose logs --tail=100
```

## 🔄 Update & Rebuild

```bash
# Pull images mới nhất
docker-compose pull

# Rebuild và restart
docker-compose up -d --build

# Rebuild một service
docker-compose build backend
docker-compose up -d backend
```

## ⚠️ Troubleshooting

```bash
# Restart tất cả
docker-compose restart

# Recreate containers
docker-compose up -d --force-recreate

# Reset hoàn toàn
docker-compose down -v
docker volume prune
docker-compose up -d

# Kiểm tra port đang được dùng
netstat -ano | findstr :1026  # Windows
lsof -i :1026                  # Linux/Mac
```

## 🌐 Service URLs

| Service              | URL                   | Credentials           |
| -------------------- | --------------------- | --------------------- |
| Orion Context Broker | http://localhost:1026 | -                     |
| MinIO Console        | http://localhost:9001 | minioadmin/minioadmin |
| PostgreSQL           | localhost:5432        | admin/admin           |
| Backend API          | http://localhost:8000 | -                     |

## 📚 Quick Links

- [README.md](../README.md) - Hướng dẫn đầy đủ
- [QUICKSTART.md](../QUICKSTART.md) - Khởi động nhanh
- [DOCKER_COMPOSE_GUIDE.md](../docs/DOCKER_COMPOSE_GUIDE.md) - Hướng dẫn Docker Compose
- [.env.example](../.env.example) - Environment variables template

---

**Tip**: Ctrl+F để tìm kiếm lệnh bạn cần! 🔍
