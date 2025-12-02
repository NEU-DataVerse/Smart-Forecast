---
sidebar_position: 10
title: Mã nguồn mở
---

# 📜 Thông tin Mã nguồn mở

Dự án **Smart Forecast** được xây dựng trên nền tảng các thư viện và framework mã nguồn mở. Tài liệu này liệt kê các dependencies chính và license tương ứng.

---

## 🎯 License của dự án

Smart Forecast được phát hành dưới giấy phép **MIT License** - một trong những giấy phép mã nguồn mở phổ biến và linh hoạt nhất.

```
MIT License

Copyright (c) 2025 NEU DataVerse

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.
```

---

## 🔧 Backend (NestJS)

### Core Framework

| Package                    | Version | License | Mô tả                   |
| -------------------------- | ------- | ------- | ----------------------- |
| `@nestjs/core`             | ^11.0.1 | MIT     | NestJS core framework   |
| `@nestjs/common`           | ^11.0.1 | MIT     | NestJS common utilities |
| `@nestjs/platform-express` | 11.1.8  | MIT     | Express adapter         |
| `@nestjs/config`           | 4.0.2   | MIT     | Configuration module    |
| `@nestjs/swagger`          | 11.2.3  | MIT     | OpenAPI documentation   |

### Database & ORM

| Package           | Version | License | Mô tả               |
| ----------------- | ------- | ------- | ------------------- |
| `typeorm`         | 0.3.27  | MIT     | TypeScript ORM      |
| `@nestjs/typeorm` | 11.0.0  | MIT     | TypeORM integration |
| `pg`              | 8.16.3  | MIT     | PostgreSQL client   |

### Authentication

| Package               | Version | License    | Mô tả                |
| --------------------- | ------- | ---------- | -------------------- |
| `@nestjs/jwt`         | 11.0.1  | MIT        | JWT module           |
| `@nestjs/passport`    | 11.0.5  | MIT        | Passport integration |
| `passport-jwt`        | 4.0.1   | MIT        | JWT strategy         |
| `bcrypt`              | 6.0.0   | MIT        | Password hashing     |
| `google-auth-library` | 10.5.0  | Apache-2.0 | Google Auth          |

### HTTP & Storage

| Package          | Version | License    | Mô tả              |
| ---------------- | ------- | ---------- | ------------------ |
| `axios`          | ^1.7.9  | MIT        | HTTP client        |
| `axios-retry`    | 4.5.0   | Apache-2.0 | Retry logic        |
| `minio`          | 8.0.6   | Apache-2.0 | MinIO S3 client    |
| `firebase-admin` | 13.6.0  | Apache-2.0 | Firebase Admin SDK |

---

## 🌐 Web Frontend (Next.js)

### Core Framework

| Package     | Version | License | Mô tả             |
| ----------- | ------- | ------- | ----------------- |
| `next`      | 15.5.6  | MIT     | Next.js framework |
| `react`     | 19.1.0  | MIT     | React library     |
| `react-dom` | 19.1.0  | MIT     | React DOM         |

### UI Components (Radix UI)

| Package                         | Version | License | Mô tả    |
| ------------------------------- | ------- | ------- | -------- |
| `@radix-ui/react-dialog`        | 1.1.15  | MIT     | Dialog   |
| `@radix-ui/react-dropdown-menu` | 2.1.16  | MIT     | Dropdown |
| `@radix-ui/react-select`        | 2.2.6   | MIT     | Select   |
| `@radix-ui/react-tabs`          | 1.1.13  | MIT     | Tabs     |
| `@radix-ui/react-checkbox`      | 1.3.3   | MIT     | Checkbox |
| `@radix-ui/react-switch`        | 1.2.6   | MIT     | Switch   |

### Styling

| Package                    | Version | License    | Mô tả        |
| -------------------------- | ------- | ---------- | ------------ |
| `tailwindcss`              | ^4      | MIT        | Utility CSS  |
| `tailwind-merge`           | 3.4.0   | MIT        | Class merger |
| `class-variance-authority` | 0.7.1   | Apache-2.0 | CSS variants |

### Maps & Charts

