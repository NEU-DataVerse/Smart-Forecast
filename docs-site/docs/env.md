---
sidebar_position: 9
title: Biến môi trường
---

# ⚙️ Biến môi trường

Hướng dẫn cấu hình biến môi trường cho Smart Forecast.

---

## 📁 Cấu trúc files

```
Smart-Forecast/
├── docker/
│   ├── .env.infrastructure         # Docker services
│   └── .env.infrastructure.example
├── backend/
│   ├── .env                        # Backend API
│   └── .env.example
├── web/
│   ├── .env.local                  # Web frontend
│   └── .env.local.example
└── mobile/
    ├── .env                        # Mobile app
    └── .env.example
```

---

## 🐳 Docker Infrastructure

**File:** `docker/.env.infrastructure`

```bash
# ==========================================
# PostgreSQL Configuration
# ==========================================
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin
POSTGRES_DB=smart_forecast_db

# ==========================================
# MongoDB Configuration (for Orion-LD)
# ==========================================
MONGO_INITDB_ROOT_USERNAME=admin
MONGO_INITDB_ROOT_PASSWORD=admin

# ==========================================
# MinIO Configuration
# ==========================================
MINIO_ROOT_USER=minioadmin
MINIO_ROOT_PASSWORD=minioadmin

# ==========================================
# Orion-LD Configuration
# ==========================================
ORION_LOG_LEVEL=DEBUG
```

### Giải thích

| Biến                         | Mô tả               | Giá trị mặc định    |
| ---------------------------- | ------------------- | ------------------- |
| `POSTGRES_USER`              | Username PostgreSQL | `admin`             |
| `POSTGRES_PASSWORD`          | Password PostgreSQL | `admin`             |
| `POSTGRES_DB`                | Tên database        | `smart_forecast_db` |
| `MONGO_INITDB_ROOT_USERNAME` | Username MongoDB    | `admin`             |
| `MONGO_INITDB_ROOT_PASSWORD` | Password MongoDB    | `admin`             |
| `MINIO_ROOT_USER`            | Username MinIO      | `minioadmin`        |
| `MINIO_ROOT_PASSWORD`        | Password MinIO      | `minioadmin`        |
| `ORION_LOG_LEVEL`            | Log level Orion-LD  | `DEBUG`             |

---

## 🔧 Backend

**File:** `backend/.env`

```bash
# ==========================================
# Application Configuration
# ==========================================
NODE_ENV=development
PORT=8000

# ==========================================
# Database - PostgreSQL
# ==========================================
DATABASE_URL=postgresql://admin:admin@localhost:5432/smart_forecast_db

# ==========================================
# MongoDB - Orion-LD
# ==========================================
MONGO_URL=mongodb://admin:admin@localhost:27017/orion?authSource=admin

# ==========================================
# Orion-LD Context Broker
# ==========================================
ORION_LD_URL=http://localhost:1026

# ==========================================
# JWT Authentication
# ==========================================
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=7d

# ==========================================
# MinIO Object Storage
# ==========================================
MINIO_ENDPOINT=localhost
MINIO_PORT=9000
MINIO_ACCESS_KEY=minioadmin
MINIO_SECRET_KEY=minioadmin
MINIO_USE_SSL=false
MINIO_BUCKET_NAME=smart-forecast

# ==========================================
# OpenWeatherMap API
# ==========================================
OPENWEATHER_API_KEY=your_openweathermap_api_key

# ==========================================
# Firebase Cloud Messaging
# ==========================================
FIREBASE_PROJECT_ID=your-firebase-project-id
FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com

# ==========================================
# Google OAuth (Optional)
# ==========================================
GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your-google-client-secret
```

### Giải thích

| Biến                  | Mô tả                        | Bắt buộc      |
| --------------------- | ---------------------------- | ------------- |
| `NODE_ENV`            | Môi trường chạy              | ✅            |
| `PORT`                | Port backend API             | ✅            |
| `DATABASE_URL`        | Connection string PostgreSQL | ✅            |
| `MONGO_URL`           | Connection string MongoDB    | ✅            |
| `ORION_LD_URL`        | URL Orion-LD Context Broker  | ✅            |
| `JWT_SECRET`          | Secret key cho JWT           | ✅            |
| `JWT_EXPIRES_IN`      | Thời gian hết hạn JWT        | ✅            |
| `MINIO_*`             | Cấu hình MinIO               | ✅            |
| `OPENWEATHER_API_KEY` | API key OpenWeatherMap       | ✅            |
| `FIREBASE_*`          | Cấu hình Firebase FCM        | ❌ (optional) |
| `GOOGLE_*`            | Cấu hình Google OAuth        | ❌ (optional) |

---

## 🌐 Web Frontend

**File:** `web/.env.local`

