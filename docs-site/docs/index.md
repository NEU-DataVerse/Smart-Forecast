---
sidebar_position: 1
slug: /
title: Giới thiệu
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Smart Forecast

<figure className="screenshot-container">
  <img src={useBaseUrl('/img/banner.png')} alt="Dashboard" className="screenshot" />
  <figcaption className="screenshot-caption">Nền tảng giám sát và cảnh báo môi trường đô thị thông minh</figcaption>
</figure>

---

## Smart Forecast là gì?

**Smart Forecast** là nền tảng **giám sát và cảnh báo môi trường đô thị thông minh**, được phát triển hướng tới hỗ trợ **chuyển đổi số** cho các thành phố hiện đại.

Dự án tham gia cuộc thi **OLP'2025 – Ứng dụng dữ liệu mở liên kết phục vụ chuyển đổi số**, tuân thủ chuẩn **NGSI-LD** và sử dụng **Smart Data Models** của FIWARE.

---

## Ý tưởng cốt lõi

Smart Forecast thu thập dữ liệu **chất lượng không khí (Air Quality)** và **thời tiết (Weather)** từ các nguồn mở như **OpenWeatherMap**, sau đó:

- **Phân tích & Cảnh báo tự động** khi các chỉ số vượt ngưỡng an toàn
- **Cho phép quản lý** gửi cảnh báo thiên tai, xem báo cáo và thống kê
- **Cho phép người dân** nhận thông báo và gửi báo cáo sự cố (ngập lụt, cây đổ, sạt lở...) kèm vị trí GPS và ảnh

---

## Tính năng chính

### Ứng dụng di động (Citizen App)

| Tính năng                   | Mô tả                                       |
| --------------------------- | ------------------------------------------- |
| **Đăng nhập Google OAuth2** | Xác thực an toàn với JWT                    |
| **Xem dữ liệu môi trường**  | AQI, PM2.5, nhiệt độ, độ ẩm theo vị trí GPS |
| **Bản đồ Live Map**         | Bản đồ theo dõi sự cố                       |
| **Nhận cảnh báo Push**      | Thông báo qua Firebase Cloud Messaging      |
| **Gửi báo cáo sự cố**       | Chụp ảnh, mô tả, gửi vị trí                 |
| **Lịch sử cảnh báo**        | Theo dõi các cảnh báo và báo cáo đã gửi     |

### Dashboard quản trị (Admin Web)

| Tính năng                   | Mô tả                               |
| --------------------------- | ----------------------------------- |
| **Đăng nhập quản trị**      | Phân quyền Admin/Manager            |
| **Theo dõi thời gian thực** | Bản đồ, biểu đồ AQI, nhiệt độ       |
| **Quản lý báo cáo sự cố**   | Xem, xác nhận, gán trạng thái xử lý |
| **Gửi cảnh báo đô thị**     | Soạn và gửi cảnh báo tự động        |
| **Xuất báo cáo**            | Export PDF/CSV theo tháng, quý, năm |

---

## Tech Stack

| Thành phần           | Công nghệ                          |
| -------------------- | ---------------------------------- |
| **Backend**          | NestJS (Node.js), TypeScript       |
| **Web Frontend**     | Next.js 15, Tailwind CSS, Radix UI |
| **Mobile App**       | Expo (React Native)                |
| **Context Broker**   | FIWARE Orion-LD (NGSI-LD)          |
| **Databases**        | PostgreSQL, MongoDB                |
| **Object Storage**   | MinIO (S3-compatible)              |
| **Notifications**    | Firebase Cloud Messaging           |
| **Data Source**      | OpenWeatherMap API                 |
| **Containerization** | Docker Compose                     |
| **Package Manager**  | pnpm Monorepo Workspace            |

---

## Tài liệu

Sử dụng thanh điều hướng bên trái để khám phá:

- **[Bắt đầu nhanh](./getting-started.md)** - Cài đặt và chạy dự án
- **[Kiến trúc hệ thống](./architecture.md)** - Sơ đồ và luồng dữ liệu
- **[Triển khai](./deployment.md)** - Docker Compose và scripts
- **[API Documentation](./api.md)** - REST API endpoints
- **[Hướng dẫn phát triển](./dev-guide.md)** - Cho developers
- **[Hướng dẫn sử dụng](./user-guide.md)** - Cho người dùng

---

## Team NEU-DataVerse

| Thành viên                 | Vai trò             | Nhiệm vụ                                          |
| -------------------------- | ------------------- | ------------------------------------------------- |
| **Khải (Mkhai205)**        | PM, Backend, DevOps | Quản lý dự án, phát triển backend, Docker & CI/CD |
| **Đạt (NGUYENTHANHDATHH)** | Frontend            | Dashboard, bản đồ, charts                         |
| **Bích (BichCan)**         | Design UI, Docs     | UI/UX, tài liệu                                   |

---

## License

Dự án được phân phối dưới giấy phép **MIT License**.

---

<p align="center">
  <strong>Nhóm NEU-DataVerse – OLP'2025</strong>
</p>
