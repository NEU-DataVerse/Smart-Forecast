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

<div className="screenshot-container">
  <img src="/img/dashboard-web.png" alt="Dashboard chính" className="screenshot" />
  <p className="screenshot-caption">Trang Dashboard tổng quan</p>
</div>

#### Quản lý cảnh báo

<div className="screenshot-container">
  <img src="/img/alert-web.png" alt="Danh sách cảnh báo" className="screenshot" />
  <p className="screenshot-caption">Danh sách cảnh báo</p>
</div>

<div className="screenshot-container">
  <img src="/img/detail-alert-web.png" alt="Chi tiết cảnh báo" className="screenshot" />
  <p className="screenshot-caption">Chi tiết cảnh báo</p>
</div>

#### Bản đồ

<div className="screenshot-container">
  <img src="/img/map-alert-web.png" alt="Bản đồ cảnh báo" className="screenshot" />
  <p className="screenshot-caption">Bản đồ hiển thị cảnh báo</p>
</div>

<div className="screenshot-container">
  <img src="/img/map-incident-web.png" alt="Bản đồ sự cố" className="screenshot" />
  <p className="screenshot-caption">Bản đồ hiển thị sự cố</p>
</div>

#### Quản lý trạm quan trắc

<div className="screenshot-container">
  <img src="/img/station-web.png" alt="Danh sách trạm" className="screenshot" />
  <p className="screenshot-caption">Danh sách trạm quan trắc</p>
</div>

<div className="screenshot-container">
  <img src="/img/create-station-web.png" alt="Tạo trạm mới" className="screenshot" />
  <p className="screenshot-caption">Tạo trạm mới</p>
</div>

<div className="screenshot-container">
  <img src="/img/compare-station-web.png" alt="So sánh trạm" className="screenshot" />
  <p className="screenshot-caption">So sánh các trạm</p>
</div>

#### Biểu đồ dữ liệu

<div className="screenshot-container">
  <img src="/img/chart-web.png" alt="Biểu đồ" className="screenshot" />
  <p className="screenshot-caption">Biểu đồ dữ liệu môi trường</p>
</div>

<div className="screenshot-container">
  <img src="/img/chart-history-web.png" alt="Lịch sử dữ liệu" className="screenshot" />
  <p className="screenshot-caption">Lịch sử dữ liệu</p>
</div>

#### Quản lý sự cố

<div className="screenshot-container">
  <img src="/img/incident-web.png" alt="Quản lý sự cố" className="screenshot" />
  <p className="screenshot-caption">Quản lý sự cố</p>
</div>

<div className="screenshot-container">
  <img src="/img/statistic-incident-web.png" alt="Thống kê sự cố" className="screenshot" />
  <p className="screenshot-caption">Thống kê sự cố</p>
</div>

### Mobile App

{/_ TODO: Thêm mobile screenshots _/}

#### Màn hình chính

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

# Start all apps
# Terminal 1
pnpm run dev:backend    # http://localhost:8000

# Terminal 2
pnpm run dev:web        # http://localhost:3000

# Terminal 3
pnpm run dev:mobile     # Expo DevTools
```

### Demo accounts

| Role    | Email                    | Password   |
| ------- | ------------------------ | ---------- |
| Admin   | admin@smartforecast.vn   | admin123   |
| Manager | manager@smartforecast.vn | manager123 |
| Citizen | user@smartforecast.vn    | user123    |

:::note
Các tài khoản demo chỉ hoạt động trong môi trường development. Trong production, bạn cần tạo tài khoản mới.
:::

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

1. Xem thời tiết real-time
2. Xem chất lượng không khí
3. Nhận thông báo cảnh báo
4. Báo cáo sự cố (chụp ảnh, GPS)
5. Theo dõi trạng thái báo cáo

### Admin/Manager

1. Dashboard tổng quan
2. Bản đồ trạm quan trắc
3. Quản lý cảnh báo
4. Xử lý sự cố từ người dân
5. Xem dữ liệu lịch sử
6. Xuất báo cáo

---

## Tiếp theo

- [Bắt đầu](./getting-started) - Hướng dẫn cài đặt chi tiết
- [Hướng dẫn sử dụng](./user-guide) - User guide
- [API Documentation](./api) - REST API endpoints