```bash
# ==========================================
# API Configuration
# ==========================================
NEXT_PUBLIC_API_URL=http://localhost:8000/api/v1

# ==========================================
# MinIO Configuration
# ==========================================
NEXT_PUBLIC_MINIO_URL=http://localhost:9000

# ==========================================
# MapBox (Optional)
# ==========================================
NEXT_PUBLIC_MAPBOX_TOKEN=your_mapbox_token

# ==========================================
# Google OAuth (Optional)
# ==========================================
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

### Giải thích

| Biến                           | Mô tả                  | Bắt buộc |
| ------------------------------ | ---------------------- | -------- |
| `NEXT_PUBLIC_API_URL`          | URL Backend API        | ✅       |
| `NEXT_PUBLIC_MINIO_URL`        | URL MinIO              | ✅       |
| `NEXT_PUBLIC_MAPBOX_TOKEN`     | Token MapBox           | ❌       |
| `NEXT_PUBLIC_GOOGLE_CLIENT_ID` | Google OAuth Client ID | ❌       |

:::info Lưu ý
Trong Next.js, chỉ những biến có prefix `NEXT_PUBLIC_` mới được expose cho client-side code.
:::

---

## 📱 Mobile App

**File:** `mobile/.env`

```bash
# ==========================================
# API Configuration
# ==========================================
# QUAN TRỌNG: KHÔNG DÙNG LOCALHOST!
# Thay YOUR_IP bằng IP máy của bạn
# Windows: ipconfig
# macOS/Linux: ifconfig
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api/v1

# ==========================================
# MinIO Configuration
# ==========================================
EXPO_PUBLIC_MINIO_URL=http://192.168.1.100:9000

# ==========================================
# Google OAuth (Optional)
# ==========================================
EXPO_PUBLIC_GOOGLE_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_IOS=your-ios-client-id.apps.googleusercontent.com
EXPO_PUBLIC_GOOGLE_CLIENT_ID_ANDROID=your-android-client-id.apps.googleusercontent.com
```

### Giải thích

| Biến                    | Mô tả                   | Bắt buộc |
| ----------------------- | ----------------------- | -------- |
| `EXPO_PUBLIC_API_URL`   | URL Backend API         | ✅       |
| `EXPO_PUBLIC_MINIO_URL` | URL MinIO               | ✅       |
| `EXPO_PUBLIC_GOOGLE_*`  | Google OAuth Client IDs | ❌       |

:::warning Lưu ý quan trọng
Mobile app chạy trên thiết bị riêng (điện thoại/emulator), **KHÔNG THỂ** truy cập `localhost` của máy development.

Phải dùng **IP thực** của máy development:

```bash
# Tìm IP
# Windows
ipconfig

# macOS/Linux
ifconfig
```

Ví dụ: Nếu IP là `192.168.1.100`:

```bash
EXPO_PUBLIC_API_URL=http://192.168.1.100:8000/api/v1
```

:::

---

## 🔐 API Keys cần thiết

### OpenWeatherMap API

1. Đăng ký tại [OpenWeatherMap](https://openweathermap.org/api)
2. Lấy API key từ dashboard
3. Thêm vào `backend/.env`:
   ```bash
   OPENWEATHER_API_KEY=your_api_key
   ```

### Firebase Cloud Messaging (FCM)

1. Tạo project tại [Firebase Console](https://console.firebase.google.com/)
2. Vào **Project Settings** → **Service Accounts**
3. Click **Generate new private key**
4. Thêm thông tin vào `backend/.env`:
   ```bash
   FIREBASE_PROJECT_ID=your-project-id
   FIREBASE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
   FIREBASE_CLIENT_EMAIL=firebase-adminsdk-xxx@your-project.iam.gserviceaccount.com
   ```

### Google OAuth (Optional)

1. Vào [Google Cloud Console](https://console.cloud.google.com/)
2. Tạo OAuth 2.0 Client IDs
3. Xem chi tiết tại [Google OAuth Setup Guide](https://github.com/NEU-DataVerse/Smart-Forecast/blob/main/docs/GOOGLE_OAUTH_SETUP.md)

---

## 🔒 Security Best Practices

### ✅ DO

- Sử dụng connection string thay vì raw credentials
- Thay đổi `JWT_SECRET` trong production
- Sử dụng strong passwords cho databases
- Giới hạn CORS origins trong production
- Rotate API keys định kỳ

### ❌ DON'T

- Commit file `.env` vào Git
- Sử dụng credentials mặc định trong production
- Share API keys giữa các environments
- Expose backend secrets cho frontend

### Ví dụ `.gitignore`

```gitignore
# Environment files
.env
.env.local
.env.*.local
*.env

# Except examples
!.env.example
!.env.*.example
```

---

## 🚀 Production Configuration

### Backend Production

```bash
NODE_ENV=production
PORT=8000

# Strong credentials
DATABASE_URL=postgresql://prod_user:StrongP@ssw0rd!@db.example.com:5432/smart_forecast

# Long, random JWT secret
JWT_SECRET=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6

# SSL for MinIO
MINIO_USE_SSL=true
MINIO_ENDPOINT=s3.example.com
```

### Web Production

```bash
NEXT_PUBLIC_API_URL=https://api.smartforecast.example.com/api/v1
NEXT_PUBLIC_MINIO_URL=https://s3.smartforecast.example.com
```

---

## 📖 Tiếp theo

- [Hướng dẫn phát triển](./dev-guide) - Development workflow
- [Triển khai](./deployment) - Docker Compose setup
- [Troubleshooting](./troubleshooting) - Xử lý lỗi
