---
sidebar_position: 8
title: Hướng dẫn sử dụng
---

import useBaseUrl from '@docusaurus/useBaseUrl';

# Hướng dẫn sử dụng

Hướng dẫn sử dụng các ứng dụng của Smart Forecast.

---

## Web Dashboard (Admin/Manager)

Dashboard web dành cho Admin và Manager để quản lý hệ thống.

### Đăng nhập

1. Truy cập `http://localhost:3000` (development) hoặc URL production
2. Nhập email và mật khẩu
3. Nhấn **Đăng nhập**

### Dashboard chính

<figure className="screenshot-container">
  <img src={useBaseUrl('/img/dashboard-web.png')} alt="Dashboard" className="screenshot" />
  <figcaption className="screenshot-caption">Trang Dashboard tổng quan - Hiển thị thông tin tổng hợp về trạm, cảnh báo, sự cố và chỉ số AQI</figcaption>
</figure>

### Chức năng chính

#### 1. Quản lý cảnh báo (Alerts)

**Xem danh sách cảnh báo:**

- Menu → **Alerts**
- Lọc theo: Status, Severity, Type
- Sắp xếp theo: Ngày tạo, Mức độ

<figure className="screenshot-container">
  <img src={useBaseUrl('/img/alert-web.png')} alt="Alert List" className="screenshot" />
  <figcaption className="screenshot-caption">Danh sách cảnh báo với các bộ lọc và tùy chọn sắp xếp</figcaption>
</figure>

**Tạo cảnh báo mới:**

1. Nhấn **+ Tạo cảnh báo**
2. Điền thông tin:
   - Tiêu đề
   - Mô tả chi tiết
   - Mức độ (Low/Medium/High/Critical)
   - Loại (Weather/Flood/Fire/Air Quality)
   - Khu vực ảnh hưởng
   - Thời gian hiệu lực
3. Nhấn **Gửi cảnh báo**

<figure className="screenshot-container">
  <img src={useBaseUrl('/img/detail-alert-web.png')} alt="Alert Detail" className="screenshot" />
  <figcaption className="screenshot-caption">Chi tiết cảnh báo - Xem và chỉnh sửa thông tin cảnh báo</figcaption>
</figure>

**Cập nhật trạng thái:**

- Active → Resolved
- Active → Expired

<figure className="screenshot-container">
  <img src={useBaseUrl('/img/map-alert-web.png')} alt="Map with Alerts" className="screenshot" />
  <figcaption className="screenshot-caption">Bản đồ hiển thị vị trí các cảnh báo theo khu vực</figcaption>
</figure>

#### 2. Quản lý sự cố (Incidents)

**Xem danh sách sự cố:**

- Menu → **Incidents**
- Lọc theo: Status, Type

<div className="screenshot-gallery">
  <figure>
    <img src={useBaseUrl('/img/incident-web.png')} alt="Incident Management" className="screenshot" />
    <figcaption className="screenshot-caption">Danh sách sự cố từ người dân</figcaption>
  </figure>
  <figure>
    <img src={useBaseUrl('/img/statistic-incident-web.png')} alt="Incident Statistics" className="screenshot" />
    <figcaption className="screenshot-caption">Thống kê sự cố theo thời gian</figcaption>
  </figure>
</div>

**Xử lý sự cố:**

1. Chọn sự cố cần xử lý
2. Xem chi tiết: Ảnh, Vị trí, Mô tả
3. Cập nhật trạng thái:
   - Pending → Processing
   - Processing → Resolved
   - Pending → Rejected
4. Thêm ghi chú xử lý
5. Nhấn **Cập nhật**

<figure className="screenshot-container">
  <img src={useBaseUrl('/img/map-incident-web.png')} alt="Map with Incidents" className="screenshot" />
  <figcaption className="screenshot-caption">Bản đồ hiển thị vị trí các sự cố được báo cáo</figcaption>
</figure>

#### 3. Xem dữ liệu môi trường

**Thời tiết:**

- Menu → **Weather**
- Xem dữ liệu real-time
- Biểu đồ dự báo 7 ngày
- Lịch sử theo thời gian

**Chất lượng không khí:**

