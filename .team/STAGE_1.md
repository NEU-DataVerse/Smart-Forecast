## 🚀 Giai đoạn 1: Nền tảng & Cấu hình (10/11 – 16/11)

**Mục tiêu:** Thiết lập toàn bộ môi trường phát triển, "bộ khung" (boilerplate) của các dự án và dịch vụ xác thực cơ bản.

### Epic 1: [P1] Thiết lập Môi trường & Hạ tầng DevOps

- **Người phụ trách:** Khải (DevOps)
- **Mô tả:** Chuẩn bị toàn bộ repository và các dịch vụ hạ tầng để các thành viên khác có thể bắt đầu phát triển.

| ID            | Issue (Công việc)                 | Mô tả chi tiết                                                                                         |
| :------------ | :-------------------------------- | :----------------------------------------------------------------------------------------------------- |
| **P1-DEV-01** | Khởi tạo Monorepo                 | Tạo repository, cấu hình NPM Workspace với 4 package: `backend`, `web`, `mobile`, `shared`.            |
| **P1-DEV-02** | Cấu hình Docker Compose (Core)    | Viết file `docker-compose.yml` khởi chạy: **Orion-LD Context Broker** và **MongoDB** (cho Orion).      |
| **P1-DEV-03** | Cấu hình Docker Compose (Storage) | Thêm **PostgreSQL** (lưu dữ liệu lịch sử, user) và **MinIO** (lưu ảnh) vào `docker-compose.yml`.       |
| **P1-DEV-04** | Thiết lập CI/CD cơ bản            | Cấu hình GitHub Actions (hoặc tương đương) để chạy linting/build khi push code (nếu có thời gian).     |
| **P1-DEV-05** | Khởi tạo package `shared`         | Định nghĩa các `interface` (TypeScript) và `constants` (ví dụ: `UserRole`, `IncidentType`) dùng chung. |

### Epic 2: [P1] Xây dựng Module Xác thực (Auth)

- **Người phụ trách:** Khải (Backend), Đạt & Bích (Frontend)
- **Mô tả:** Hoàn thiện luồng đăng ký, đăng nhập JWT cho cả Admin và Citizen.

| ID             | Issue (Công việc)                             | Mô tả chi tiết                                                                                           | Người thực hiện |
| :------------- | :-------------------------------------------- | :------------------------------------------------------------------------------------------------------- | :-------------- |
| **P1-AUTH-01** | [Backend] Thiết kế DB (User)                  | Tạo bảng `User` (trong PostgreSQL) lưu thông tin (email, password hash, role: `ADMIN` / `CITIZEN`).      | Khải            |
| **P1-AUTH-02** | [Backend] Implement API `auth/register`       | Tạo API `POST /api/v1/auth/register` cho **Citizen** đăng ký tài khoản mới.                              | Khải            |
| **P1-AUTH-03** | [Backend] Implement API `auth/login`          | Tạo API `POST /api/v1/auth/login` (dùng JWT). Trả về `access_token` và thông tin `user`.                 | Khải            |
| **P1-AUTH-04** | [Backend] Implement JWT Guard & API `auth/me` | Tạo một "Guard" (Middleware) để bảo vệ các API khác. Tạo API `GET /api/v1/auth/me` để FE kiểm tra token. | Khải            |
| **P1-AUTH-05** | [Web] Tích hợp API Login                      | (Sau khi P1-AUTH-03 hoàn thành) Tích hợp API `login` vào UI trang Login. Lưu token vào state/storage.    | Đạt             |
| **P1-AUTH-06** | [Mobile] Tích hợp API Login/Register          | (Sau khi P1-AUTH-02, 03 hoàn thành) Tích hợp API `login` và `register`. Lưu token vào SecureStorage.     | Bích            |

### Epic 3: [P1] Khởi tạo "Bộ khung" Backend (Node.js)

- **Người phụ trách:** Khải (Backend)
- **Mô tả:** Thiết lập một server Node.js (NestJS/Fastify) sẵn sàng để phát triển các module nghiệp vụ.

