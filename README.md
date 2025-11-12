# Smart-Forecast

Smart urban environmental monitoring and warning system - Hệ thống giám sát và cảnh báo môi trường đô thị thông minh

## 📋 Mục Lục

- [Giới thiệu](#giới-thiệu)
- [Kiến trúc hệ thống](#kiến-trúc-hệ-thống)
- [Yêu cầu hệ thống](#yêu-cầu-hệ-thống)
- [Cài đặt và chạy](#cài-đặt-và-chạy)
- [Cấu hình môi trường](#cấu-hình-môi-trường)
- [Các dịch vụ](#các-dịch-vụ)
- [Kiểm tra health check](#kiểm-tra-health-check)
- [Quản lý dữ liệu](#quản-lý-dữ-liệu)
- [Troubleshooting](#troubleshooting)

## 🎯 Giới thiệu

Smart-Forecast là hệ thống giám sát và cảnh báo môi trường đô thị sử dụng công nghệ FIWARE và các công nghệ hiện đại:

- **Backend**: NestJS (Node.js)
- **Web Frontend**: Next.js
- **Mobile App**: Expo (React Native)
- **Context Broker**: FIWARE Orion-LD
- **Databases**: PostgreSQL, MongoDB
- **Object Storage**: MinIO
- **Data Sink**: Cygnus

## 🏗️ Kiến trúc hệ thống

```
┌─────────────────┐     ┌─────────────────┐
│   Mobile App    │     │   Web Frontend  │
│   (Expo)        │     │   (Next.js)     │
└────────┬────────┘     └────────┬────────┘
         │                       │
         └───────────┬───────────┘
                     │
              ┌──────▼──────┐
              │   Backend   │
              │  (NestJS)   │
              └──────┬──────┘
                     │
         ┌───────────┼───────────┐
         │           │           │
    ┌────▼───┐  ┌───▼────┐ ┌───▼────┐
    │ Orion  │  │Postgres│ │ MinIO  │
    │  -LD   │  │   DB   │ │Storage │
    └────┬───┘  └────────┘ └────────┘
         │
    ┌────▼────┐
    │ MongoDB │
    └─────────┘
         │
    ┌────▼────┐
    │ Cygnus  │
    │  Sink   │
    └─────────┘
```

## 💻 Yêu cầu hệ thống

### Phần mềm cần thiết:

- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0
- **Git**: Để clone repository
- **Node.js**: >= 18.x (nếu chạy development local)

### Kiểm tra version:

```bash
docker --version
docker-compose --version
git --version
```

## 🚀 Cài đặt và chạy

### 1️⃣ Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 2️⃣ Cấu hình môi trường

Tạo file `.env` từ template:

```bash
cp .env.example .env
```

Chỉnh sửa file `.env` với các thông tin cần thiết:

```bash
# Cấu hình cơ bản (có thể giữ nguyên cho development)
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=smart_forecast_db

MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# Cấu hình API keys (cần đăng ký tài khoản)
OPENAQ_API_KEY=your_openaq_api_key_here
OWM_API_KEY=your_openweathermap_api_key_here

# JWT Secret (nên thay đổi trong production)
JWT_SECRET=your_very_secure_jwt_secret_key_change_this_in_production
```

### 3️⃣ Khởi động các dịch vụ

#### Chạy tất cả dịch vụ:

```bash
docker-compose up -d
```

#### Chạy các dịch vụ cụ thể:

```bash
# Chỉ chạy FIWARE stack
docker-compose up -d orion mongodb

# Chạy cơ sở dữ liệu
docker-compose up -d postgres mongodb minio

# Chạy với logs để debug
docker-compose up orion mongodb postgres
```

### 4️⃣ Kiểm tra trạng thái

```bash
# Xem trạng thái các container
docker-compose ps

# Xem logs của tất cả services
docker-compose logs

# Xem logs của service cụ thể
docker-compose logs -f orion
docker-compose logs -f postgres
docker-compose logs -f cygnus
```

### 5️⃣ Dừng các dịch vụ

```bash
# Dừng tất cả services (giữ data)
docker-compose down

# Dừng và xóa tất cả data
docker-compose down -v

# Dừng và xóa images
docker-compose down --rmi all
```

## ⚙️ Cấu hình môi trường

### Các biến môi trường quan trọng:

| Biến                  | Mô tả                  | Giá trị mặc định  |
| --------------------- | ---------------------- | ----------------- |
| `POSTGRES_USER`       | Username PostgreSQL    | admin             |
| `POSTGRES_PASSWORD`   | Password PostgreSQL    | admin             |
| `POSTGRES_DB`         | Tên database           | smart_forecast_db |
| `MINIO_ROOT_USER`     | MinIO admin user       | minioadmin        |
| `MINIO_ROOT_PASSWORD` | MinIO admin password   | minioadmin        |
| `OPENAQ_API_KEY`      | API key OpenAQ         | -                 |
| `OWM_API_KEY`         | API key OpenWeatherMap | -                 |
| `JWT_SECRET`          | Secret key cho JWT     | -                 |

### Lấy API Keys:

1. **OpenAQ API**: Đăng ký tại https://openaq.org/
2. **OpenWeatherMap**: Đăng ký tại https://openweathermap.org/api
3. **Mapbox** (cho frontend): https://www.mapbox.com/

## 🔧 Các dịch vụ

### FIWARE Orion-LD Context Broker

- **Port**: 1026
- **URL**: http://localhost:1026
- **Health Check**: http://localhost:1026/version
- **Mô tả**: Quản lý context data theo chuẩn NGSI-LD

### MongoDB

- **Port**: 27017
- **Mô tả**: Database cho Orion Context Broker

### PostgreSQL

- **Port**: 5432
- **Username**: admin (hoặc theo `.env`)
- **Password**: admin (hoặc theo `.env`)
- **Database**: smart_forecast_db
- **Mô tả**: Lưu trữ dữ liệu lịch sử và dữ liệu ứng dụng

### MinIO (Object Storage)

- **API Port**: 9000
- **Console Port**: 9001
- **Console URL**: http://localhost:9001
- **Username**: minioadmin (hoặc theo `.env`)
- **Password**: minioadmin (hoặc theo `.env`)
- **Mô tả**: Lưu trữ file, ảnh, video của incidents

### Cygnus (Data Sink)

- **Port**: 5080
- **Health Check**: http://localhost:5080/v1/version
- **Mô tả**: Đồng bộ dữ liệu từ Orion sang PostgreSQL

### Backend API (NestJS) - Đang development

- **Port**: 8000
- **URL**: http://localhost:8000
- **API Docs**: http://localhost:8000/api
- **Mô tả**: RESTful API cho ứng dụng

## 🏥 Kiểm tra Health Check

Tất cả services đều có health check tự động. Kiểm tra trạng thái:

```bash
# Xem health status của tất cả containers
docker-compose ps

# Kiểm tra chi tiết một container
docker inspect --format='{{json .State.Health}}' orion

# Kiểm tra thủ công từng service
curl http://localhost:1026/version        # Orion
curl http://localhost:5080/v1/version     # Cygnus
curl http://localhost:9000/minio/health/live  # MinIO
```

### Health Check Configuration:

- **Interval**: 30 giây - Kiểm tra mỗi 30 giây
- **Timeout**: 10 giây - Timeout sau 10 giây
- **Retries**: 3 lần - Thử lại 3 lần trước khi báo unhealthy
- **Start Period**: 40-60 giây - Thời gian khởi động

## 📊 Quản lý dữ liệu

### Truy cập MinIO Console:

1. Mở browser: http://localhost:9001
2. Đăng nhập với credentials từ `.env`
3. Tạo bucket `incidents` nếu chưa có

### Kết nối PostgreSQL:

```bash
# Sử dụng psql
docker exec -it postgres psql -U admin -d smart_forecast_db

# Hoặc dùng GUI tool
# Host: localhost
# Port: 5432
# Username: admin
# Password: admin
# Database: smart_forecast_db
```

### Kết nối MongoDB:

```bash
# Sử dụng mongo shell
docker exec -it mongodb mongo

# Hoặc dùng MongoDB Compass
# Connection string: mongodb://localhost:27017
```

### Backup & Restore:

```bash
# Backup PostgreSQL
docker exec postgres pg_dump -U admin smart_forecast_db > backup.sql

# Restore PostgreSQL
docker exec -i postgres psql -U admin smart_forecast_db < backup.sql

# Backup MongoDB
docker exec mongodb mongodump --out /backup

# Restore MongoDB
docker exec mongodb mongorestore /backup
```

## 🔍 Troubleshooting

### Container không start được:

```bash
# Xem logs chi tiết
docker-compose logs <service-name>

# Restart một service
docker-compose restart <service-name>

# Rebuild và restart
docker-compose up -d --build <service-name>
```

### Port bị conflict:

Nếu port đã được sử dụng, sửa trong `docker-compose.yml`:

```yaml
ports:
  - "5433:5432" # Thay đổi port bên trái
```

### Xóa tất cả và start lại:

```bash
# Dừng và xóa tất cả
docker-compose down -v

# Xóa images (optional)
docker-compose down --rmi all

# Start lại
docker-compose up -d
```

### Health check failed:

```bash
# Kiểm tra logs
docker-compose logs <service-name>

# Restart service
docker-compose restart <service-name>

# Tăng start_period trong docker-compose.yml nếu cần
```

### Vấn đề với volumes:

```bash
# List volumes
docker volume ls

# Remove specific volume
docker volume rm smart-forecast_postgres_data

# Remove all unused volumes
docker volume prune
```

## 📚 Tài liệu thêm

- [FIWARE Orion-LD Documentation](https://fiware-orion.readthedocs.io/)
- [Cygnus Documentation](https://fiware-cygnus.readthedocs.io/)
- [MinIO Documentation](https://min.io/docs/minio/linux/index.html)
- [NestJS Documentation](https://docs.nestjs.com/)
- [Next.js Documentation](https://nextjs.org/docs)
- [Expo Documentation](https://docs.expo.dev/)

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 👥 Team

NEU-DataVerse Team

---

**Note**: Đây là project đang trong giai đoạn phát triển. Một số tính năng có thể chưa hoàn thiện.
