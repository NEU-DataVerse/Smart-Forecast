## 🔄 Giai đoạn 3: Tính năng tương tác (24/11 – 30/11)

**Mục tiêu:** Hoàn thành luồng dữ liệu hai chiều: Cảnh báo từ Admin (Web) và Báo cáo sự cố từ Người dân (Mobile).

### Epic 1: [P3] Hoàn thiện Module Báo cáo Sự cố (Incident)

- **Người phụ trách:** Khải (Backend), Bích (Mobile), Đạt (Web)
- **Mô tả:** Cho phép người dân gửi báo cáo (ảnh, vị trí) và admin duyệt các báo cáo đó.

| ID            | Issue (Công việc)                   | Mô tả chi tiết                                                                                                          | Người thực hiện |
| :------------ | :---------------------------------- | :---------------------------------------------------------------------------------------------------------------------- | :-------------- |
| **P3-INC-01** | [Backend] Phát triển Module `file`  | Tạo API `POST /api/v1/file/upload` để nhận ảnh (FormData), tải lên **MinIO** và trả về URL.                             | Khải            |
| **P3-INC-02** | [Backend] Phát triển API `incident` | Tạo API `POST /api/v1/incident` để nhận báo cáo (text, location, image URLs) và lưu vào **PostgreSQL**.                 | Khải            |
| **P3-INC-03** | [Mobile] Tích hợp Upload Ảnh        | (Bích) Tích hợp P3-INC-01: Cho phép người dùng chụp ảnh (không upload từ thư viện) upload lên server, nhận về URL.      | Bích            |
| **P3-INC-04** | [Mobile] Tích hợp Gửi Báo cáo       | (Bích) Tích hợp P3-INC-02: Tổng hợp (text, GPS, URLs ảnh) và gửi báo cáo sự cố. Hiển thị thông báo thành công/thất bại. | Bích            |
| **P3-INC-05** | [Backend] API cho Admin (Web)       | Tạo API `GET /api/v1/incident` (danh sách) và `PUT /api/v1/incident/:id/status` (duyệt/từ chối).                        | Khải            |
| **P3-INC-06** | [Web] Xây dựng UI Quản lý Sự cố     | (Đạt) Tạo trang "Quản lý sự cố" trên Dashboard, hiển thị danh sách các báo cáo từ API P3-INC-05.                        | Đạt             |
| **P3-INC-07** | [Web] Tích hợp Duyệt Sự cố          | (Đạt) Cho phép Admin xem chi tiết, xem ảnh, và nhấn nút "Duyệt" / "Từ chối" (gọi API P3-INC-05).                        | Đạt             |

### Epic 2: [P3] Phát triển Module Cảnh báo Khẩn (Alert)

- **Người phụ trách:** Khải (Backend), Bích (Mobile), Đạt (Web)
- **Mô tả:** Cho phép Admin gửi cảnh báo khẩn cấp (Push Notification) đến tất cả người dân qua Firebase Cloud Messaging (FCM).

| ID            | Issue (Công việc)                 | Mô tả chi tiết                                                                                                                           | Người thực hiện |
| :------------ | :-------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------- | :-------------- |
| **P3-ALT-01** | [Backend] Cấu hình Firebase Admin | Cài đặt Firebase Admin SDK (Node.js) và kết nối với dự án Firebase.                                                                      | Khải            |
| **P3-ALT-02** | [Backend] API Lưu FcmToken        | Tạo API `POST /api/v1/user/fcm-token` để Mobile App gửi FcmToken của thiết bị lên, lưu vào DB (bảng `User` hoặc bảng riêng).             | Khải            |
| **P3-ALT-03** | [Mobile] Tích hợp Firebase SDK    | (Bích) Cài đặt SDK Firebase (FCM) vào app Expo. Xử lý lấy FcmToken và gọi API P3-ALT-02 khi người dùng đăng nhập.                        | Bích            |
| **P3-ALT-04** | [Mobile] Xử lý Nhận Thông báo     | (Bích) Thiết lập "listener" để nhận và hiển thị thông báo (push notification) khi app đang chạy (foreground) hoặc chạy nền (background). | Bích            |
| **P3-ALT-05** | [Backend] API Gửi Cảnh báo        | Tạo API `POST /api/v1/alert` (cho Admin). Khi gọi, backend sẽ lấy FcmTokens từ DB và gửi thông báo qua FCM.                              | Khải            |
| **P3-ALT-06** | [Web] Xây dựng UI Gửi Cảnh báo    | (Đạt) Tạo trang "Gửi cảnh báo" trên Dashboard, gồm form (Tiêu đề, Nội dung, Mức độ) và nút "Gửi".                                        | Đạt             |
| **P3-ALT-07** | [Web] Tích hợp API Gửi Cảnh báo   | (Đạt) Tích hợp API P3-ALT-05 vào nút "Gửi" trên UI.                                                                                      | Đạt             |

### Epic 3: [P3] Xây dựng Trang Thống kê (Web)

- **Người phụ trách:** Khải (Backend), Đạt (Web)
- **Mô tả:** Cung cấp các biểu đồ và số liệu thống kê tổng quan cho Admin.

| ID            | Issue (Công việc)                 | Mô tả chi tiết                                                                                                 | Người thực hiện |
| :------------ | :-------------------------------- | :------------------------------------------------------------------------------------------------------------- | :-------------- |
| **P3-ANA-01** | [Backend] Phát triển API Thống kê | Tạo các API `GET /api/v1/analysis/...` (ví dụ: thống kê số lượng sự cố theo loại, thống kê AQI trung bình...). | Khải            |
| **P3-ANA-02** | [Web] Xây dựng UI Trang Thống kê  | (Đạt) Tạo trang "Analysis / Thống kê" trên Dashboard, bố cục các khu vực biểu đồ.                              | Đạt             |
| **P3-ANA-03** | [Web] Tích hợp Biểu đồ (Incident) | (Đạt) Gọi API P3-ANA-01, dùng Chart.js vẽ biểu đồ tròn/cột thống kê các loại sự cố (ngập lụt, cây đổ...).      | Đạt             |

### Epic 4: [P3] Hoàn thiện Tài liệu

- **Người phụ trách:** Bích (Docs)
- **Mô tả:** Hoàn thiện tài liệu API và chuẩn bị Slide thuyết trình.

| ID            | Issue (Công việc)                          | Mô tả chi tiết                                                                           |
| :------------ | :----------------------------------------- | :--------------------------------------------------------------------------------------- |
| **P3-DOC-01** | [Docs] Cập nhật tài liệu API               | Bổ sung tài liệu cho các API của module `incident`, `alert`, `file`, `analysis`.         |
| **P3-DOC-02** | [Docs] Bắt đầu Slide Thuyết trình          | Tạo file slide (PowerPoint/Google Slides), xây dựng sườn bài, mục tiêu, kiến trúc, demo. |
| **P3-DOC-03** | [Docs] Viết Hướng dẫn sử dụng (User Guide) | Bắt đầu viết hướng dẫn sử dụng cơ bản cho 2 vai trò: Admin (Web) và Citizen (Mobile).    |
