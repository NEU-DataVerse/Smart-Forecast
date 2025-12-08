<p align="center">
  <img src="docs-site/static/img/logo-1.png" alt="Smart Forecast Logo" width="240"/>
</p>

<p align="center">
  <strong>Nền tảng giám sát và cảnh báo môi trường đô thị thông minh</strong>
</p>

<p align="center">
  <em>"Khi dữ liệu mở trở thành cảnh báo sớm cho cộng đồng"</em>
</p>

<p align="center">
  <a href="LICENSE"><img src="https://img.shields.io/badge/license-MIT-green?style=flat-square" alt="License: MIT"></a>
  <img src="https://img.shields.io/badge/version-1.0.0-blue?style=flat-square" alt="Version">
  <img src="https://img.shields.io/badge/OLP'2025-Dữ%20liệu%20mở%20liên%20kết-orange?style=flat-square" alt="OLP 2025">
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Node.js-%3E%3D18-339933?style=flat-square&logo=node.js&logoColor=white" alt="Node.js">
  <img src="https://img.shields.io/badge/NestJS-11-E0234E?style=flat-square&logo=nestjs&logoColor=white" alt="NestJS">
  <img src="https://img.shields.io/badge/Next.js-15-000000?style=flat-square&logo=next.js&logoColor=white" alt="Next.js">
  <img src="https://img.shields.io/badge/Expo-54-000020?style=flat-square&logo=expo&logoColor=white" alt="Expo">
  <img src="https://img.shields.io/badge/Docker-Compose-2496ED?style=flat-square&logo=docker&logoColor=white" alt="Docker">
  <img src="https://img.shields.io/badge/FIWARE-Orion--LD-5DC0CF?style=flat-square" alt="FIWARE">
  <img src="https://img.shields.io/badge/NGSI--LD-Smart%20Data%20Models-FF6F00?style=flat-square" alt="NGSI-LD">
</p>

<p align="center">
  <a href="https://neu-dataverse.github.io/Smart-Forecast/">
    <img src="https://img.shields.io/badge/Documentation-blue?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation"/>
  </a>
  <a href="http://101.96.66.225:8010/api">
    <img src="https://img.shields.io/badge/API_Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="API Swagger"/>
  </a>
  <a href="http://101.96.66.225:8011/dashboard">
    <img src="https://img.shields.io/badge/Web_Dashboard-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Web Dashboard"/>
  </a>
  <a href="https://expo.dev/artifacts/eas/fqtBiW57qjWigg8yaCupZm.apk">
    <img src="https://img.shields.io/badge/Android_App-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Download Android App"/>
  </a>
</p>

---

## 📋 Mục Lục

