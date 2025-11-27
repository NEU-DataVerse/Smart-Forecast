# 🌍 **Smart Forecast – Smart Environmental Alert Platform**

## 🎯 **Mục tiêu**

Smart Forecast là nền tảng **giám sát và cảnh báo môi trường đô thị thông minh**, hướng tới hỗ trợ **chuyển đổi số** cho các thành phố hiện đại.  
Dự án tham gia cuộc thi **OLP'2025 – Ứng dụng dữ liệu mở liên kết phục vụ chuyển đổi số**, tuân thủ chuẩn **NGSI-LD** và sử dụng **Smart Data Models (FIWARE)**.

---

## 🧩 **Ý tưởng cốt lõi**

Smart Forecast thu thập dữ liệu **chất lượng không khí (Air Quality)** và **thời tiết (Weather)** từ các nguồn mở như **OpenWeatherMap**, sau đó:

- Phân tích, hiển thị và cảnh báo tự động khi vượt ngưỡng.
- Cho phép **người quản lý** gửi cảnh báo thiên tai, xem báo cáo và thống kê.
- Cho phép **người dân** nhận thông báo, đồng thời **gửi báo cáo sự cố** (ngập lụt, cây đổ, sạt lở...) kèm **vị trí GPS và ảnh (chụp trực tiếp không cho tải từ ảnh)** đến trung tâm.

---

## 📋 **Yêu cầu chức năng**

### I. Người dân (Citizen App – React Native + Expo)

| Mã  | Chức năng                                          | Mô tả                                                                                                     |
| --- | -------------------------------------------------- | --------------------------------------------------------------------------------------------------------- |
| C1  | Đăng nhập / đăng ký / xác thực JWT (Google OAuth2) | Người dân tạo tài khoản bằng email để nhận thông báo.                                                     |
| C2  | Xem dữ liệu môi trường theo vị trí                 | Ứng dụng tự định vị GPS và hiển thị các chỉ số AQI, PM2.5, nhiệt độ, độ ẩm,… từ Context Broker (qua API). |
| C3  | Xem bản đồ đô thị (Live Map)                       | Hiển thị bản đồ cảm biến theo dõi chất lượng không khí và thời tiết; bản đồ sự cố,… .                     |
| C4  | Nhận cảnh báo tự động (Push Notification)          | Khi hệ thống phát hiện ô nhiễm/thiên tai, người dùng nhận cảnh báo qua Firebase Cloud Messaging.          |
| C5  | Gửi thông báo sự cố (Incident Report)              | Người dân chụp ảnh, chọn loại sự cố (ngập, sạt lở, ô nhiễm), nhập mô tả, gửi vị trí → lưu vào hệ thống.   |
| C6  | Theo dõi lịch sử cảnh báo & báo cáo đã gửi         | Người dân xem danh sách cảnh báo và sự cố họ đã báo trước đó.                                             |
| C7  | Widget                                             | Tạo widget cho ứng dụng                                                                                   |

### II. Quản trị viên / Nhà quản lý (Admin Dashboard – Next.js)

| Mã  | Chức năng                                       | Mô tả                                                                                                   |
| --- | ----------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| A1  | Đăng nhập quản trị                              | Quản trị viên đăng nhập bằng tài khoản quản lý, phân vai "Admin".                                       |
| A2  | Theo dõi dữ liệu môi trường thời gian thực      | Hiển thị bản đồ cảm biến, biểu đồ AQI, nhiệt độ, mưa, gió theo thời gian. Hiển thị bản đồ sự cố.        |
| A3  | Xem & quản lý thông báo sự cố (Incident Report) | Xem danh sách sự cố do người dân gửi; có thể xác nhận, gán trạng thái xử lý ("đang xử lý", "hoàn tất"). |
| A4  | Tạo và gửi cảnh báo đô thị (Disaster Alert)     | Soạn thông báo cảnh báo (ví dụ: "Cảnh báo ngập Quận 7") → hệ thống gửi tự động đến người dân qua FCM.   |
| A5  | Xuất báo cáo (PDF/CSV)                          | Xuất thống kê AQI / thời tiết / sự cố trong tháng, quý, năm.                                            |

---

## 👥 **Thành viên nhóm NEU-DataVerse**

| Thành viên                 | Vai trò                                    | Nhiệm vụ chính                                                                      |
| -------------------------- | ------------------------------------------ | ----------------------------------------------------------------------------------- |
| **Khải (Mkhai205)**        | PM, Backend, DevOps                        | Quản lý dự án (PM), phát triển backend (Node.js, NGSI-LD), thiết lập Docker & CI/CD |
| **Đạt (NGUYENTHANHDATHH)** | Frontend Web, Hỗ trợ Mobile                | Xây dựng dashboard (Next.js), bản đồ, chart; tích hợp API                           |
| **Bích (BichCan)**         | Frontend Mobile, Hỗ trợ Web, Viết tài liệu | Phát triển app Expo React Native, thiết kế UI/UX, viết tài liệu và hướng dẫn        |

