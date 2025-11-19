## 🌊 Giai đoạn 2: Luồng dữ liệu chính (17/11 – 23/11)

**Mục tiêu:** Hoàn thành luồng dữ liệu một chiều: từ API bên ngoài -> Context Broker -> Hiển thị lên Web/Mobile.

### Epic 1: [P2] Phát triển Module Thu thập Dữ liệu (Ingestion)

- **Người phụ trách:** Khải (Backend)
- **Mô tả:** Xây dựng logic để lấy dữ liệu từ các nguồn bên ngoài, chuẩn hóa NGSI-LD và đẩy vào Context Broker.

| ID            | Issue (Công việc)                               | Mô tả chi tiết                                                                                              |
| :------------ | :---------------------------------------------- | :---------------------------------------------------------------------------------------------------------- |
| **P2-ING-01** | [Backend] Phát triển service gọi OWM            | Tạo logic gọi API OWM để lấy dữ liệu chất lượng không khí (AQI) cho các vị trí đã định.                     |
| **P2-ING-02** | [Backend] Phát triển service gọi OpenWeatherMap | Tạo logic gọi API OWM để lấy dữ liệu thời tiết (Nhiệt độ, độ ẩm...)                                         |
| **P2-ING-03** | [Backend] Chuẩn hóa NGSI-LD (AirQuality)        | Viết hàm chuyển đổi (transformer) dữ liệu JSON từ OWM sang `AirQualityObserved` (theo Smart Data Models).   |
| **P2-ING-04** | [Backend] Chuẩn hóa NGSI-LD (Weather)           | Viết hàm chuyển đổi dữ liệu JSON từ OWM sang `WeatherObserved` (theo Smart Data Models).                    |
| **P2-ING-05** | [Backend] Đẩy dữ liệu vào Orion-LD              | Tạo service tương tác với Orion-LD (gọi `POST /ngsi-ld/v1/entities` hoặc `.../upsert`) để cập nhật dữ liệu. |
| **P2-ING-06** | [Backend] Cấu hình Cron Job                     | Thiết lập một tác vụ lặp lại (ví dụ: mỗi 30 phút) để tự động chạy luồng ingestion (P2-ING-01 đến 05).       |

### Epic 2: [P2] Cấu hình Đồng bộ Dữ liệu Lịch sử (Native Persistence)

- **Người phụ trách:** Khải (Backend)
- **Mô tả:** Đảm bảo dữ liệu ngữ cảnh (context data) từ Orion-LD được lưu trữ lâu dài trong PostgreSQL thông qua Native Persistence Service để phục vụ phân tích.

| ID            | Issue (Công việc)                          | Mô tả chi tiết                                                                                                   |
| :------------ | :----------------------------------------- | :--------------------------------------------------------------------------------------------------------------- |
| **P2-PER-01** | [Backend] Tạo PersistenceModule            | Tạo module NestJS xử lý NGSI-LD notifications từ Orion-LD (Controller, Service, Entities).                       |
| **P2-PER-02** | [Backend] Implement Notification Endpoint  | Tạo endpoint `POST /api/v1/notify` để nhận NGSI-LD notifications từ Orion-LD subscriptions.                      |
| **P2-PER-03** | [Backend] Parser NGSI-LD Normalized Format | Viết service parse NGSI-LD normalized format và extract values từ object structure `{ type, value }`.            |
| **P2-PER-04** | [Backend] Tạo Time-Series Entities         | Tạo TypeORM entities cho `AirQualityObserved` và `WeatherObserved` với indexes phù hợp cho time-series queries.  |
| **P2-PER-05** | [Backend] Tạo Subscription Service         | Implement service tự động tạo subscriptions trong Orion-LD khi backend khởi động, trỏ về endpoint `/notify`.     |
| **P2-PER-06** | [Kiểm thử] Xác thực luồng dữ liệu          | Chạy ingestion và kiểm tra PostgreSQL để đảm bảo notifications được nhận và dữ liệu lịch sử được lưu thành công. |

### Epic 3: [P2] Xây dựng API Đọc Dữ liệu Môi trường

- **Người phụ trách:** Khải (Backend)
- **Mô tả:** Cung cấp API REST cho Web và Mobile sử dụng để hiển thị dữ liệu môi trường.