- [Giới thiệu](#-giới-thiệu)
- [Tính năng](#-tính-năng)
- [Screenshots](#-screenshots)
- [Kiến trúc hệ thống](#-kiến-trúc-hệ-thống)
- [Tech Stack](#-tech-stack)
- [Cài đặt nhanh](#-cài-đặt-nhanh)
- [Tài liệu](#-tài-liệu)
- [Đóng góp](#-đóng-góp)
- [Team NEU-DataVerse](#-team-neu-dataverse)
- [License](#-license)

---

## 🎯 Giới thiệu

**Smart Forecast** là nền tảng **giám sát và cảnh báo môi trường đô thị thông minh**, được phát triển hướng tới hỗ trợ **chuyển đổi số** cho các thành phố hiện đại.

Dự án tham gia cuộc thi **OLP'2025 – Ứng dụng dữ liệu mở liên kết phục vụ chuyển đổi số**, tuân thủ chuẩn **NGSI-LD** và sử dụng **Smart Data Models** của FIWARE.

### 🌟 Ý tưởng cốt lõi

Smart Forecast thu thập dữ liệu **chất lượng không khí (Air Quality)** và **thời tiết (Weather)** từ các nguồn mở như **OpenWeatherMap**, sau đó:

- Phân tích, hiển thị và **cảnh báo tự động** khi vượt ngưỡng
- Cho phép **quản lý** gửi cảnh báo thiên tai, xem báo cáo và thống kê
- Cho phép **người dân** nhận thông báo và **gửi báo cáo sự cố** (ngập lụt, cây đổ, sạt lở...) kèm vị trí GPS và ảnh

---

## ✨ Tính năng

### 📱 Ứng dụng di động (Citizen App)

| Mã  | Chức năng                  | Mô tả                                                |
| --- | -------------------------- | ---------------------------------------------------- |
| C1  | Đăng nhập / Đăng ký        | Xác thực JWT với Google OAuth2                       |
| C2  | Xem dữ liệu môi trường     | Hiển thị AQI, PM2.5, nhiệt độ, độ ẩm theo vị trí GPS |
| C3  | Bản đồ đô thị (Live Map)   | Bản đồ cảnh báo sự cố                                |
| C4  | Nhận cảnh báo tự động      | Push Notification qua Firebase Cloud Messaging       |
| C5  | Gửi báo cáo sự cố          | Chụp ảnh, chọn loại sự cố, nhập mô tả, gửi vị trí    |
| C6  | Lịch sử cảnh báo & báo cáo | Theo dõi các cảnh báo và sự cố đã gửi                |

### 🖥️ Dashboard quản trị (Admin Web)

| Mã  | Chức năng               | Mô tả                                              |
| --- | ----------------------- | -------------------------------------------------- |
| A1  | Đăng nhập quản trị      | Phân quyền Admin/Manager                           |
| A2  | Theo dõi thời gian thực | Bản đồ cảm biến, biểu đồ AQI, nhiệt độ, thời tiết  |
| A3  | Quản lý báo cáo sự cố   | Xem, xác nhận, gán trạng thái xử lý                |
| A4  | Gửi cảnh báo đô thị     | Soạn và gửi cảnh báo tự động đến người dân qua FCM |
| A5  | Xuất báo cáo            | Export thống kê PDF/CSV theo tháng, quý, năm       |

---

## 📸 Screenshots

### 🖥️ Web Dashboard

<p align="center">
  <img src="docs-site/static/img/dashboard-web.png" alt="Dashboard" width="100%"/>
</p>
<p align="center"><em>Trang Dashboard tổng quan - Hiển thị thông tin trạm, cảnh báo, sự cố và chỉ số AQI</em></p>

<p align="center">
  <img src="docs-site/static/img/alert-web.png" alt="Alerts Management" width="49%"/>
  <img src="docs-site/static/img/incident-web.png" alt="Incidents Management" width="49%"/>
</p>
<p align="center"><em>Quản lý cảnh báo (trái) và Quản lý sự cố (phải)</em></p>

<p align="center">
  <img src="docs-site/static/img/map-alert-web.png" alt="Map Alerts" width="49%"/>
  <img src="docs-site/static/img/map-incident-web.png" alt="Map Incidents" width="49%"/>
</p>
<p align="center"><em>Bản đồ cảnh báo (trái) và Bản đồ sự cố (phải)</em></p>

<p align="center">
  <img src="docs-site/static/img/chart-web.png" alt="Charts" width="49%"/>
  <img src="docs-site/static/img/chart-history-web.png" alt="History Charts" width="49%"/>
</p>
<p align="center"><em>Biểu đồ dữ liệu môi trường và lịch sử</em></p>

<p align="center">
  <img src="docs-site/static/img/station-web.png" alt="Stations" width="49%"/>
  <img src="docs-site/static/img/compare-station-web.png" alt="Compare Stations" width="49%"/>
</p>
<p align="center"><em>Danh sách trạm quan trắc và so sánh dữ liệu giữa các trạm</em></p>

### 📱 Mobile App

<p align="center">
  <img src="docs-site/static/img/onboarding-1-app.jpg" alt="Onboarding 1" width="24%"/>
  <img src="docs-site/static/img/onboarding-2-app.jpg" alt="Onboarding 2" width="24%"/>
  <img src="docs-site/static/img/onboarding-3-app.jpg" alt="Onboarding 3" width="24%"/>
  <img src="docs-site/static/img/login-google-app.jpg" alt="Login Google" width="24%"/>
</p>
<p align="center"><em>Màn hình giới thiệu ứng dụng và Đăng nhập Google</em></p>

<p align="center">
  <img src="docs-site/static/img/home-1-app.jpg" alt="Home Screen 1" width="24%"/>
  <img src="docs-site/static/img/home-2-app.jpg" alt="Home Screen 2" width="24%"/>
  <img src="docs-site/static/img/incident-1-app.jpg" alt="Incident 1" width="24%"/>
  <img src="docs-site/static/img/incident-2-app.jpg" alt="Incident 2" width="24%"/>
</p>
<p align="center"><em>Màn hình chính và Báo cáo sự cố</em></p>

<p align="center">
  <img src="docs-site/static/img/map-alert-1-app.jpg" alt="Map Alert 1" width="24%"/>
  <img src="docs-site/static/img/map-alert-2-app.jpg" alt="Map Alert 2" width="24%"/>
  <img src="docs-site/static/img/notification-app.jpg" alt="Notification" width="24%"/>
  <img src="docs-site/static/img/profile-app.jpg" alt="Profile" width="24%"/>
</p>
<p align="center"><em>Bản đồ cảnh báo, Thông báo và Hồ sơ cá nhân</em></p>

### 🎬 Demo Video

<!-- TODO: Thêm link YouTube demo -->

> 🎥 Video demo sẽ được cập nhật sau

### 🔐 Demo Credentials

<p align="center">
  <a href="https://neu-dataverse.github.io/Smart-Forecast/">
    <img src="https://img.shields.io/badge/Documentation-blue?style=for-the-badge&logo=readthedocs&logoColor=white" alt="Documentation"/>
  </a>
  <a href="http://101.96.66.225:8010/api">
    <img src="https://img.shields.io/badge/API_Swagger-85EA2D?style=for-the-badge&logo=swagger&logoColor=black" alt="API Swagger"/>
  </a>
  <a href="http://101.96.66.225:8011/dashboard">
    <img src="https://img.shields.io/badge/Web_Dashboard-000000?style=for-the-badge&logo=next.js&logoColor=white" alt="Web Dashboard"/>
  </a>
  <a href="https://expo.dev/artifacts/eas/fqtBiW57qjWigg8yaCupZm.apk">
    <img src="https://img.shields.io/badge/Android_App-3DDC84?style=for-the-badge&logo=android&logoColor=white" alt="Download Android App"/>
  </a>
</p>

**Web Dashboard (Admin)**

- Liên hệ kaka205.dev@gmail.com để lấy tài khoản demo

**Mobile App**

- Tải App Android từ badge ở trên
- Đăng nhập bằng tài khoản Google

---

## 🏗️ Kiến trúc hệ thống

<p align="center">
  <img src="docs-site/static/img/archi-0.png" alt="Smart Forecast Architecture Diagram" width="100%"/>
</p>
<p align="center"><em>Sơ đồ kiến trúc tổng quan hệ thống Smart-Forecast</em></p>

<p align="center">
  <img src="docs-site/static/img/architecture.png" alt="Smart Forecast Architecture Detail" />
</p>

```
                    ┌─────────────────────────────────────────┐
                    │              DATA SOURCES               │
                    │         (OpenWeatherMap APIs)           │
                    └─────────────────┬───────────────────────┘
                                      │
                                      ▼
┌─────────────────┐     ┌─────────────────────────────────────┐
│   Mobile App    │     │           Backend (NestJS)          │
│   (Expo RN)     │◄───►│  • Data Ingestion (NGSI-LD)         │
└─────────────────┘     │  • Alert Management                 │
                        │  • Incident Reports                 │
┌─────────────────┐     │  • Push Notifications (FCM)         │
│  Web Dashboard  │◄───►│  • REST API                         │
│   (Next.js)     │     └─────────────────┬───────────────────┘
└─────────────────┘                       │
                            ┌─────────────┼─────────────┐
                            │             │             │
                       ┌────▼────┐    ┌───▼────┐    ┌───▼────┐
                       │ Orion   │    │Postgres│    │ MinIO  │
                       │   -LD   │    │   DB   │    │Storage │
                       └────┬────┘    └────────┘    └────────┘
                            │
                       ┌────▼────┐
                       │ MongoDB │
                       └─────────┘
```

### 📦 Cấu trúc Monorepo

```
smart-forecast/
├── backend/        # NestJS API Server
├── web/            # Next.js Admin Dashboard
├── mobile/         # Expo React Native App
├── shared/         # Shared TypeScript Models & Constants
├── docs-site/      # Docusaurus Documentation
├── docker-compose.yml
└── pnpm-workspace.yaml
```

### 🔄 Luồng Người Dùng (User Flow)

<p align="center">
  <img src="docs-site/static/img/user-flow.png" alt="User Flow Diagram" width="100%"/>
</p>
<p align="center"><em>Sơ đồ luồng tương tác giữa Người dùng (Mobile) và Quản lý (Web Portal)</em></p>

**Luồng chính:**

1. **Thu thập dữ liệu:** Từ trạm quan trắc và OpenWeatherMap API
2. **Phân tích & Giám sát:** Quản lý theo dõi trên Web Dashboard
3. **Phát hiện sự cố:** Người dân gửi báo cáo từ Mobile App
4. **Xử lý & Cảnh báo:** Quản lý tạo cảnh báo cho vùng ảnh hưởng
5. **Thông báo:** Người dân nhận Push Notification và xem trên bản đồ

---

## 🛠️ Tech Stack

| Thành phần           | Công nghệ                                                                                                                                                                                                               |
| -------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Backend**          | ![NestJS](https://img.shields.io/badge/NestJS-E0234E?style=flat-square&logo=nestjs&logoColor=white) ![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?style=flat-square&logo=typescript&logoColor=white)     |
| **Web Frontend**     | ![Next.js](https://img.shields.io/badge/Next.js-000000?style=flat-square&logo=next.js&logoColor=white) ![Tailwind CSS](https://img.shields.io/badge/Tailwind-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white) |
| **Mobile App**       | ![Expo](https://img.shields.io/badge/Expo-000020?style=flat-square&logo=expo&logoColor=white) ![React Native](https://img.shields.io/badge/React%20Native-61DAFB?style=flat-square&logo=react&logoColor=black)          |
| **Context Broker**   | ![FIWARE](https://img.shields.io/badge/FIWARE-5DC0CF?style=flat-square) Orion-LD (NGSI-LD)                                                                                                                              |
| **Databases**        | ![PostgreSQL](https://img.shields.io/badge/PostgreSQL-4169E1?style=flat-square&logo=postgresql&logoColor=white) ![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=flat-square&logo=mongodb&logoColor=white)  |
| **Object Storage**   | ![MinIO](https://img.shields.io/badge/MinIO-C72E49?style=flat-square&logo=minio&logoColor=white) (S3-compatible)                                                                                                        |
| **Notifications**    | ![Firebase](https://img.shields.io/badge/Firebase-FFCA28?style=flat-square&logo=firebase&logoColor=black) Cloud Messaging                                                                                               |
| **Data Source**      | OpenWeatherMap API                                                                                                                                                                                                      |
| **Containerization** | ![Docker](https://img.shields.io/badge/Docker-2496ED?style=flat-square&logo=docker&logoColor=white) Docker Compose                                                                                                      |
| **Package Manager**  | ![pnpm](https://img.shields.io/badge/pnpm-F69220?style=flat-square&logo=pnpm&logoColor=white) Monorepo Workspace                                                                                                        |

---

## 🚀 Cài đặt nhanh

### Yêu cầu hệ thống

- **Docker** >= 20.10
- **Docker Compose** >= 2.0
- **Node.js** >= 18.x (cho development)
- **pnpm** >= 8.x

### Quick Start (3 bước)

```bash
# 1️⃣ Clone repository
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast

# 2️⃣ Copy file môi trường
cp .env.example .env
cp backend/.env.example backend/.env
# Chỉnh sửa các API keys trong backend/.env

# 3️⃣ Khởi động tất cả services
docker compose up -d
```

### Truy cập các dịch vụ

| Dịch vụ           | URL                          | Mô tả                   |
| ----------------- | ---------------------------- | ----------------------- |
| **Backend API**   | http://localhost:8000/api/v1 | REST API & Swagger Docs |
| **Web Dashboard** | http://localhost:3000        | Admin Dashboard         |
| **Orion-LD**      | http://localhost:1026        | Context Broker          |
| **MinIO Console** | http://localhost:9001        | Object Storage UI       |

### Development Mode

```bash
# Cài đặt dependencies
pnpm install

# Build shared package
pnpm run build:shared

# Chạy backend development
pnpm run dev:backend

# Chạy web development
pnpm run dev:web

# Chạy mobile (Expo)
pnpm run dev:mobile
```

> 📖 **Chi tiết hơn?** Xem [QUICKSTART.md](QUICKSTART.md) hoặc [Tài liệu đầy đủ](#-tài-liệu)

---

## 📚 Tài liệu

| Tài liệu                           | Mô tả                   |
| ---------------------------------- | ----------------------- |
| [QUICKSTART.md](QUICKSTART.md)     | Hướng dẫn cài đặt nhanh |
| [CHEATSHEET.md](CHEATSHEET.md)     | Các lệnh thường dùng    |
| [CONTRIBUTING.md](CONTRIBUTING.md) | Hướng dẫn đóng góp      |
| [CHANGELOG.md](CHANGELOG.md)       | Lịch sử thay đổi        |

### Tài liệu chi tiết

> 🌐 Xem tài liệu đầy đủ tại https://neu-dataverse.github.io/Smart-Forecast/

**Nội dung bao gồm:**

- Kiến trúc hệ thống (Architecture)
- Hướng dẫn triển khai (Deployment)
- API Documentation
- Data Models (NGSI-LD)
- Hướng dẫn sử dụng

---

## 🤝 Đóng góp

Chúng tôi hoan nghênh mọi đóng góp! Xem [CONTRIBUTING.md](CONTRIBUTING.md) để biết thêm chi tiết.

```bash
# Fork repo → Tạo branch → Commit → Push → Pull Request
git checkout -b feat/amazing-feature
git commit -m "feat: add amazing feature"
git push origin feat/amazing-feature
```

---

## 👥 Team NEU-DataVerse

<table>
  <tr>
    <td align="center">
      <a href="https://github.com/Mkhai205">
        <img src="https://github.com/Mkhai205.png" width="100px;" alt="Khải"/><br />
        <sub><b>Khải (Mkhai205)</b></sub>
      </a><br />
      <sub>PM, Backend, Frondend, DevOps</sub>
    </td>
    <td align="center">
      <a href="https://github.com/NGUYENTHANHDATHH">
        <img src="https://github.com/NGUYENTHANHDATHH.png" width="100px;" alt="Đạt"/><br />
        <sub><b>Đạt (NGUYENTHANHDATHH)</b></sub>
      </a><br />
      <sub>Frontend</sub>
    </td>
    <td align="center">
      <a href="https://github.com/BichCan">
        <img src="https://github.com/BichCan.png" width="100px;" alt="Bích"/><br />
        <sub><b>Bích (BichCan)</b></sub>
      </a><br />
      <sub>Design UI, Docs</sub>
    </td>
  </tr>
</table>

---

## 📄 License

Dự án được phân phối dưới giấy phép **MIT License**. Xem file [LICENSE](LICENSE) để biết thêm chi tiết.

---

<p align="center">
  <strong>Nhóm NEU-DataVerse – OLP'2025</strong><br/>
  <em>🌍 Smart Forecast – Khi dữ liệu mở trở thành cảnh báo sớm cho cộng đồng</em>
</p>