---

## 🧠 **Luồng hoạt động tổng quát**

1. **Thu thập dữ liệu (Ingestion Module)**
   - Lấy dữ liệu từ API OpenWeatherMap.
   - Chuẩn hoá về dạng **NGSI-LD Entity (AirQualityObserved, WeatherObserved)**.
   - Gửi vào **Orion-LD Context Broker**.

2. **Xử lý ngữ cảnh (Orion-LD)**
   - Lưu trữ và cung cấp dữ liệu ngữ cảnh môi trường theo chuẩn FIWARE.
   - Đồng bộ dữ liệu lịch sử sang **PostgreSQL**.

3. **Phân tích & cảnh báo (Backend Node.js)**
   - Xử lý dữ liệu từ Orion-LD và DB.
   - Gửi **cảnh báo khẩn (Alert)** đến người dân qua **Firebase Cloud Messaging**.
   - Tiếp nhận **báo cáo sự cố** từ người dân (ảnh, vị trí, mô tả).
   - Lưu trữ ảnh vào **MinIO** và thông tin vào **PostgreSQL**.

4. **Hiển thị & tương tác (Frontend)**
   - **Web App (Next.js):** Dashboard quản lý, thống kê, bản đồ cảnh báo.
   - **Mobile App (Expo React Native):** Nhận cảnh báo, gửi báo cáo sự cố.

---

## 🧱 **Kiến trúc hệ thống**

```
[OWM APIs]
        ↓
[Backend (Node.js)] ←→ [Orion-LD Context Broker] ←→ [MongoDB]
        ↓
[PostgreSQL] (lưu dữ liệu lịch sử)
        ↓
[MinIO] (lưu ảnh sự cố)
        ↓
[Firebase Cloud Messaging] (gửi cảnh báo)
```

Frontend giao tiếp qua Backend REST API:

```
Web (Next.js)  → Backend
Mobile (Expo)  → Backend
```

---

## ⚙️ **Công nghệ chính**

| Thành phần           | Công nghệ                      |
| -------------------- | ------------------------------ |
| **Backend**          | Node.js (NestJS)               |
| **Frontend Web**     | Next.js + Tailwind CSS         |
| **Mobile App**       | Expo React Native              |
| **Database**         | PostgreSQL + MongoDB           |
| **Storage**          | MinIO (S3-compatible)          |
| **Context Broker**   | Orion-LD (FIWARE)              |
| **Data Source**      | OpenWeatherMap                 |
| **Notification**     | Firebase Cloud Messaging (FCM) |
| **Containerization** | Docker & Docker Compose        |
| **Auth**             | JWT (Admin / Citizen)          |
| **License**          | MIT                            |

---

## 🧩 **Cấu trúc repo (Monorepo)**

```
smart-forecast/
├── backend/        # Node.js (NestJS)
├── web/            # Web Dashboard (Next.js)
├── mobile/         # Mobile App (Expo React Native)
├── shared/         # Models & constants chung (TypeScript)
├── docs/           # Tài liệu, hướng dẫn, slide
├── docker-compose.yml
├── package.json           # Root package
├── pnpm-workspace.yaml    # PNPM workspace config
├── .env.example
└── README.md
```

### 🔹 PNPM Workspace

```yaml
packages:
  - 'backend'
  - 'web'
  - 'mobile'
  - 'shared'
```

---

## 🧠 **Chiến lược demo**

| Thành phần              | Cách demo                                             |
| ----------------------- | ----------------------------------------------------- |
| **Backend**             | Chạy bằng Docker Compose (`localhost:8000`)           |
| **Web**                 | Dashboard qua `localhost:3000`                        |
| **Mobile**              | Expo Go (`npx expo start --tunnel`) hoặc build `.apk` |
| **Orion-LD, DB, MinIO** | Tự động khởi động trong Docker Compose                |

---

## ✅ **Kết quả kỳ vọng**

- Hệ thống hoạt động hoàn chỉnh, đóng gói trong Docker.
- Đáp ứng 2 vai trò: **Quản lý** và **Người dân**.
- Tuân thủ chuẩn **NGSI-LD / Smart Data Models**.
- Có thể triển khai thực tế cho thành phố hoặc khu đô thị.
- Có khả năng mở rộng thêm dữ liệu khác (giao thông, năng lượng,...).

---

_Nhóm NEU-DataVerse – OLP'2025_  
**"Smart Forecast – Khi dữ liệu mở trở thành cảnh báo sớm cho cộng đồng."**
