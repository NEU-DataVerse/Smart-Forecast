# 📱 Smart Forecast Mobile App

Ứng dụng di động Smart Forecast được xây dựng với **React Native** và **Expo**, cho phép người dùng theo dõi thời tiết, chất lượng không khí, nhận cảnh báo môi trường và báo cáo sự cố.

Có thể tải file APK về qua: https://expo.dev/accounts/nguyenthanhdatndc/projects/smart-forecast/builds/50f7c6dc-448e-428e-b872-6429e0129f76

## 📋 Mục lục

- [Yêu cầu hệ thống](#-yêu-cầu-hệ-thống)
- [Cài đặt](#-cài-đặt)
- [Cấu hình môi trường](#-cấu-hình-môi-trường)
- [Chạy ứng dụng](#-chạy-ứng-dụng)
- [Cấu trúc dự án](#-cấu-trúc-dự-án)
- [Tính năng chính](#-tính-năng-chính)
- [Xử lý sự cố](#-xử-lý-sự-cố)

---

## 💻 Yêu cầu hệ thống

Trước khi bắt đầu, đảm bảo bạn đã cài đặt:

- **Node.js** >= 18.x ([Tải tại đây](https://nodejs.org/))
- **pnpm** >= 8.x (package manager của dự án)
  ```bash
  npm install -g pnpm
  ```
- **Git** ([Tải tại đây](https://git-scm.com/))
- **Android Studio** (để chạy trên Android Emulator) hoặc thiết bị Android thật

---

## 🚀 Cài đặt

### 1. Clone repository

```bash
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast
```

### 2. Cài đặt dependencies

Từ **thư mục gốc** của dự án (Smart-Forecast):

```bash
pnpm install
```

Lệnh này sẽ cài đặt dependencies cho toàn bộ monorepo, bao gồm cả mobile app.

### 3. Di chuyển vào thư mục mobile

```bash
cd mobile
```

---

## ⚙️ Cấu hình môi trường

### 1. Tạo file `.env`

Sao chép file mẫu:

```bash
cp .env.example .env
```

### 2. Chỉnh sửa file `.env`

Mở file `.env` và cấu hình các biến môi trường:

```dotenv
# ====== Backend API URL ======
# Địa chỉ API backend - thay đổi IP theo máy chủ của bạn
EXPO_PUBLIC_API_URL=http://192.168.1.xxx:8000/api/v1

# ====== MinIO Storage URL ======
# Địa chỉ lưu trữ ảnh MinIO
EXPO_PUBLIC_MINIO_URL=http://192.168.1.xxx:9000

# ====== Google OAuth ======
# Web Client ID từ Google Cloud Console (dùng cho đăng nhập Google)
EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID=your-google-client-id.apps.googleusercontent.com
```

> ⚠️ **Lưu ý quan trọng:**
>
> - Thay `192.168.1.xxx` bằng địa chỉ IP của máy chạy backend
> - Nếu chạy trên Android Emulator và backend ở localhost, dùng `10.0.2.2` thay vì `localhost`
> - Nếu chạy trên thiết bị thật, phải dùng IP LAN của máy chạy backend, và phải chung một mạng Internet

### 3. Cấu hình Google Sign-In (tùy chọn)

Để sử dụng đăng nhập Google, bạn cần:

1. Tạo project trên [Google Cloud Console](https://console.cloud.google.com/)
2. Bật **Google Sign-In API**
3. Tạo **OAuth 2.0 Client ID** cho Web và Android
4. Thêm Web Client ID vào file `.env`
5. Cập nhật file `google-services.json` cho Android

---

## ▶️ Chạy ứng dụng

### Build APK cho Android

````bash
# Build development APK
eas build --profile development --platform android

### Chạy trực tiếp trên thiết bị, sau khi tải apk về máy:

```bash
# Android
npx expo start

---

## 📁 Cấu trúc dự án

````

mobile/
├── app/ # Màn hình ứng dụng (file-based routing)
│ ├── \_layout.tsx # Layout chính
│ ├── login.tsx # Màn hình đăng nhập
│ └── (tabs)/ # Tab navigation
│ ├── index.tsx # Trang chủ - Thời tiết & AQI
│ ├── alerts.tsx # Danh sách cảnh báo
│ ├── map.tsx # Bản đồ cảnh báo
│ ├── report.tsx # Báo cáo sự cố
│ └── profile.tsx # Hồ sơ người dùng
├── components/ # Components tái sử dụng
│ ├── AlertCard.tsx # Card hiển thị cảnh báo
│ ├── AlertMap.tsx # Bản đồ với markers cảnh báo
│ └── EnvCard.tsx # Card hiển thị dữ liệu môi trường
├── context/ # React Context
│ ├── AuthContext.tsx # Xử lý authentication
│ └── NotificationContext.tsx # Xử lý push notifications
├── hooks/ # Custom hooks
│ ├── useAlerts.ts # Hook lấy dữ liệu cảnh báo
│ └── use-color-scheme.ts # Hook theme sáng/tối
├── services/ # API services
│ └── api.ts # Gọi API backend
├── store/ # State management (Zustand)
│ └── appStore.ts # Global state
├── constants/ # Hằng số
│ ├── colors.ts # Bảng màu
│ └── theme.ts # Theme config
├── types/ # TypeScript types
├── utils/ # Utilities
├── .env # Biến môi trường (không commit)
├── .env.example # Mẫu biến môi trường
├── app.config.ts # Cấu hình Expo
└── package.json # Dependencies

````

---

## ✨ Tính năng chính

| Tính năng                   | Mô tả                                                        |
| --------------------------- | ------------------------------------------------------------ |
| 🌤️ **Thời tiết**            | Xem nhiệt độ, độ ẩm, gió, áp suất từ trạm quan trắc gần nhất |
| 🌫️ **Chất lượng không khí** | AQI, PM2.5, PM10 theo thời gian thực                         |
| 🚨 **Cảnh báo**             | Nhận thông báo về thiên tai, ô nhiễm, thời tiết xấu          |
| 🗺️ **Bản đồ**               | Xem vùng ảnh hưởng của cảnh báo trên bản đồ                  |
| 📝 **Báo cáo sự cố**        | Gửi báo cáo lũ lụt, sạt lở, ô nhiễm kèm ảnh                  |
| 🔐 **Đăng nhập Google**     | Xác thực an toàn qua Google OAuth                            |
| 📴 **Hỗ trợ offline**       | Cache dữ liệu và queue báo cáo khi mất mạng                  |

---

## 🔧 Xử lý sự cố

### Lỗi "Network Error" hoặc "Request failed"

1. Kiểm tra backend đã chạy chưa
2. Kiểm tra IP trong `.env` có đúng không
3. Đảm bảo thiết bị/emulator và backend cùng mạng LAN

### Lỗi 401 Unauthorized

1. Kiểm tra đã đăng nhập chưa
2. Token có thể hết hạn - đăng xuất và đăng nhập lại

### Google Sign-In không hoạt động

1. Kiểm tra `EXPO_PUBLIC_GOOGLE_WEB_CLIENT_ID` trong `.env`
2. Đảm bảo `google-services.json` đúng cho package name `app.smartforecast`
3. Cần build development client (không dùng được với Expo Go)

### Không nhận được Push Notification

1. Push notifications không hoạt động trên emulator/simulator
2. Cần test trên thiết bị thật
3. Kiểm tra quyền thông báo đã được cấp

### Clear cache khi gặp lỗi lạ

```bash
# Clear Expo cache
npx expo start --clear

# Clear node_modules và cài lại
rm -rf node_modules
pnpm install
````

---

## 📚 Tài liệu tham khảo

- [Expo Documentation](https://docs.expo.dev/)
- [React Native Documentation](https://reactnative.dev/)
- [Expo Router](https://docs.expo.dev/router/introduction/)
- [TanStack Query](https://tanstack.com/query/latest)
- [Zustand](https://zustand-demo.pmnd.rs/)

---

## 🤝 Đóng góp

Xem hướng dẫn đóng góp tại [CONTRIBUTING.md](../CONTRIBUTING.md) ở thư mục gốc dự án.

---

**Smart Forecast Team** - NEU DataVerse 🚀
