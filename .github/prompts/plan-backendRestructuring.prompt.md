### Cấu trúc thư mục Backend

```
backend/
├── src/
│   ├── main.ts                          # Entry point
│   ├── app.module.ts                    # Root module
│   ├── app.controller.ts
│   ├── app.service.ts
│   │
│   ├── common/                          # 🔧 Shared utilities
│   │   ├── decorators/
│   │   │   ├── roles.decorator.ts
│   │   │   ├── public.decorator.ts
│   │   │   └── current-user.decorator.ts
│   │   ├── guards/
│   │   │   ├── jwt-auth.guard.ts
│   │   │   ├── roles.guard.ts
│   │   │   └── throttle.guard.ts
│   │   ├── interceptors/
│   │   │   ├── logging.interceptor.ts
│   │   │   ├── timeout.interceptor.ts
│   │   │   └── transform.interceptor.ts
│   │   ├── transformers/
│   │   │   └── ngsi-ld.transformer.ts
│   │   ├── filters/
│   │   │   └── http-exception.filter.ts
│   │   └── pipes/
│   │       └── validation.pipe.ts
│   │
│   ├── config/                          # ⚙️ Configuration
│   │   ├── index.ts
│   │   ├── app.config.ts
│   │   ├── database.config.ts
│   │   ├── jwt.config.ts
│   │   ├── orion.config.ts
│   │   ├── minio.config.ts
│   │   └── firebase.config.ts
│   │
│   ├── auth/                            # 🔐 Authentication
│   │   ├── auth.module.ts
│   │   ├── auth.controller.ts
│   │   ├── auth.service.ts
│   │   ├── dto/
│   │   ├── interfaces/
│   │   └── strategies/
│   │
│   ├── user/                            # 👤 User Management
│   │   ├── user.module.ts
│   │   ├── user.controller.ts
│   │   ├── user.service.ts
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── ingestion/                       # 📥 Data Ingestion (MODULE MỚI)
│   │   ├── ingestion.module.ts
│   │   ├── ingestion.service.ts         # Orchestrator
│   │   ├── ingestion.controller.ts
│   │   ├── providers/
│   │   │   ├── openaq.provider.ts       # Di chuyển từ airquality
│   │   │   ├── openweathermap.provider.ts # Di chuyển từ weather
│   │   │   └── orion-client.provider.ts
│   │   ├── transformers/
│   │   │   ├── airquality.transformer.ts
│   │   │   └── weather.transformer.ts
│   │   ├── schedulers/
│   │   │   └── ingestion.scheduler.ts   # Cron jobs
│   │   └── dto/
│   │
│   ├── airquality/                      # 🌫️ Air Quality
│   │   ├── airquality.module.ts
│   │   ├── airquality.controller.ts
│   │   ├── airquality.service.ts        # Query data only
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── weather/                         # 🌤️ Weather
│   │   ├── weather.module.ts
│   │   ├── weather.controller.ts
│   │   ├── weather.service.ts           # Query data only
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── alert/                           # 🚨 Alert Management
│   │   ├── alert.module.ts
│   │   ├── alert.controller.ts
│   │   ├── alert.service.ts
│   │   ├── entities/
│   │   ├── dto/
│   │   ├── processors/
│   │   │   ├── threshold.processor.ts   # Auto alerts
│   │   │   └── alert-rules.processor.ts
│   │   └── schedulers/
│   │       └── alert-monitor.scheduler.ts
│   │
│   ├── notification/                    # 📢 Notification (MODULE MỚI)
│   │   ├── notification.module.ts
│   │   ├── notification.service.ts
│   │   ├── providers/
│   │   │   ├── fcm.provider.ts          # Firebase Cloud Messaging
│   │   │   ├── email.provider.ts        # Email (future)
│   │   │   └── sms.provider.ts          # SMS (future)
│   │   ├── entities/
│   │   └── dto/
│   │
│   ├── incident/                        # 📋 Incident Reporting
│   │   ├── incident.module.ts
│   │   ├── incident.controller.ts
│   │   ├── incident.service.ts
│   │   ├── file.service.ts              # Upload to MinIO
│   │   ├── entities/
│   │   │   ├── incident.entity.ts
│   │   │   └── incident-photo.entity.ts
│   │   └── dto/
│   │
│   ├── analysis/                        # 📊 Analysis & Statistics
│   │   ├── analysis.module.ts
│   │   ├── analysis.controller.ts
│   │   ├── analysis.service.ts
│   │   ├── processors/
│   │   │   ├── aqi-calculator.ts
│   │   │   ├── trend-analyzer.ts
│   │   │   └── correlation.analyzer.ts
│   │   └── dto/
│   │
│   └── shared/                          # 🔄 Shared
│       ├── interfaces/
│       ├── constants/
│       └── utils/
```

### Giải thích chi tiết các thay đổi

1.  **Tạo Module `ingestion` (Thu thập dữ liệu):**

    - **Lý do:** Tách biệt hoàn toàn logic thu thập dữ liệu thô từ các API bên ngoài (OpenAQ, OpenWeatherMap) ra khỏi các module nghiệp vụ như `airquality` và `weather`.
    - **Lợi ích:**
      - **Dễ quản lý:** Toàn bộ code liên quan đến việc lấy và chuẩn hóa dữ liệu nằm ở một nơi.
      - **Dễ mở rộng:** Khi cần thêm nguồn dữ liệu mới (ví dụ: dữ liệu giao thông), bạn chỉ cần thêm một service mới trong module này.
      - Các module `airquality` và `weather` giờ chỉ cần tập trung vào việc truy vấn và xử lý dữ liệu đã có trong hệ thống (từ Orion-LD hoặc PostgreSQL).

2.  **Tạo Module `notification` (Gửi thông báo):**

    - **Lý do:** Tách logic gửi thông báo (hiện tại là FCM) ra khỏi module `alert`.
    - **Lợi ích:**
      - **Tái sử dụng:** Bất kỳ module nào khác (ví dụ: `incident` muốn gửi thông báo khi sự cố được xử lý) đều có thể inject `NotificationService` để sử dụng.
      - **Linh hoạt:** Dễ dàng thêm các kênh thông báo mới (Email, SMS) mà không ảnh hưởng đến logic tạo cảnh báo của module `alert`.

3.  **Hợp nhất `file` vào `incident`:**

    - **Lý do:** Chức năng upload file hiện chỉ phục vụ cho việc người dân gửi ảnh báo cáo sự cố.
    - **Lợi ích:**
      - **Tăng tính gắn kết:** Logic upload ảnh và logic xử lý sự cố nằm chung trong một module, giúp code dễ hiểu và bảo trì hơn.
      - Nếu sau này có chức năng upload file cho một module khác (ví dụ: upload avatar cho `user`), bạn có thể tạo một `FileService` tương tự trong module `user` hoặc tách ra thành một module `file` chung nếu cần.

4.  **Làm rõ vai trò của `alert` và `analysis`:**
    - **`alert`:** Module này giờ chỉ chịu trách nhiệm tạo ra các bản tin cảnh báo (ví dụ: "Cảnh báo ngập lụt tại khu vực X"). Sau đó, nó sẽ gọi `NotificationService` để thực hiện việc gửi đi.
    - **`analysis`:** Module này tập trung vào việc thống kê, tổng hợp dữ liệu từ nhiều nguồn (chất lượng không khí, thời tiết, sự cố) để tạo ra các báo cáo, biểu đồ cho dashboard của người quản lý.
