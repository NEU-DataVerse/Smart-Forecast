# 📋 Changelog

Tất cả các thay đổi đáng chú ý của dự án sẽ được ghi lại trong file này.

Định dạng dựa trên [Keep a Changelog](https://keepachangelog.com/vi/1.0.0/),
và dự án tuân thủ [Semantic Versioning](https://semver.org/lang/vi/).

## [Unreleased]

### Đang phát triển

- Widget cho ứng dụng mobile
- Tích hợp thêm nguồn dữ liệu môi trường

---

## [1.0.0] - 2025-12-XX

### 🎉 Ra mắt phiên bản đầu tiên

Phiên bản đầu tiên của Smart Forecast - Nền tảng giám sát và cảnh báo môi trường đô thị thông minh.

### ✨ Tính năng mới (Added)

#### Backend (NestJS)

- API RESTful với Swagger documentation
- Xác thực JWT với Google OAuth2
- Thu thập dữ liệu từ OpenWeatherMap API
- Tích hợp FIWARE Orion-LD Context Broker (NGSI-LD)
- Lưu trữ dữ liệu lịch sử với PostgreSQL
- Quản lý file với MinIO (S3-compatible)
- Push notifications với Firebase Cloud Messaging
- Hệ thống cảnh báo tự động
- Quản lý báo cáo sự cố từ người dân
- Xuất báo cáo PDF/CSV

#### Web Dashboard (Next.js)

- Dashboard quản trị với biểu đồ thời gian thực
- Bản đồ cảm biến môi trường
- Quản lý và gửi cảnh báo đô thị
- Xem và xử lý báo cáo sự cố
- Thống kê AQI, nhiệt độ, thời tiết
- Xuất báo cáo theo tháng/quý/năm
- Responsive design với Tailwind CSS

#### Mobile App (Expo)

- Đăng nhập/đăng ký với Google OAuth2
- Xem dữ liệu môi trường theo vị trí GPS
- Bản đồ đô thị (Live Map)
- Nhận push notifications cảnh báo
- Gửi báo cáo sự cố với ảnh và vị trí
- Lịch sử cảnh báo và báo cáo đã gửi

#### DevOps & Infrastructure

- Docker Compose cho toàn bộ hệ thống
- PNPM Monorepo workspace
- Shared TypeScript package
- Scripts tự động hóa (setup, migration)
- Health checks cho tất cả services

### 🔧 Cấu hình (Configuration)

- Hỗ trợ environment variables cho từng layer
- Tách biệt config: Docker, Backend, Web, Mobile
- File `.env.example` mẫu đầy đủ

### 📚 Tài liệu (Documentation)

- README.md với badges và hướng dẫn
- CONTRIBUTING.md hướng dẫn đóng góp
- CODE_OF_CONDUCT.md quy tắc ứng xử
- QUICKSTART.md hướng dẫn cài đặt nhanh
- CHEATSHEET.md các lệnh thường dùng

---

## Quy ước phiên bản

- **MAJOR** (X.0.0): Thay đổi không tương thích ngược
- **MINOR** (0.X.0): Tính năng mới, tương thích ngược
- **PATCH** (0.0.X): Sửa lỗi, tương thích ngược

---

## Links

- [Unreleased]: https://github.com/NEU-DataVerse/Smart-Forecast/compare/v1.0.0...HEAD
- [1.0.0]: https://github.com/NEU-DataVerse/Smart-Forecast/releases/tag/v1.0.0
