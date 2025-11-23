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

> 📖 **New to the project?** Check out:
>
> - [MONOREPO_MIGRATION_SUMMARY.md](docs/MONOREPO_MIGRATION_SUMMARY.md) - PNPM monorepo migration overview
> - [DEVELOPMENT_GUIDE.md](docs/DEVELOPMENT_GUIDE.md) - Comprehensive development guide
> - [AUTOMATION_GUIDE.md](docs/AUTOMATION_GUIDE.md) - Makefile and scripts guide

## 🎯 Giới thiệu

Smart-Forecast là hệ thống giám sát và cảnh báo môi trường đô thị sử dụng công nghệ FIWARE và các công nghệ hiện đại:

- **Backend**: NestJS (Node.js)
- **Web Frontend**: Next.js
- **Mobile App**: Expo (React Native)
- **Context Broker**: FIWARE Orion-LD
- **Databases**: PostgreSQL, MongoDB
- **Object Storage**: MinIO
- **Data Persistence**: Native NestJS Service

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
              │   Backend   │◄─── NGSI-LD Notifications
              │  (NestJS)   │     (Native Persistence)
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
```

## 💻 Yêu cầu hệ thống

### Phần mềm cần thiết:

- **Docker**: >= 20.10
- **Docker Compose**: >= 2.0
- **Git**: Để clone repository
- **Node.js**: >= 20.x (cho development)
- **pnpm**: >= 8.x (package manager cho monorepo)

### Kiểm tra version:

```bash
docker --version
docker-compose --version
git --version
node --version
pnpm --version
```

### Cài đặt pnpm:

```bash
# Sử dụng npm (đã có sẵn với Node.js)
npm install -g pnpm

# Hoặc sử dụng các phương pháp khác:
# Windows (PowerShell)
iwr https://get.pnpm.io/install.ps1 -useb | iex

# macOS/Linux
curl -fsSL https://get.pnpm.io/install.sh | sh -

# Xem thêm: https://pnpm.io/installation
```

## 🚀 Cài đặt và chạy

### 1️⃣ Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 1.5️⃣ Cài đặt dependencies (cho development)

```bash
# Cài đặt tất cả dependencies cho monorepo
pnpm install

# Build shared package (cần thiết trước khi chạy backend/web/mobile)
pnpm run build:shared
```

### 2️⃣ Cấu hình môi trường

Hệ thống sử dụng cấu trúc environment variables được tách biệt cho từng layer:

```bash
# Tự động copy tất cả file .env.example (khuyến nghị)
bash scripts/setup.sh  # Linux/Mac/Git Bash
# hoặc
scripts\setup.bat      # Windows

# Hoặc copy thủ công từng file:
cp docker/.env.infrastructure.example docker/.env.infrastructure
cp backend/.env.example backend/.env
cp web/.env.local.example web/.env.local
cp mobile/.env.example mobile/.env
```

**Cấu trúc environment files:**

- `docker/.env.infrastructure` - Biến cho Docker services (PostgreSQL, MongoDB, MinIO, Orion-LD)
- `backend/.env` - Biến cho NestJS backend (API keys, database connection strings)
- `web/.env.local` - Biến public cho Next.js frontend (chỉ `NEXT_PUBLIC_*`)
- `mobile/.env` - Biến public cho Expo app (chỉ `EXPO_PUBLIC_*`)

**Chỉnh sửa các file sau khi copy:**

```bash
# backend/.env - Cấu hình API key
OPENWEATHER_API_KEY=your_openweathermap_api_key_here
JWT_SECRET=change_this_to_secure_random_string

# mobile/.env - Thay YOUR_LOCAL_IP bằng IP máy của bạn (không dùng localhost)
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api/v1
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
docker-compose logs -f minio
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

## ⚙️ Cấu hình môi trường chi tiết

### Environment Files Structure:

```
Smart-Forecast/
├── docker/.env.infrastructure     # Docker services config
├── backend/.env                   # Backend API config
├── web/.env.local                 # Web frontend config
└── mobile/.env                    # Mobile app config
```

### Các biến môi trường theo layer:

**Docker Infrastructure (`docker/.env.infrastructure`):**

| Biến                         | Mô tả                | Giá trị mặc định  |
| ---------------------------- | -------------------- | ----------------- |
| `POSTGRES_USER`              | PostgreSQL username  | admin             |
| `POSTGRES_PASSWORD`          | PostgreSQL password  | admin             |
| `POSTGRES_DB`                | Database name        | smart_forecast_db |
| `MONGO_INITDB_ROOT_USERNAME` | MongoDB username     | admin             |
| `MONGO_INITDB_ROOT_PASSWORD` | MongoDB password     | admin             |
| `MINIO_ROOT_USER`            | MinIO admin user     | minioadmin        |
| `MINIO_ROOT_PASSWORD`        | MinIO admin password | minioadmin        |
| `ORION_LOG_LEVEL`            | Orion log level      | DEBUG             |

**Backend (`backend/.env`):**

| Biến                  | Mô tả                        | Giá trị mặc định                                             |
| --------------------- | ---------------------------- | ------------------------------------------------------------ |
| `DATABASE_URL`        | PostgreSQL connection string | postgresql://admin:admin@localhost:5432/smart_forecast_db    |
| `MONGO_URL`           | MongoDB connection string    | mongodb://admin:admin@localhost:27017/orion?authSource=admin |
| `OPENWEATHER_API_KEY` | OpenWeatherMap API key       | (cần đăng ký)                                                |
| `JWT_SECRET`          | JWT signing secret           | (đổi trong production)                                       |
| `MINIO_ACCESS_KEY`    | MinIO access key             | minioadmin                                                   |
| `MINIO_SECRET_KEY`    | MinIO secret key             | minioadmin                                                   |

**Web Frontend (`web/.env.local`):**

| Biến                    | Mô tả             | Giá trị mặc định             |
| ----------------------- | ----------------- | ---------------------------- |
| `NEXT_PUBLIC_API_URL`   | Backend API URL   | http://localhost:8000/api/v1 |
| `NEXT_PUBLIC_MINIO_URL` | MinIO storage URL | http://localhost:9000        |

**Mobile App (`mobile/.env`):**

| Biến                    | Mô tả                  | Giá trị mặc định                 |
| ----------------------- | ---------------------- | -------------------------------- |
| `EXPO_PUBLIC_API_URL`   | Backend API URL        | http://YOUR_LOCAL_IP:8000/api/v1 |
| `EXPO_PUBLIC_MINIO_URL` | MinIO storage URL      | http://YOUR_LOCAL_IP:9000        |
| `OWM_API_KEY`           | API key OpenWeatherMap | -                                |
| `JWT_SECRET`            | Secret key cho JWT     | -                                |

### Lấy API Keys:

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

### Backend API (NestJS)

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
curl http://localhost:8000/api/v1         # Backend
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
  - '5433:5432' # Thay đổi port bên trái
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
