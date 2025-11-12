# ✅ Changelog - Cập nhật Docker Compose

## 🔧 Sửa lỗi Cygnus Image (11/11/2025)

### ❌ Vấn đề

- Docker Compose không thể pull image `fiware/cygnus-ngsi-ld:latest`
- Lỗi: `pull access denied for fiware/cygnus-ngsi-ld, repository does not exist`

### ✅ Giải pháp

Đã thay đổi image Cygnus từ:

```yaml
# ❌ BEFORE (không tồn tại)
cygnus:
  image: fiware/cygnus-ngsi-ld:latest
```

Thành:

```yaml
# ✅ AFTER (image chính xác)
cygnus:
  image: fiware/cygnus-ngsi:latest
```

### 📝 Thay đổi chi tiết

#### 1. Image

- **Old**: `fiware/cygnus-ngsi-ld:latest` ❌
- **New**: `fiware/cygnus-ngsi:latest` ✅

#### 2. Environment Variables

Cập nhật các biến môi trường phù hợp với image mới:

```yaml
environment:
  # PostgreSQL sink configuration
  - CYGNUS_POSTGRESQL_HOST=postgres
  - CYGNUS_POSTGRESQL_PORT=5432
  - CYGNUS_POSTGRESQL_USER=${POSTGRES_USER}
  - CYGNUS_POSTGRESQL_PASS=${POSTGRES_PASSWORD}
  - CYGNUS_POSTGRESQL_DATABASE=${POSTGRES_DB}
  - CYGNUS_POSTGRESQL_ENABLE_CACHE=true

  # Service ports
  - CYGNUS_SERVICE_PORT=5050
  - CYGNUS_API_PORT=5080

  # Logging
  - CYGNUS_LOG_LEVEL=DEBUG
```

#### 3. Ports

Thêm ports mapping:

```yaml
ports:
  - "5080:5080" # API port
  - "5050:5050" # Service port
```

### ✅ Kết quả

Sau khi sửa, tất cả services đã khởi động thành công:

```bash
$ docker-compose ps
NAME       STATUS                   PORTS
cygnus     Up 40 seconds (healthy)  0.0.0.0:5050->5050/tcp, 0.0.0.0:5080->5080/tcp
minio      Up 41 seconds (healthy)  0.0.0.0:9000-9001->9000-9001/tcp
mongodb    Up 41 seconds (healthy)  27017/tcp
orion      Up 41 seconds (healthy)  0.0.0.0:1026->1026/tcp
postgres   Up 41 seconds (healthy)  0.0.0.0:5432->5432/tcp
```

### 🧪 Test Endpoints

```bash
# Orion Context Broker
$ curl http://localhost:1026/version
{
  "orionld version": "post-v1.10.0",
  "orion version": "1.15.0-next",
  ...
}

# Cygnus
$ curl http://localhost:5080/v1/version
{
  "success": "true",
  "version": "3.16.0.155c2cd1bbab6444838a9393f135a0fc041af79f"
}

# MinIO
$ curl http://localhost:9000/minio/health/live
(empty response = healthy)
```

### 📚 Tài liệu đã tạo

Đã tạo thêm các file hướng dẫn:

1. **README.md** - Hướng dẫn đầy đủ
2. **QUICKSTART.md** - Hướng dẫn khởi động nhanh
3. **CHEATSHEET.md** - Tổng hợp lệnh thường dùng
4. **docs/DOCKER_COMPOSE_GUIDE.md** - Hướng dẫn Docker Compose chi tiết
5. **docs/TROUBLESHOOTING.md** - Hướng dẫn khắc phục lỗi
6. **scripts/setup.sh** - Script tự động setup (Linux/Mac)
7. **scripts/setup.bat** - Script tự động setup (Windows)
8. **Makefile** - Lệnh make để quản lý dễ dàng

### 🚀 Cách sử dụng

#### Khởi động lần đầu:

```bash
# 1. Tạo file .env
cp .env.example .env

# 2. Khởi động Docker Compose
docker-compose up -d

# 3. Kiểm tra status
docker-compose ps

# 4. Xem logs
docker-compose logs -f
```

#### Hoặc dùng script tự động (Windows):

```bash
scripts\setup.bat
```

#### Hoặc dùng Makefile:

```bash
make setup
make up
make ps
```

### 🔗 Links tham khảo

- [FIWARE Cygnus Documentation](https://fiware-cygnus.readthedocs.io/)
- [Cygnus Docker Hub](https://hub.docker.com/r/fiware/cygnus-ngsi)
- [FIWARE Orion-LD Documentation](https://fiware-orion.readthedocs.io/)

### ⚠️ Lưu ý

- Image `fiware/cygnus-ngsi-ld` **KHÔNG** tồn tại trên Docker Hub
- Sử dụng `fiware/cygnus-ngsi` cho NGSI-v2
- Cygnus có thể nhận cả NGSI-v2 và NGSI-LD notifications
- Đối với NGSI-LD, cần cấu hình subscription từ Orion-LD tới Cygnus

### 📊 Service URLs

| Service              | URL                   | Credentials           |
| -------------------- | --------------------- | --------------------- |
| Orion Context Broker | http://localhost:1026 | -                     |
| Cygnus API           | http://localhost:5080 | -                     |
| MinIO Console        | http://localhost:9001 | minioadmin/minioadmin |
| PostgreSQL           | localhost:5432        | admin/admin           |

---

**Last Updated**: November 11, 2025
**Status**: ✅ All services running and healthy