| ID            | Issue (Công việc)                          | Mô tả chi tiết                                                                                                       |
| :------------ | :----------------------------------------- | :------------------------------------------------------------------------------------------------------------------- |
| **P2-API-01** | [Backend] API Lấy dữ liệu Real-time        | Tạo `GET /api/v1/airquality/now` (và `.../weather/now`) để lấy dữ liệu _mới nhất_ từ Orion-LD.                       |
| **P2-API-02** | [Backend] API Lấy dữ liệu Lịch sử (Chart)  | Tạo `GET /api/v1/airquality/history` (và `.../weather/history`) để lấy dữ liệu cho biểu đồ (truy vấn từ PostgreSQL). |
| **P2-API-03** | [Backend] API Lấy danh sách Trạm quan trắc | Tạo `GET /api/v1/stations` để trả về danh sách các trạm quan trắc (vị trí, tên) cho bản đồ.                          |

### Epic 4: [P2] Phát triển Dashboard Hiển thị Dữ liệu (Web)

- **Người phụ trách:** Đạt (Frontend Web)
- **Mô tả:** Xây dựng giao diện trang Dashboard chính, tích hợp bản đồ và biểu đồ dữ liệu.

| ID            | Issue (Công việc)              | Mô tả chi tiết                                                                               |
| :------------ | :----------------------------- | :------------------------------------------------------------------------------------------- |
| **P2-WEB-01** | [Web] Tích hợp API (Dashboard) | Gọi các API (P2-API-01, 02) để lấy và hiển thị dữ liệu AQI, thời tiết lên các widget.        |
| **P2-WEB-02** | [Web] Tích hợp Bản đồ (Map)    | Cài đặt Mapbox (hoặc Leaflet), gọi API P2-API-03 để hiển thị vị trí các trạm quan trắc.      |
| **P2-WEB-03** | [Web] Hiển thị Marker (Bản đồ) | Khi nhấn vào Marker (trạm) trên bản đồ, hiển thị popup với thông tin AQI/thời tiết mới nhất. |
| **P2-WEB-04** | [Web] Tích hợp Biểu đồ (Chart) | Dùng Chart.js (hoặc tương đương), gọi API P2-API-02 để vẽ biểu đồ lịch sử AQI.               |

### Epic 5: [P2] Phát triển Màn hình chính (Mobile)

- **Người phụ trách:** Bích (Frontend Mobile)
- **Mô tả:** Hoàn thiện màn hình chính (Home) của app và màn hình báo cáo sự cố (UI).

| ID            | Issue (Công việc)                       | Mô tả chi tiết                                                                                                                  |
| :------------ | :-------------------------------------- | :------------------------------------------------------------------------------------------------------------------------------ |
| **P2-MOB-01** | [Mobile] Tích hợp API (Home)            | Gọi API (P2-API-01) để lấy và hiển thị chỉ số AQI/thời tiết dựa trên vị trí GPS của người dùng (hoặc vị trí mặc định).          |
| **P2-MOB-02** | [Mobile] Hoàn thiện UI/UX Báo cáo Sự cố | Hoàn thiện giao diện Form Gửi báo cáo (chọn loại sự cố, nhập mô tả, nút chụp ảnh, chọn vị trí). _Lưu ý: Chưa tích hợp API vội._ |
| **P2-MOB-03** | [Mobile] Tích hợp Quyền (Permission)    | Xử lý việc xin quyền truy cập Vị trí (GPS) và Camera/Thư viện ảnh cho màn hình báo cáo.                                         |

### Epic 6: [P2] Cập nhật Tài liệu

- **Người phụ trách:** Bích (Docs)
- **Mô tả:** Ghi lại các API đã phát triển và hoàn thiện tài liệu kiến trúc.

| ID            | Issue (Công việc)                 | Mô tả chi tiết                                                                                     |
| :------------ | :-------------------------------- | :------------------------------------------------------------------------------------------------- |
| **P2-DOC-01** | [Docs] Viết tài liệu API          | Sử dụng Postman/Swagger (hoặc `API.md`) để mô tả các API đã hoàn thành trong P2-API-xx.            |
| **P2-DOC-02** | [Docs] Hoàn thiện Sơ đồ Kiến trúc | Cập nhật sơ đồ trong `docs/ARCHITECTURE.md` để thể hiện rõ luồng Native Persistence -> PostgreSQL. |
