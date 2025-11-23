## Module 1: `auth` (Cung cấp Token)

Module này chịu trách nhiệm cho các endpoint _công khai_ (public) mà người dùng sử dụng để lấy danh tính (Token).

| Method   | Route                   | Vai trò        | Mô tả                                                                | Request Body (Payload)                                     | Success Response (20x)                                                   |
| :------- | :---------------------- | :------------- | :------------------------------------------------------------------- | :--------------------------------------------------------- | :----------------------------------------------------------------------- |
| **POST** | `/api/v1/auth/login`    | Public         | **(Web/Mobile)** Người dùng (Admin/Citizen) đăng nhập.               | `{ "email": "...", "password": "..." }`                    | `{ "access_token": "your_jwt_token_here", "user": { "role": "ADMIN" } }` |
| **POST** | `/api/v1/auth/register` | Public         | **(Mobile)** Người dân (Citizen) đăng ký tài khoản mới.              | `{ "email": "...", "password": "...", "fullName": "..." }` | `{ "id": "uuid", "email": "...", "role": "CITIZEN" }`                    |
| **GET**  | `/api/v1/auth/me`       | Admin, Citizen | **(Web/Mobile)** Lấy thông tin người dùng hiện tại (dựa trên token). | _Không_ (Gửi token qua Header)                             | `{ "id": "uuid", "email": "...", "role": "..." }`                        |

### Middleware / Guard (Người gác cổng)

Đây chính là "nơi" xử lý xác thực cho _tất cả_ các API cần bảo vệ.

**Luồng hoạt động như sau:**

1.  **Frontend gửi Token:** Sau khi người dùng đăng nhập (gọi `POST /api/v1/auth/login`), Frontend (Web/Mobile) sẽ lưu lại `access_token` (JWT).
2.  Khi Frontend gọi một API cần bảo vệ (ví dụ: `POST /api/v1/incident`), họ phải đính kèm token này vào **Authorization Header** của request:
    ```
    Authorization: Bearer <your_jwt_token_here>
    ```
3.  **Middleware/Guard chặn lại:** Trước khi request này đến được module `incident`, "Middleware Xác thực" sẽ chạy trước tiên.
4.  **Middleware xử lý:**
    - Nó kiểm tra xem `Authorization Header` có tồn tại và hợp lệ không.
    - Nó giải mã (verify) cái `access_token` (JWT) để đảm bảo token này là do chính server của bạn cấp phát và còn hạn sử dụng.
    - Nếu token hợp lệ, nó lấy thông tin người dùng (ví dụ: `userId` và `role`) từ trong token.
    - Nó kiểm tra xem `role` của người dùng (ví dụ: "Citizen") có được phép truy cập API này không (ví dụ: API `POST /api/v1/alert` chỉ cho phép "Admin").
5.  **Kết quả:**
    - **Nếu hợp lệ:** Request được "cho qua", đi tiếp vào xử lý logic ở module `incident`.
    - **Nếu không hợp lệ:** (Không có token, token hết hạn, sai role) Middleware sẽ chặn request và trả về lỗi `401 Unauthorized` (Chưa xác thực) hoặc `403 Forbidden` (Không có quyền).

---

## Module 2: `ingestion` (Thu thập Dữ liệu)

**Mục tiêu:** Các endpoint này không phải để Frontend gọi, mà để hệ thống tự động gọi (ví dụ: Cron Job) hoặc để kích hoạt thủ công nhằm lấy dữ liệu từ OWM và đẩy vào Orion-LD.

| Method   | Route                           | Vai trò      | Mô tả                                                     | Request Body (Payload)                          | Success Response (20x)                                                    |
| :------- | :------------------------------ | :----------- | :-------------------------------------------------------- | :---------------------------------------------- | :------------------------------------------------------------------------ |
| **POST** | `/api/v1/ingestion/air-quality` | System/Admin | Kích hoạt thu thập dữ liệu **Air Quality** từ OWM.        | `{ "city": "Hanoi" }` (hoặc rỗng để lấy tất cả) | `{ "status": "SUCCESS", "message": "Ingested 50 entities to Orion-LD." }` |
| **POST** | `/api/v1/ingestion/weather`     | System/Admin | Kích hoạt thu thập dữ liệu **Weather** từ OpenWeatherMap. | `{ "city": "Hanoi" }`                           | `{ "status": "SUCCESS", "message": "Ingested 1 entity to Orion-LD." }`    |

