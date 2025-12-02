---
sidebar_position: 12
title: Demo
---

# Demo

Xem demo và hướng dẫn nhanh về Smart Forecast.

---

## Video Demo

:::note Coming Soon
Video demo đang được chuẩn bị. Vui lòng quay lại sau!
:::

---

## Screenshots

### Web Dashboard

#### Dashboard chính

<figure>
  <img src={require('@site/static/img/dashboard-web.png').default} alt="Dashboard" />
  <figcaption>Trang Dashboard tổng quan - Hiển thị thông tin tổng hợp về trạm, cảnh báo, sự cố và chỉ số AQI</figcaption>
</figure>

#### Quản lý cảnh báo

<figure>
  <img src={require('@site/static/img/alert-web.png').default} alt="Danh sách cảnh báo" />
  <figcaption>Danh sách cảnh báo</figcaption>
</figure>

<figure>
  <img src={require('@site/static/img/detail-alert-web.png').default} alt="Chi tiết cảnh báo" />
  <figcaption>Chi tiết cảnh báo</figcaption>
</figure>

<figure>
  <img src={require('@site/static/img/map-alert-web.png').default} alt="Bản đồ hiển thị vị trí các cảnh báo" />
  <figcaption>Bản đồ hiển thị vị trí các cảnh báo</figcaption>
</figure>

#### Quản lý sự cố (Incidents)

<figure>
  <img src={require('@site/static/img/incident-web.png').default} alt="Quản lý sự cố từ người dân" />
  <figcaption>Quản lý sự cố từ người dân</figcaption>
</figure>

<figure>
  <img src={require('@site/static/img/statistic-incident-web.png').default} alt="Thống kê sự cố" />
  <figcaption>Thống kê sự cố</figcaption>
</figure>

<figure>
  <img src={require('@site/static/img/map-incident-web.png').default} alt="Bản đồ hiển thị vị trí các sự cố" />
  <figcaption>Bản đồ hiển thị vị trí các sự cố</figcaption>
</figure>

#### Quản lý trạm quan trắc (Stations)

<figure>
  <img src={require('@site/static/img/station-web.png').default} alt="Danh sách trạm quan trắc" />
  <figcaption>Danh sách trạm quan trắc</figcaption>
</figure>

<figure>
  <img src={require('@site/static/img/create-station-web.png').default} alt="Tạo trạm mới" />
  <figcaption>Tạo trạm mới</figcaption>
</figure>

<figure>
  <img src={require('@site/static/img/compare-station-web.png').default} alt="So sánh dữ liệu giữa các trạm" />
  <figcaption>So sánh dữ liệu giữa các trạm</figcaption>
</figure>

#### Biểu đồ và dữ liệu

<figure>
  <img src={require('@site/static/img/chart-web.png').default} alt="Biểu đồ dữ liệu môi trường" />
  <figcaption>Biểu đồ dữ liệu môi trường</figcaption>
</figure>

<figure>
  <img src={require('@site/static/img/chart-history-web.png').default} alt="Lịch sử dữ liệu theo thời gian" />
  <figcaption>Lịch sử dữ liệu theo thời gian</figcaption>
</figure>

### Mobile App

:::info Ảnh Mobile App sắp có
Ảnh chụp màn hình ứng dụng Mobile đang được cập nhật. Dưới đây là mô tả giao diện:
:::

#### Màn hình chính

<div className="mobile-placeholder">
  <strong>Mobile Home Screen</strong>
  <p>Hiển thị thời tiết, AQI và cảnh báo</p>
</div>

```
┌─────────────────────────────┐
│ ☀️ Good Morning            │
│    Hanoi, Vietnam           │
├─────────────────────────────┤
│                             │
│        ☀️ 25°C              │
│       Clear Sky             │
│                             │
│   💨 12 km/h  💧 75%        │
│                             │
├─────────────────────────────┤
│  Air Quality                │
│  ┌─────────────────────────┐│
│  │  AQI: 85                ││
│  │  🟡 Moderate            ││
│  │                         ││
│  │  PM2.5: 35 µg/m³        ││
│  │  PM10:  65 µg/m³        ││
│  └─────────────────────────┘│
├─────────────────────────────┤
│  ⚠️ Active Alerts (2)       │
│  ┌─────────────────────────┐│
│  │ 🌧️ Heavy Rain Expected  ││
│  │    Today afternoon      ││
│  ├─────────────────────────┤│
│  │ ⚡ Thunderstorm Warning ││
│  │    Valid until 8PM      ││
│  └─────────────────────────┘│
├─────────────────────────────┤
│  🏠    🗺️    📝    👤       │
│ Home   Map  Report Profile  │
└─────────────────────────────┘
```

#### Báo cáo sự cố

<div className="mobile-placeholder">
  <strong>Report Incident Screen</strong>
  <p>Form báo cáo sự cố với ảnh và GPS</p>
</div>

