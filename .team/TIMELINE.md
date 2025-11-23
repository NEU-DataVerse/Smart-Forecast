# 🚀 Kế hoạch tổng thể dự án Smart-Forecast (25 ngày)

> **Mục tiêu:** Hoàn thành một sản phẩm demo (PoC) hoạt động đầy đủ, tuân thủ NGSI-LD và sẵn sàng cho ngày **05/12**.

---

## Giai đoạn 1: Nền tảng & Cấu hình (Tuần 1: 10/11 – 16/11)

> **Mục tiêu:** Thiết lập toàn bộ môi trường phát triển, "bộ khung" của dự án và các dịch vụ cơ bản.

### 👥 Toàn nhóm

- Họp thống nhất về API data models (JSON payloads) và các hằng số (`constants`) sẽ dùng chung trong `shared/`.

### 📝 Nhiệm vụ theo vai trò

- **👨‍💻 Khải (PM, Backend, DevOps)**
  - Khởi tạo Monorepo với PNPM workspace (`backend`, `web`, `mobile`, `shared`).
  - Hoàn thiện `docker-compose.yml` để khởi chạy các dịch vụ cốt lõi: Orion-LD, MongoDB, PostgreSQL, MinIO.
  - Thiết lập "bộ khung" cho Backend (Node.js): cài đặt NestJS, cấu trúc module, kết nối cơ sở dữ liệu.
  - Phát triển module `auth` (JWT) cơ bản cho 2 vai trò: `Admin` và `Citizen`.

- **👨‍💻 Đạt (Frontend Web)**
  - Khởi tạo dự án Web (Next.js), cài đặt Tailwind CSS.
  - Xây dựng layout chính của trang dashboard (sidebar, header).
  - Thiết kế trang Đăng nhập (UI) và chuẩn bị tích hợp API.

- **👩‍💻 Bích (Frontend Mobile, Docs)**
  - Khởi tạo dự án Mobile (Expo React Native).
  - Thiết kế UI/UX cơ bản cho các màn hình chính (Đăng nhập, Trang chủ, Gửi báo cáo).
  - Bắt đầu viết tài liệu dự án trong thư mục `docs/`, mô tả kiến trúc và hướng dẫn cài đặt.

---

## Giai đoạn 2: Luồng dữ liệu chính (Tuần 2: 17/11 – 23/11)

> **Mục tiêu:** Hoàn thành luồng dữ liệu một chiều: từ API bên ngoài -> Context Broker -> Hiển thị lên Web/Mobile.

### 📝 Nhiệm vụ theo vai trò

- **👨‍💻 Khải (Backend, DevOps)**
  - Hoàn thiện module `ingestion`: Lấy dữ liệu từ OpenWeatherMap.
  - Chuẩn hoá dữ liệu thành NGSI-LD Entity (ví dụ: `AirQualityObserved`, `WeatherObserved`) theo Smart Data Models.
  - Gửi dữ liệu thành công vào Orion-LD Context Broker.
  - Cấu hình để đồng bộ dữ liệu lịch sử từ Orion-LD sang PostgreSQL.
  - Xây dựng API (modules `airquality/`, `weather/`) để Frontend lấy dữ liệu (đã qua xử lý) từ Orion-LD và PostgreSQL.

- **👨‍💻 Đạt (Frontend Web)**
  - Tích hợp API Đăng nhập (JWT).
  - Xây dựng trang Dashboard chính: Lấy và hiển thị dữ liệu AQI, thời tiết từ API.
  - Tích hợp bản đồ (ví dụ: Mapbox/Leaflet) để hiển thị vị trí các trạm quan trắc.
  - Hiển thị biểu đồ (chart) cơ bản về dữ liệu lịch sử.

- **👩‍💻 Bích (Frontend Mobile, Docs)**
  - Tích hợp API Đăng nhập (JWT).
  - Xây dựng màn hình Trang chủ: Lấy và hiển thị dữ liệu AQI/thời tiết dựa trên vị trí người dùng.
  - Hoàn thiện UI/UX cho tính năng "Gửi báo cáo sự cố" (form, nút chụp ảnh, chọn vị trí).
  - Hỗ trợ Đạt về UI/UX trên web nếu cần.