**Luồng hoạt động của `ingestion` (ví dụ `air-quality`):**

1.  Một Cron Job (hoặc Admin) gọi `POST /api/v1/ingestion/air-quality`.
2.  Backend `ingestion` service gọi API của OWM.
3.  Nhận JSON từ OWM.
4.  Chuyển đổi (transform) JSON đó thành định dạng **NGSI-LD Entity** (ví dụ: `AirQualityObserved`) theo chuẩn Smart Data Models.
5.  Gửi (POST/PATCH) Entity này đến **Orion-LD Context Broker** (`http://orion-ld:1026/ngsi-ld/v1/entities`).
6.  Orion-LD lưu vào MongoDB và gửi thông báo (notification) đến Backend.
7.  Backend nhận notification qua `/api/v1/notify` và lưu dữ liệu lịch sử vào PostgreSQL (Native Persistence Service).
8.  Backend trả về thông báo thành công.

---

## Module 3: `analysis` (Thống kê & Phân tích)

**Mục tiêu:** Cung cấp các số liệu thống kê tổng hợp cho **Dashboard của Admin (Web)**. Dữ liệu này chủ yếu được truy vấn từ **PostgreSQL** (nơi Native Persistence Service lưu dữ liệu lịch sử từ Orion-LD).

| Method  | Route                               | Vai trò | Mô tả                                                                                      | Request Body (Payload)                                | Success Response (20x)                                                                                                  |
| :------ | :---------------------------------- | :------ | :----------------------------------------------------------------------------------------- | :---------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------- |
| **GET** | `/api/v1/analysis/overview-stats`   | Admin   | **(Web)** Lấy các số liệu thống kê nhanh cho trang dashboard chính.                        | _Không_                                               | `{ "totalIncidents": 150, "pendingIncidents": 25, "activeAlerts": 2, "avgAqiToday": 85 }`                               |
| **GET** | `/api/v1/analysis/aqi-history`      | Admin   | **(Web)** Lấy dữ liệu lịch sử AQI cho biểu đồ (chart).                                     | _Query Params:_ `?range=7d` (7 ngày) `&stationId=...` | `{ "labels": ["17/11", ...], "datasets": [ { "label": "AQI", "data": [50, 55, 60, ...] } ] }`                           |
| **GET** | `/api/v1/analysis/weather-forecast` | Admin   | **(Web)** Lấy dữ liệu dự báo (nếu có) hoặc lịch sử thời tiết cho biểu đồ.                  | _Query Params:_ `?range=3d`                           | `{ "labels": [...], "datasets": [ { "label": "Temp", "data": [...] }, { "label": "Humidity", "data": [...] } ] }`       |
| **GET** | `/api/v1/analysis/incident-summary` | Admin   | **(Web)** Lấy thống kê tổng quan về các loại sự cố đã báo cáo (dùng cho biểu đồ tròn/cột). | _Không_                                               | `[ { "type": "FLOODING", "count": 75 }, { "type": "FALLEN_TREE", "count": 30 }, { "type": "LANDSLIDE", "count": 10 } ]` |

---

## Module 4: `alert` (Gửi Cảnh báo Khẩn)

**Mục tiêu:** Cho phép **Người quản lý (Admin)** tạo và gửi các cảnh báo (thiên tai, ô nhiễm nghiêm trọng) đến tất cả **Người dân (Citizen)**. Hệ thống sử dụng **Firebase Cloud Messaging (FCM)** để đẩy thông báo.