| ID           | Issue (Công việc)      | Mô tả chi tiết                                                                                  |
| :----------- | :--------------------- | :---------------------------------------------------------------------------------------------- |
| **P1-BE-01** | Khởi tạo dự án Node.js | Cài đặt NestJS trong package `backend/`.                                                        |
| **P1-BE-02** | Cấu hình cơ sở dữ liệu | Thiết lập kết nối đến PostgreSQL (cho user) và chuẩn bị kết nối đến Orion-LD.                   |
| **P1-BE-03** | Cấu trúc Module        | Tạo cấu trúc thư mục cho các module chính (ví dụ: `auth`, `user`, `airquality`, `incident`...). |
| **P1-BE-04** | Cấu hình Environment   | Thiết lập file `.env` và config service để quản lý biến môi trường.                             |

### Epic 4: [P1] Khởi tạo "Bộ khung" Web Dashboard (Next.js)

- **Người phụ trách:** Đạt (Frontend Web)
- **Mô tả:** Xây dựng giao diện cơ bản cho trang quản trị, tập trung vào layout và trang đăng nhập.

| ID            | Issue (Công việc)      | Mô tả chi tiết                                                                          |
| :------------ | :--------------------- | :-------------------------------------------------------------------------------------- |
| **P1-WEB-01** | Khởi tạo dự án Next.js | Cài đặt Next.js + Tailwind CSS trong package `web/`.                                    |
| **P1-WEB-02** | Dựng Layout chính      | Tạo `Layout` chung cho trang Dashboard (gồm Sidebar, Header, vùng Content).             |
| **P1-WEB-03** | Dựng UI trang Login    | Hoàn thiện giao diện (chưa tích hợp API) cho trang Đăng nhập.                           |
| **P1-WEB-04** | Cấu hình Routing       | Thiết lập các route cơ bản (ví dụ: `/login`, `/` (dashboard), `/incidents`, `/alerts`). |

### Epic 5: [P1] Khởi tạo "Bộ khung" Mobile App (Expo)

- **Người phụ trách:** Bích (Frontend Mobile)
- **Mô tả:** Xây dựng giao diện (UI) và luồng điều hướng (navigation) cơ bản cho ứng dụng di động.

| ID            | Issue (Công việc)               | Mô tả chi tiết                                                                                                 |
| :------------ | :------------------------------ | :------------------------------------------------------------------------------------------------------------- |
| **P1-MOB-01** | Khởi tạo dự án Expo             | Cài đặt Expo (React Native) trong package `mobile/`.                                                           |
| **P1-MOB-02** | Cấu hình Navigation             | Cài đặt React Navigation, thiết lập luồng (Stack) cho Auth (Login, Register) và App (Home, Report).            |
| **P1-MOB-03** | Dựng UI (Mockup) màn hình chính | Thiết kế giao diện (UI) cho màn hình Login, màn hình Trang chủ (hiển thị AQI), và màn hình Gửi báo cáo (form). |

### Epic 6: [P1] Khởi tạo Tài liệu Dự án

- **Người phụ trách:** Bích (Docs)
- **Mô tả:** Soạn thảo các tài liệu nền tảng của dự án.

| ID            | Issue (Công việc)               | Mô tả chi tiết                                                                                                  |
| :------------ | :------------------------------ | :-------------------------------------------------------------------------------------------------------------- |
| **P1-DOC-01** | Viết `README.md` chính          | Cập nhật file `README.md` ở thư mục gốc (root), mô tả dự án, mục tiêu, công nghệ.                               |
| **P1-DOC-02** | Viết tài liệu Hướng dẫn cài đặt | Viết trong `docs/SETUP.md`, hướng dẫn cách chạy dự án (clone, install, `docker compose up`) cho thành viên mới. |
| **P1-DOC-03** | Viết tài liệu Kiến trúc         | (Bắt đầu) Viết trong `docs/ARCHITECTURE.md`, mô tả sơ đồ kiến trúc và luồng dữ liệu.                            |