---

## Giai đoạn 3: Tính năng tương tác (Tuần 3: 24/11 – 30/11)

> **Mục tiêu:** Hoàn thành luồng dữ liệu hai chiều: Cảnh báo từ Admin và Báo cáo từ Người dân.

### 📝 Nhiệm vụ theo vai trò

- **👨‍💻 Khải (Backend)**
  - Hoàn thiện module `incident`: Xây dựng API tiếp nhận báo cáo sự cố (ảnh, vị trí, mô tả) từ người dân.
  - Hoàn thiện module `file`: Xử lý upload ảnh sự cố lên MinIO.
  - Hoàn thiện module `alert`: Xây dựng API cho Admin (web) gửi cảnh báo khẩn.
  - Tích hợp Firebase Cloud Messaging (FCM) để đẩy thông báo (alert) xuống mobile.

- **👨‍💻 Đạt (Frontend Web)**
  - Hoàn thiện trang Dashboard quản lý:
    - Tab "Quản lý sự cố": Hiển thị danh sách/bản đồ các sự cố do người dân gửi về (lấy từ API `incident`).
    - Tab "Gửi cảnh báo": Xây dựng form để Admin nhập và gửi cảnh báo khẩn (gọi API `alert`).
  - Xây dựng trang `analysis` (thống kê) cơ bản.

- **👩‍💻 Bích (Frontend Mobile, Docs)**
  - Hoàn thiện tính năng "Gửi báo cáo sự cố": Tích hợp API `incident` và `file` (chụp ảnh/chọn ảnh, lấy GPS, gửi lên server).
  - Tích hợp SDK của FCM để nhận thông báo (cảnh báo khẩn) từ backend.
  - Hoàn thiện, rà soát (polishing) toàn bộ UI/UX của app.
  - Hoàn thiện tài liệu hướng dẫn sử dụng và slide thuyết trình.

---

## Giai đoạn 4: Hoàn thiện & Demo (Tuần 4: 01/12 – 05/12)

> **Mục tiêu:** Đóng gói, kiểm thử và chuẩn bị kịch bản demo hoàn chỉnh.

### 📝 Nhiệm vụ theo vai trò

- **👨‍💻 Khải (PM, DevOps)**
  - "Đóng băng" tính năng (Feature Freeze), chỉ tập trung sửa lỗi (bug fixing).
  - Rà soát và hoàn thiện `docker-compose.yml` và file `.env.example` để đảm bảo hệ thống có thể chạy chỉ bằng một lệnh (`docker compose up`).
  - Thiết lập CI/CD (nếu còn thời gian).
  - Chuẩn bị kịch bản demo phần backend và kiến trúc tổng thể.

- **👨‍💻 Đạt (Frontend Web)**
  - Kiểm thử chéo (cross-browser testing) và sửa các lỗi hiển thị trên Web Dashboard.
  - Đảm bảo trang thống kê và bản đồ chạy mượt, chính xác.
  - Chuẩn bị kịch bản demo vai trò Người quản lý trên `localhost:3000`.

- **👩‍💻 Bích (Frontend Mobile, Docs)**
  - Kiểm thử kỹ lưỡng app trên nhiều thiết bị (Android/iOS qua Expo Go).
  - Build file `.apk` (hoặc chuẩn bị demo qua Expo Go Tunnel).
  - Hoàn thiện slide thuyết trình và `README.md` chính của dự án.
  - Chuẩn bị kịch bản demo vai trò Người dân (nhận cảnh báo, gửi sự cố).

---

### 👥 Toàn nhóm (04/12 – 05/12)

- Chạy thử (rehearsal) toàn bộ kịch bản demo end-to-end.
- Rà soát lại các yêu cầu của cuộc thi OLP’2025, đặc biệt là tính tuân thủ NGSI-LD.

### 🎉 **05/12: HOÀN THÀNH DỰ ÁN** 🎉