| Package         | Version | License         | Mô tả         |
| --------------- | ------- | --------------- | ------------- |
| `leaflet`       | 1.9.4   | BSD-2-Clause    | Maps          |
| `react-leaflet` | 5.0.0   | Hippocratic-2.1 | React wrapper |
| `maplibre-gl`   | 5.13.0  | BSD-3-Clause    | MapLibre GL   |
| `recharts`      | 3.4.1   | MIT             | Charts        |

---

## 📱 Mobile App (Expo)

### Core Framework

| Package        | Version  | License | Mô tả        |
| -------------- | -------- | ------- | ------------ |
| `expo`         | ~54.0.25 | MIT     | Expo SDK     |
| `react`        | 19.1.0   | MIT     | React        |
| `react-native` | 0.81.5   | MIT     | React Native |
| `expo-router`  | ~6.0.15  | MIT     | File routing |

### UI & Animation

| Package                        | Version | License | Mô tả        |
| ------------------------------ | ------- | ------- | ------------ |
| `react-native-reanimated`      | ^4.1.5  | MIT     | Animations   |
| `react-native-gesture-handler` | ~2.28.0 | MIT     | Gestures     |
| `expo-blur`                    | ~15.0.7 | MIT     | Blur effects |
| `expo-linear-gradient`         | ~15.0.7 | MIT     | Gradients    |

### Maps & Location

| Package                           | Version | License      | Mô tả    |
| --------------------------------- | ------- | ------------ | -------- |
| `@maplibre/maplibre-react-native` | ^10.4.1 | BSD-3-Clause | MapLibre |
| `expo-location`                   | ~19.0.7 | MIT          | Location |
| `react-native-maps`               | 1.20.1  | MIT          | Maps     |

### State & Data

| Package                 | Version | License | Mô tả            |
| ----------------------- | ------- | ------- | ---------------- |
| `zustand`               | ^5.0.2  | MIT     | State management |
| `@tanstack/react-query` | ^5.83.0 | MIT     | Data fetching    |
| `axios`                 | ^1.13.2 | MIT     | HTTP client      |

---

## 🏗️ Infrastructure

### FIWARE Components

| Component    | License  | Mô tả                  |
| ------------ | -------- | ---------------------- |
| **Orion-LD** | AGPL-3.0 | NGSI-LD Context Broker |

:::info Lưu ý về AGPL-3.0
Orion-LD sử dụng AGPL-3.0. Tuy nhiên, vì chúng ta chỉ sử dụng Orion-LD như một **dịch vụ độc lập** (chạy trong Docker container) và giao tiếp qua HTTP API, nên **không ảnh hưởng** đến license của mã nguồn Smart Forecast.
:::

### Databases

| Component      | License            | Mô tả               |
| -------------- | ------------------ | ------------------- |
| **PostgreSQL** | PostgreSQL License | Relational database |
| **MongoDB**    | SSPL               | NoSQL database      |

:::info Lưu ý về SSPL
MongoDB sử dụng SSPL (Server Side Public License). Tương tự Orion-LD, MongoDB được sử dụng như dịch vụ độc lập nên **không ảnh hưởng** đến license của mã nguồn.
:::

### Storage

| Component  | License    | Mô tả                 |
| ---------- | ---------- | --------------------- |
| **MinIO**  | AGPL-3.0   | S3-compatible storage |
| **Docker** | Apache-2.0 | Containerization      |

### Kết luận

✅ **Smart Forecast có thể sử dụng MIT License** mà không vi phạm bất kỳ license nào của dependencies.

---

## 📚 Tham khảo

| License    | Link                                                           | Mô tả                        |
| ---------- | -------------------------------------------------------------- | ---------------------------- |
| MIT        | [opensource.org](https://opensource.org/licenses/MIT)          | Permissive license           |
| Apache-2.0 | [apache.org](https://www.apache.org/licenses/LICENSE-2.0)      | Permissive with patent grant |
| BSD        | [opensource.org](https://opensource.org/licenses/BSD-3-Clause) | Permissive                   |
| AGPL-3.0   | [gnu.org](https://www.gnu.org/licenses/agpl-3.0.en.html)       | Strong copyleft              |

---

## 📖 Tiếp theo

- [Đóng góp](../contributing) - Hướng dẫn đóng góp
- [Kiến trúc hệ thống](./architecture) - System architecture
- [Trang chủ](./index) - Quay về trang chủ