- Menu → **Air Quality**
- AQI index và phân loại
- Biểu đồ PM2.5, PM10
- Dự báo 4 ngày

<div className="screenshot-gallery">
  <figure>
    <img src={useBaseUrl('/img/chart-web.png')} alt="Charts" className="screenshot" />
    <figcaption className="screenshot-caption">Biểu đồ dữ liệu môi trường real-time</figcaption>
  </figure>
  <figure>
    <img src={useBaseUrl('/img/chart-history-web.png')} alt="History Charts" className="screenshot" />
    <figcaption className="screenshot-caption">Lịch sử dữ liệu theo khoảng thời gian</figcaption>
  </figure>
</div>

#### 4. Quản lý trạm (Stations)

**Xem danh sách trạm:**

- Menu → **Stations**
- Xem trạng thái: Active/Inactive
- Vị trí trên bản đồ

<figure className="screenshot-container">
  <img src={useBaseUrl('/img/station-web.png')} alt="Station List" className="screenshot" />
  <figcaption className="screenshot-caption">Danh sách trạm quan trắc với thông tin trạng thái</figcaption>
</figure>

**Quản lý trạm (Admin):**

- Kích hoạt/Vô hiệu hóa trạm
- Cập nhật thông tin trạm

<div className="screenshot-gallery">
  <figure>
    <img src={useBaseUrl('/img/create-station-web.png')} alt="Create Station" className="screenshot" />
    <figcaption className="screenshot-caption">Form tạo trạm quan trắc mới</figcaption>
  </figure>
  <figure>
    <img src={useBaseUrl('/img/compare-station-web.png')} alt="Compare Stations" className="screenshot" />
    <figcaption className="screenshot-caption">So sánh dữ liệu giữa các trạm</figcaption>
  </figure>
</div>

#### 5. Reports & Export

**Xuất báo cáo:**

- Menu → **Reports**
- Chọn loại báo cáo
- Chọn khoảng thời gian
- Xuất PDF hoặc Excel

---

## Mobile App (Citizen)

Ứng dụng di động dành cho người dân.

### Cài đặt

**Phát triển:**

```bash
# Expo Go app
pnpm run dev:mobile
# Quét QR code bằng Expo Go
```

**Production:**

- iOS: App Store (coming soon)
- Android: Google Play (coming soon)

### Đăng nhập/Đăng ký

1. Mở app
2. Chọn **Đăng nhập** hoặc **Đăng ký**
3. Đăng nhập với email/mật khẩu hoặc Google

### Màn hình chính

:::info Ảnh Mobile App sắp có
Ảnh chụp màn hình ứng dụng Mobile đang được cập nhật. Dưới đây là mô tả giao diện:
:::

<div className="mobile-placeholder">
  <strong>Mobile Home Screen</strong>
  <p>Hiển thị thời tiết, AQI và cảnh báo</p>
</div>

```
┌─────────────────────────────┐
│  Smart Forecast     📍 HN  │
├─────────────────────────────┤
│                              │
│  ☀️ 25°C                    │
│  Trời nắng                  │
│  Độ ẩm: 75%                 │
│                              │
│  ┌─────────────────────────┐│
│  │  AQI: 85 - Moderate     ││
│  │  PM2.5: 35 µg/m³        ││
│  └─────────────────────────┘│
│                              │
│  ⚠️ Cảnh báo (2)            │
│  ┌─────────────────────────┐│
│  │ 🌧️ Mưa lớn chiều nay    ││
│  │ ⚡ Cảnh báo giông sét     ││
│  └─────────────────────────┘│
│                              │
├─────────────────────────────┤
│  🏠    🗺️    📝    👤      │
│ Home   Map  Report Profile  │
└─────────────────────────────┘
```

<!-- TODO: Thêm mobile home screenshot khi có ảnh -->

### Chức năng chính

#### 1. Xem thời tiết

- Xem thời tiết hiện tại
- Dự báo 7 ngày
- Thông tin chi tiết: Gió, Độ ẩm, Áp suất

#### 2. Xem chất lượng không khí

- AQI index với phân loại màu sắc
- Chi tiết: PM2.5, PM10, NO2, SO2
- Khuyến nghị sức khỏe