| Method   | Route                  | Vai trò | Mô tả                                                                                                       | Request Body (Payload)                                                                                                                                         | Success Response (20x)                                                         |
| :------- | :--------------------- | :------ | :---------------------------------------------------------------------------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **POST** | `/api/v1/alert`        | Admin   | **(Web)** Tạo và gửi một cảnh báo khẩn cấp mới. Backend sẽ xử lý việc gửi tin này qua FCM.                  | `{ "level": "HIGH", "title": "Cảnh báo ngập lụt khẩn cấp!", "message": "Khu vực X dự kiến ngập sâu...", "area": { "type": "Polygon", "coordinates": [...] } }` | `{ "id": "uuid", "status": "SENT", "sentCount": 1500, ... }`                   |
| **GET**  | `/api/v1/alert`        | Admin   | **(Web)** Lấy lịch sử các cảnh báo đã gửi (để quản lý).                                                     | _Query Params:_ `?page=1&limit=10&level=HIGH`                                                                                                                  | `{ "data": [...], "totalPages": 3, "currentPage": 1 }`                         |
| **GET**  | `/api/v1/alert/active` | Citizen | **(Mobile)** Lấy các cảnh báo _đang có hiệu lực_ để hiển thị trong app (ví dụ: các cảnh báo trong 24h qua). | _Không_                                                                                                                                                        | `[ { "id": "uuid", "title": "...", "message": "...", "sentAt": "..." }, ... ]` |

**Lưu ý cho module `alert`:**

- **Đăng ký Token FCM:** Sẽ cần một endpoint (ví dụ: `POST /api/v1/user/fcm-token`) để Mobile App (Citizen) gửi FcmToken của thiết bị lên server khi người dùng đăng nhập. Module `alert` sẽ lấy danh sách token này từ DB để gửi thông báo.

---

## Module 5: `incident` (Quản lý Báo cáo Sự cố)

**Mục tiêu:** Cho phép **Người dân (Citizen)** gửi báo cáo sự cố (ngập lụt, cây đổ...) và cho phép **Người quản lý (Admin)** xem, duyệt các báo cáo này.

| Method   | Route                         | Vai trò | Mô tả                                                                                    | Request Body (Payload)                                                                                                                         | Success Response (20x)                                                         |
| :------- | :---------------------------- | :------ | :--------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------- | :----------------------------------------------------------------------------- |
| **POST** | `/api/v1/incident`            | Citizen | **(Mobile)** Gửi một báo cáo sự cố mới.                                                  | `{ "type": "FLOODING", "description": "...", "location": { "type": "Point", "coordinates": [long, lat] }, "imageUrls": ["minio-url-1", ...] }` | `{ "id": "uuid", "status": "PENDING", ... }`                                   |
| **GET**  | `/api/v1/incident`            | Admin   | **(Web)** Lấy danh sách tất cả sự cố (có phân trang, lọc).                               | _Query Params:_ `?page=1&limit=10&status=PENDING&type=FLOODING`                                                                                | `{ "data": [...], "totalPages": 5, "currentPage": 1 }`                         |
| **GET**  | `/api/v1/incident/my-reports` | Citizen | **(Mobile)** Lấy lịch sử báo cáo của chính người dùng đó.                                | _Query Params:_ `?page=1&limit=10`                                                                                                             | `{ "data": [...], "totalPages": 2, "currentPage": 1 }`                         |
| **GET**  | `/api/v1/incident/active`     | All     | **(Web/Mobile)** Lấy các sự cố _đã được duyệt_ (VERIFIED) để hiển thị lên bản đồ chung.  | _Không_                                                                                                                                        | `[ { "id": "uuid", "type": "...", "location": ... }, ... ]`                    |
| **GET**  | `/api/v1/incident/:id`        | Admin   | **(Web)** Lấy chi tiết một sự cố.                                                        | _Không_                                                                                                                                        | `{ "id": "uuid", "description": "...", "images": [...], "reportedBy": "..." }` |
| **PUT**  | `/api/v1/incident/:id/status` | Admin   | **(Web)** Cập nhật trạng thái sự cố (ví dụ: từ `PENDING` -> `VERIFIED` hoặc `REJECTED`). | `{ "status": "VERIFIED", "notes": "Đã xác nhận." }`                                                                                            | `{ "id": "uuid", "status": "VERIFIED", ... }`                                  |

**Lưu ý cho module `file/` (liên quan):**

- **POST** `/api/v1/file/upload` (Role: Citizen): Nhận file ảnh (FormData), tải lên MinIO, và trả về URL của ảnh. Mobile sẽ gọi API này _trước khi_ gọi `POST /api/v1/incident`.
