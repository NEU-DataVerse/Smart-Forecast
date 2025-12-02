---
sidebar_position: 8
title: Hướng dẫn sử dụng
---

# 📖 Hướng dẫn sử dụng

Hướng dẫn sử dụng các ứng dụng của Smart Forecast.

---

## 🌐 Web Dashboard (Admin/Manager)

Dashboard web dành cho Admin và Manager để quản lý hệ thống.

### Đăng nhập

1. Truy cập `http://localhost:3000` (development) hoặc URL production
2. Nhập email và mật khẩu
3. Nhấn **Đăng nhập**

### Dashboard chính

```
┌─────────────────────────────────────────────────────────┐
│  Smart Forecast Dashboard                      👤 Admin │
├─────────────────────────────────────────────────────────┤
│ ┌───────────┐ ┌───────────┐ ┌───────────┐ ┌───────────┐│
│ │ Stations  │ │  Alerts   │ │ Incidents │ │    AQI    ││
│ │    15     │ │     3     │ │     8     │ │    85     ││
│ └───────────┘ └───────────┘ └───────────┘ └───────────┘│
│                                                         │
│ ┌─────────────────────────────────────────────────────┐│
│ │                      Map View                       ││
│ │                                                     ││
│ │    📍 Station 1                                     ││
│ │         📍 Station 2                                ││
│ │                📍 Station 3                         ││
│ └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
```

### Chức năng chính

#### 1. Quản lý cảnh báo (Alerts)

**Xem danh sách cảnh báo:**

- Menu → **Alerts**
- Lọc theo: Status, Severity, Type
- Sắp xếp theo: Ngày tạo, Mức độ

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

**Cập nhật trạng thái:**

- Active → Resolved
- Active → Expired

#### 2. Quản lý sự cố (Incidents)

**Xem danh sách sự cố:**

- Menu → **Incidents**
- Lọc theo: Status, Type

**Xử lý sự cố:**

1. Chọn sự cố cần xử lý
2. Xem chi tiết: Ảnh, Vị trí, Mô tả
3. Cập nhật trạng thái:
   - Pending → Processing
   - Processing → Resolved
   - Pending → Rejected
4. Thêm ghi chú xử lý
5. Nhấn **Cập nhật**

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

#### 4. Quản lý trạm (Stations)

**Xem danh sách trạm:**

- Menu → **Stations**
- Xem trạng thái: Active/Inactive
- Vị trí trên bản đồ

**Quản lý trạm (Admin):**

- Kích hoạt/Vô hiệu hóa trạm
- Cập nhật thông tin trạm

#### 5. Reports & Export

**Xuất báo cáo:**

- Menu → **Reports**
- Chọn loại báo cáo
- Chọn khoảng thời gian
- Xuất PDF hoặc Excel

---

## 📱 Mobile App (Citizen)

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

**Theo dõi báo cáo:**

- Xem trạng thái: Đang chờ, Đang xử lý, Đã giải quyết
- Nhận thông báo khi có cập nhật

#### 5. Bản đồ

- Xem vị trí các trạm quan trắc
- Xem vị trí sự cố đã báo cáo
- Chất lượng không khí theo khu vực

#### 6. Cài đặt

- Bật/tắt thông báo
- Chọn ngôn ngữ
- Quản lý tài khoản

---

## 🔔 Thông báo đẩy (Push Notifications)

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

## 🎨 Giao diện

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

## ❓ FAQ

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

## 📖 Tiếp theo

- [Kiến trúc hệ thống](./architecture) - System architecture
- [API Documentation](./api) - REST API endpoints
- [Troubleshooting](./troubleshooting) - Xử lý lỗi