#### 3. Nhận cảnh báo

- Push notification khi có cảnh báo mới
- Xem chi tiết cảnh báo
- Lịch sử cảnh báo

#### 4. Báo cáo sự cố

**Tạo báo cáo:**

1. Tab **Report** → **+ Báo cáo mới**
2. Chọn loại sự cố: Ngập, Cháy, Ô nhiễm, Khác
3. Chụp ảnh hiện trường (tối đa 5 ảnh)
4. Mô tả sự cố
5. Vị trí tự động lấy GPS hoặc chọn trên bản đồ
6. Nhấn **Gửi báo cáo**

<div className="mobile-placeholder">
  <strong>Report Incident Screen</strong>
  <p>Form báo cáo sự cố với ảnh và GPS</p>
</div>

<!-- TODO: Thêm mobile report screenshot khi có ảnh -->

**Theo dõi báo cáo:**

- Xem trạng thái: Đang chờ, Đang xử lý, Đã giải quyết
- Nhận thông báo khi có cập nhật

#### 5. Bản đồ

- Xem vị trí các trạm quan trắc
- Xem vị trí sự cố đã báo cáo
- Chất lượng không khí theo khu vực

<div className="mobile-placeholder">
  <strong>Map Screen</strong>
  <p>Bản đồ trạm quan trắc và sự cố</p>
</div>

<!-- TODO: Thêm mobile map screenshot khi có ảnh -->

#### 6. Cài đặt

- Bật/tắt thông báo
- Chọn ngôn ngữ
- Quản lý tài khoản

---

## Thông báo đẩy (Push Notifications)

### Loại thông báo

| Loại            | Mô tả                         | Ví dụ                    |
| --------------- | ----------------------------- | ------------------------ |
| Alert           | Cảnh báo thiên tai/môi trường | "⚠️ Cảnh báo mưa lớn"    |
| Incident Update | Cập nhật sự cố đã báo cáo     | "✅ Sự cố đã được xử lý" |
| System          | Thông báo hệ thống            | "📢 Bảo trì hệ thống"    |

### Cấu hình thông báo

**Mobile:**

1. **Profile** → **Cài đặt**
2. **Thông báo**
3. Bật/tắt từng loại thông báo

---

## Giao diện

### Màu sắc AQI

| AQI     | Phân loại               | Màu        |
| ------- | ----------------------- | ---------- |
| 0-50    | Good                    | 🟢 Xanh lá |
| 51-100  | Moderate                | 🟡 Vàng    |
| 101-150 | Unhealthy for Sensitive | 🟠 Cam     |
| 151-200 | Unhealthy               | 🔴 Đỏ      |
| 201-300 | Very Unhealthy          | 🟣 Tím     |
| 300+    | Hazardous               | 🟤 Nâu đỏ  |

### Mức độ cảnh báo

| Severity | Màu           | Icon |
| -------- | ------------- | ---- |
| Low      | 🔵 Xanh dương | ℹ️   |
| Medium   | 🟡 Vàng       | ⚠️   |
| High     | 🟠 Cam        | 🔔   |
| Critical | 🔴 Đỏ         | 🚨   |

---

## FAQ

### Làm sao để đăng ký tài khoản?

Mobile app: Chọn **Đăng ký** → Điền email, mật khẩu → Xác nhận email

### Làm sao để báo cáo sự cố?

1. Mở app → Tab **Report**
2. Nhấn **+ Báo cáo mới**
3. Chọn loại, chụp ảnh, mô tả
4. Gửi báo cáo

### Tại sao không nhận được thông báo?

1. Kiểm tra cài đặt thông báo trong app
2. Kiểm tra cài đặt thông báo của hệ điều hành
3. Kiểm tra kết nối internet

### Làm sao để xem lịch sử dữ liệu?

Web Dashboard: **Weather/Air Quality** → Chọn tab **History** → Chọn khoảng thời gian

---

## Tiếp theo

- [Kiến trúc hệ thống](./architecture) - System architecture
- [API Documentation](./api) - REST API endpoints
- [Troubleshooting](./troubleshooting) - Xử lý lỗi
