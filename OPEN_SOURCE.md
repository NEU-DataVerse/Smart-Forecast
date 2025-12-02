# 📜 Thông tin Mã nguồn mở (Open Source)

Dự án **Smart Forecast** được xây dựng trên nền tảng các thư viện và framework mã nguồn mở. Tài liệu này liệt kê các dependencies chính và license tương ứng.

## 📋 Mục Lục

- [Tổng quan License](#-tổng-quan-license)
- [Backend (NestJS)](#-backend-nestjs)
- [Web Frontend (Next.js)](#-web-frontend-nextjs)
- [Mobile App (Expo)](#-mobile-app-expo)
- [Infrastructure](#-infrastructure)
- [Phân tích tương thích License](#-phân-tích-tương-thích-license)

---

## 🔧 Backend (NestJS)

### Core Framework

| Package                    | Version | License | Mô tả                         |
| -------------------------- | ------- | ------- | ----------------------------- |
| `@nestjs/core`             | ^11.0.1 | MIT     | NestJS core framework         |
| `@nestjs/common`           | ^11.0.1 | MIT     | NestJS common utilities       |
| `@nestjs/platform-express` | 11.1.8  | MIT     | Express adapter cho NestJS    |
| `@nestjs/config`           | 4.0.2   | MIT     | Configuration module          |
| `@nestjs/swagger`          | 11.2.3  | MIT     | OpenAPI/Swagger documentation |

### Database & ORM

| Package           | Version | License | Mô tả                      |
| ----------------- | ------- | ------- | -------------------------- |
| `typeorm`         | 0.3.27  | MIT     | TypeScript ORM             |
| `@nestjs/typeorm` | 11.0.0  | MIT     | NestJS TypeORM integration |
| `pg`              | 8.16.3  | MIT     | PostgreSQL client          |

### Authentication & Security

| Package                   | Version | License    | Mô tả                     |
| ------------------------- | ------- | ---------- | ------------------------- |
| `@nestjs/jwt`             | 11.0.1  | MIT        | JWT module cho NestJS     |
| `@nestjs/passport`        | 11.0.5  | MIT        | Passport integration      |
| `passport`                | 0.7.0   | MIT        | Authentication middleware |
| `passport-jwt`            | 4.0.1   | MIT        | JWT strategy cho Passport |
| `passport-google-oauth20` | 2.0.0   | MIT        | Google OAuth2 strategy    |
| `bcrypt`                  | 6.0.0   | MIT        | Password hashing          |
| `google-auth-library`     | 10.5.0  | Apache-2.0 | Google Auth library       |

### HTTP & API

| Package         | Version | License    | Mô tả                 |
| --------------- | ------- | ---------- | --------------------- |
| `axios`         | ^1.7.9  | MIT        | HTTP client           |
| `axios-retry`   | 4.5.0   | Apache-2.0 | Retry logic cho Axios |
| `@nestjs/axios` | ^3.1.3  | MIT        | NestJS Axios module   |

### Storage & Files

| Package    | Version       | License    | Mô tả                 |
| ---------- | ------------- | ---------- | --------------------- |
| `minio`    | 8.0.6         | Apache-2.0 | MinIO S3 client       |
| `pdfkit`   | 0.17.2        | MIT        | PDF generation        |
| `json2csv` | 6.0.0-alpha.2 | MIT        | JSON to CSV converter |

### Utilities

| Package             | Version | License    | Mô tả                 |
| ------------------- | ------- | ---------- | --------------------- |
| `class-validator`   | 0.14.2  | MIT        | Validation decorators |
| `class-transformer` | 0.5.1   | MIT        | Object transformation |
| `rxjs`              | ^7.8.1  | Apache-2.0 | Reactive extensions   |
| `uuid`              | 13.0.0  | MIT        | UUID generation       |
| `firebase-admin`    | 13.6.0  | Apache-2.0 | Firebase Admin SDK    |
| `@nestjs/schedule`  | ^4.1.1  | MIT        | Task scheduling       |

### Development Tools

| Package      | Version | License    | Mô tả               |
| ------------ | ------- | ---------- | ------------------- |
| `typescript` | ^5.7.3  | Apache-2.0 | TypeScript compiler |
| `jest`       | ^30.0.0 | MIT        | Testing framework   |
| `eslint`     | ^9.18.0 | MIT        | Linting tool        |
| `prettier`   | ^3.4.2  | MIT        | Code formatter      |

---

## 🌐 Web Frontend (Next.js)

### Core Framework

| Package     | Version | License | Mô tả              |
| ----------- | ------- | ------- | ------------------ |
| `next`      | 15.5.6  | MIT     | Next.js framework  |
| `react`     | 19.1.0  | MIT     | React library      |
| `react-dom` | 19.1.0  | MIT     | React DOM renderer |

### UI Components (Radix UI)

| Package                         | Version | License | Mô tả              |
| ------------------------------- | ------- | ------- | ------------------ |
| `@radix-ui/react-dialog`        | 1.1.15  | MIT     | Dialog component   |
| `@radix-ui/react-dropdown-menu` | 2.1.16  | MIT     | Dropdown menu      |
| `@radix-ui/react-select`        | 2.2.6   | MIT     | Select component   |
| `@radix-ui/react-tabs`          | 1.1.13  | MIT     | Tabs component     |
| `@radix-ui/react-avatar`        | 1.1.11  | MIT     | Avatar component   |
| `@radix-ui/react-checkbox`      | 1.3.3   | MIT     | Checkbox component |
| `@radix-ui/react-switch`        | 1.2.6   | MIT     | Switch component   |
| `@radix-ui/react-slider`        | 1.3.6   | MIT     | Slider component   |
| `@radix-ui/react-popover`       | 1.1.15  | MIT     | Popover component  |
| `@radix-ui/react-progress`      | 1.1.8   | MIT     | Progress component |
| `@radix-ui/react-scroll-area`   | 1.2.10  | MIT     | Scroll area        |
| `@radix-ui/react-alert-dialog`  | 1.1.15  | MIT     | Alert dialog       |
| `@radix-ui/react-label`         | 2.1.8   | MIT     | Label component    |
| `@radix-ui/react-slot`          | 1.2.4   | MIT     | Slot component     |

### Styling

| Package                    | Version | License    | Mô tả                 |
| -------------------------- | ------- | ---------- | --------------------- |
| `tailwindcss`              | ^4      | MIT        | Utility-first CSS     |
| `tailwind-merge`           | 3.4.0   | MIT        | Tailwind class merger |
| `class-variance-authority` | 0.7.1   | Apache-2.0 | CSS variants          |
| `clsx`                     | 2.1.1   | MIT        | Class name utility    |

### Maps & Visualization

| Package         | Version | License         | Mô tả                 |
| --------------- | ------- | --------------- | --------------------- |
| `leaflet`       | 1.9.4   | BSD-2-Clause    | Interactive maps      |
| `react-leaflet` | 5.0.0   | Hippocratic-2.1 | React Leaflet wrapper |
| `leaflet-draw`  | 1.0.4   | MIT             | Drawing tools         |
| `maplibre-gl`   | 5.13.0  | BSD-3-Clause    | MapLibre GL JS        |
| `recharts`      | 3.4.1   | MIT             | Charting library      |

### Data & State

| Package                 | Version | License | Mô tả             |
| ----------------------- | ------- | ------- | ----------------- |
| `@tanstack/react-query` | 5.90.11 | MIT     | Data fetching     |
| `axios`                 | 1.13.2  | MIT     | HTTP client       |
| `date-fns`              | 4.1.0   | MIT     | Date utilities    |
| `supercluster`          | 8.0.1   | ISC     | Marker clustering |

### UI Utilities

| Package            | Version | License | Mô tả               |
| ------------------ | ------- | ------- | ------------------- |
| `lucide-react`     | 0.553.0 | ISC     | Icon library        |
| `sonner`           | 2.0.7   | MIT     | Toast notifications |
| `react-day-picker` | 9.11.3  | MIT     | Date picker         |

---

## 📱 Mobile App (Expo)

### Core Framework

| Package        | Version  | License | Mô tả                  |
| -------------- | -------- | ------- | ---------------------- |
| `expo`         | ~54.0.25 | MIT     | Expo SDK               |
| `react`        | 19.1.0   | MIT     | React library          |
| `react-native` | 0.81.5   | MIT     | React Native framework |
| `expo-router`  | ~6.0.15  | MIT     | File-based routing     |

### UI & Navigation

| Package                          | Version | License | Mô tả              |
| -------------------------------- | ------- | ------- | ------------------ |
| `react-native-screens`           | ~4.16.0 | MIT     | Native screens     |
| `react-native-gesture-handler`   | ~2.28.0 | MIT     | Gesture handling   |
| `react-native-reanimated`        | ^4.1.5  | MIT     | Animations         |
| `react-native-safe-area-context` | ~5.6.0  | MIT     | Safe area handling |
| `expo-blur`                      | ~15.0.7 | MIT     | Blur effects       |
| `expo-linear-gradient`           | ~15.0.7 | MIT     | Gradients          |

### Maps & Location

| Package                           | Version | License      | Mô tả                |
| --------------------------------- | ------- | ------------ | -------------------- |
| `react-native-maps`               | 1.20.1  | MIT          | Native maps          |
| `@maplibre/maplibre-react-native` | ^10.4.1 | BSD-3-Clause | MapLibre integration |
| `expo-location`                   | ~19.0.7 | MIT          | Location services    |

### Authentication & Storage

| Package                                     | Version | License | Mô tả          |
| ------------------------------------------- | ------- | ------- | -------------- |
| `@react-native-google-signin/google-signin` | ^16.0.0 | MIT     | Google Sign-In |
| `@react-native-async-storage/async-storage` | 2.2.0   | MIT     | Async storage  |

### Media & Assets

| Package              | Version | License | Mô tả           |
| -------------------- | ------- | ------- | --------------- |
| `expo-image`         | ~3.0.10 | MIT     | Image component |
| `expo-image-picker`  | ~17.0.8 | MIT     | Image picker    |
| `expo-font`          | ~14.0.9 | MIT     | Custom fonts    |
| `@expo/vector-icons` | ^15.0.3 | MIT     | Icon library    |
| `react-native-svg`   | 15.12.1 | MIT     | SVG support     |

### Notifications & Device

| Package              | Version  | License | Mô tả              |
| -------------------- | -------- | ------- | ------------------ |
| `expo-notifications` | ~0.32.13 | MIT     | Push notifications |
| `expo-device`        | ~8.0.9   | MIT     | Device info        |
| `expo-haptics`       | ~15.0.7  | MIT     | Haptic feedback    |
| `expo-constants`     | ~18.0.10 | MIT     | App constants      |

### State Management & Data

| Package                 | Version | License | Mô tả            |
| ----------------------- | ------- | ------- | ---------------- |
| `zustand`               | ^5.0.2  | MIT     | State management |
| `@tanstack/react-query` | ^5.83.0 | MIT     | Data fetching    |
| `axios`                 | ^1.13.2 | MIT     | HTTP client      |

### Utilities

| Package               | Version  | License | Mô tả         |
| --------------------- | -------- | ------- | ------------- |
| `lucide-react-native` | ^0.555.0 | ISC     | Icon library  |
| `expo-web-browser`    | ~15.0.9  | MIT     | Web browser   |
| `expo-linking`        | ~8.0.9   | MIT     | Deep linking  |
| `expo-splash-screen`  | ~31.0.11 | MIT     | Splash screen |
| `expo-status-bar`     | ~3.0.8   | MIT     | Status bar    |

---

## 🏗️ Infrastructure

### FIWARE Components

| Component                   | License  | Mô tả                  |
| --------------------------- | -------- | ---------------------- |
| **Orion-LD Context Broker** | AGPL-3.0 | NGSI-LD Context Broker |

> ⚠️ **Lưu ý**: Orion-LD sử dụng AGPL-3.0. Tuy nhiên, vì chúng ta chỉ sử dụng Orion-LD như một **dịch vụ độc lập** (chạy trong Docker container) và giao tiếp qua HTTP API, nên **không ảnh hưởng** đến license của mã nguồn Smart Forecast.

### Databases

| Component      | License            | Mô tả                         |
| -------------- | ------------------ | ----------------------------- |
| **PostgreSQL** | PostgreSQL License | Relational database           |
| **MongoDB**    | SSPL               | NoSQL database (cho Orion-LD) |

> ⚠️ **Lưu ý**: MongoDB sử dụng SSPL (Server Side Public License). Tương tự Orion-LD, MongoDB được sử dụng như dịch vụ độc lập nên **không ảnh hưởng** đến license của mã nguồn.

### Storage & Tools

| Component  | License    | Mô tả                          |
| ---------- | ---------- | ------------------------------ |
| **MinIO**  | AGPL-3.0   | Object storage (S3-compatible) |
| **Docker** | Apache-2.0 | Containerization               |

---

## 📚 Tham khảo

- [MIT License](https://opensource.org/licenses/MIT)
- [Apache License 2.0](https://www.apache.org/licenses/LICENSE-2.0)
- [BSD Licenses](https://opensource.org/licenses/BSD-3-Clause)
- [FIWARE License](https://fiware.github.io/contribution-requirements/)
- [Choose a License](https://choosealicense.com/)

---

<p align="center">
  <em>📄 Tài liệu này được cập nhật lần cuối: Tháng 12, 2025</em>
</p>