```
┌─────────────────────────────┐
│ ← Report Incident           │
├─────────────────────────────┤
│                             │
│  Type of Incident           │
│  ┌─────────────────────────┐│
│  │ 🌊 Flood   │ 🔥 Fire    ││
│  │ ────────  │           ││
│  │ 🏭 Pollution │ 📋 Other ││
│  └─────────────────────────┘│
│                             │
│  Photos (0/5)               │
│  ┌─────────────────────────┐│
│  │    📷 Add Photo         ││
│  └─────────────────────────┘│
│                             │
│  Description                │
│  ┌─────────────────────────┐│
│  │                         ││
│  │ Describe the incident...││
│  │                         ││
│  └─────────────────────────┘│
│                             │
│  Location 📍 Auto-detected  │
│  123 Cau Giay, Hanoi        │
│                             │
│  ┌─────────────────────────┐│
│  │     Submit Report       ││
│  └─────────────────────────┘│
└─────────────────────────────┘
```

<!-- TODO: Thêm mobile screenshots khi có ảnh -->

---

## Quick Demo

### Chạy demo local

```bash
# Clone repository
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast

# Setup
pnpm install
pnpm run build:shared

# Start Docker services
docker compose up -d

# Seed database (tạo dữ liệu mẫu)
cd backend
npm run seed:force
cd ..

# Start all apps
# Terminal 1
pnpm run dev:backend    # http://localhost:8000

# Terminal 2
pnpm run dev:web        # http://localhost:3000

# Terminal 3
pnpm run dev:mobile     # Expo DevTools
```

### Seed Database Options

| Command                   | Mô tả                                              |
| ------------------------- | -------------------------------------------------- |
| `npm run seed`            | Seed nếu DB rỗng                                   |
| `npm run seed:force`      | Force reseed (xóa và seed lại tất cả)              |
| `npm run seed:base`       | Seed base data (không có fake weather/air-quality) |
| `npm run seed:base:force` | Force reseed base data                             |
| `npm run seed:clear`      | Xóa tất cả dữ liệu                                 |

:::tip Sử dụng dữ liệu thật từ OpenWeatherMap
Nếu muốn sử dụng dữ liệu thật thay vì fake data:

```bash
# 1. Seed base data (users, stations, incidents, alerts)
npm run seed:base:force

# 2. Vào Dashboard web → "Thu thập dữ liệu lịch sử" để lấy data thật
```

> **Lưu ý**: Historical Weather API của OpenWeatherMap yêu cầu **paid subscription**. Historical Air Quality API là **miễn phí**.
> :::

### Demo accounts

| Role  | Email                   | Password | Provider |
| ----- | ----------------------- | -------- | -------- |
| Admin | admin@smartforecast.com | admin123 | local    |
| User  | user@test.com           | (OAuth)  | google   |
| Demo  | demo@smartforecast.com  | demo123  | local    |

:::note
Các tài khoản demo được tạo tự động khi chạy `npm run seed` trong backend. Trong production, bạn cần tạo tài khoản mới.
:::

### Trạm quan trắc mẫu

Hệ thống seed tự động tạo 4 trạm quan trắc tại Hà Nội:

| Tên trạm  | Mã        | Vị trí      | Độ ưu tiên |
| --------- | --------- | ----------- | ---------- |
| Hoàn Kiếm | HN-HK-001 | Trung tâm   | HIGH       |
| Hà Đông   | HN-HD-001 | Phía Tây    | MEDIUM     |
| Cầu Giấy  | HN-CG-001 | Khu đại học | HIGH       |
| Long Biên | HN-LB-001 | Ven sông    | MEDIUM     |

---

## Quick Links

### API Demo

```bash
# Get current weather
curl http://localhost:8000/api/v1/weather/current

# Get air quality
curl http://localhost:8000/api/v1/air-quality/current

# Check health
curl http://localhost:8000/api/v1/health
```

### Swagger API Docs

Sau khi start backend, truy cập:

- http://localhost:8000/api

### MinIO Console

Quản lý file storage:

- http://localhost:9001
- Login: minioadmin / minioadmin

---

## Mobile Demo

### Expo Go

1. Cài đặt Expo Go trên điện thoại
2. Chạy `pnpm run dev:mobile`
3. Quét QR code

### Lưu ý

- Mobile cần kết nối cùng WiFi với máy development
- Sử dụng IP máy, không dùng localhost
- Đảm bảo firewall cho phép port 8000

---

## Tính năng demo

### Người dân (Citizen)

1. ✅ Xem thời tiết real-time
2. ✅ Xem chất lượng không khí
3. ✅ Nhận thông báo cảnh báo
4. ✅ Báo cáo sự cố (chụp ảnh, GPS)
5. ✅ Theo dõi trạng thái báo cáo

### Admin/Manager

1. ✅ Dashboard tổng quan
2. ✅ Bản đồ trạm quan trắc
3. ✅ Quản lý cảnh báo
4. ✅ Xử lý sự cố từ người dân
5. ✅ Xem dữ liệu lịch sử
6. ✅ Xuất báo cáo

---

## Tiếp theo

- [Bắt đầu](./getting-started) - Hướng dẫn cài đặt chi tiết
- [Hướng dẫn sử dụng](./user-guide) - User guide
- [API Documentation](./api) - REST API endpoints
