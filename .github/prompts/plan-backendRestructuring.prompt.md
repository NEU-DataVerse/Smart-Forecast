### Cấu trúc thư mục Backend (Cải tiến)

```
backend/
├── src/
│   ├── main.ts                          # 🚀 Entry point - Khởi tạo NestJS app
│   ├── app.module.ts                    # 🏠 Root module - Import tất cả modules
│   ├── app.controller.ts                # 🎯 Health check endpoint
│   ├── app.service.ts                   # 🔧 App-level services
│   │
│   ├── common/                          # 🔧 Shared utilities (Cross-cutting concerns)
│   │   ├── decorators/                  # Custom decorators
│   │   │   ├── roles.decorator.ts           # @Roles('admin', 'citizen')
│   │   │   ├── public.decorator.ts          # @Public() - Bypass JWT
│   │   │   ├── current-user.decorator.ts    # @CurrentUser() - Extract user from request
│   │   │   └── api-response.decorator.ts    # @ApiResponse() - Swagger docs
│   │   ├── guards/                      # Route guards
│   │   │   ├── jwt-auth.guard.ts            # Verify JWT token
│   │   │   ├── roles.guard.ts               # Check user roles (RBAC)
│   │   │   └── throttle.guard.ts            # Rate limiting
│   │   ├── interceptors/                # Request/Response interceptors
│   │   │   ├── logging.interceptor.ts       # Log all requests
│   │   │   ├── timeout.interceptor.ts       # Request timeout
│   │   │   └── transform.interceptor.ts     # Transform response format
│   │   ├── transformers/                # Data transformers
│   │   │   └── ngsi-ld.transformer.ts       # Convert to/from NGSI-LD format
│   │   ├── filters/                     # Exception filters
│   │   │   ├── http-exception.filter.ts     # Handle HTTP exceptions
│   │   │   └── all-exceptions.filter.ts     # Catch-all exception handler
│   │   ├── pipes/                       # Validation pipes
│   │   │   ├── validation.pipe.ts           # DTO validation
│   │   │   └── parse-objectid.pipe.ts       # Parse MongoDB ObjectId
│   │   └── middleware/                  # [MỚI] Middleware
│   │       ├── logger.middleware.ts         # Request logger
│   │       └── correlation-id.middleware.ts # Track request ID
│   │
│   ├── config/                          # ⚙️ Configuration (Environment variables)
│   │   ├── index.ts                         # Export all configs
│   │   ├── app.config.ts                    # App settings (port, CORS, etc.)
│   │   ├── database.config.ts               # PostgreSQL connection
│   │   ├── jwt.config.ts                    # JWT secret & expiration
│   │   ├── orion.config.ts                  # Orion-LD Context Broker URL
│   │   ├── minio.config.ts                  # MinIO (S3) settings
│   │   ├── firebase.config.ts               # Firebase Cloud Messaging
│   │   └── redis.config.ts                  # [MỚI] Redis for caching & queues
│   │
│   ├── database/                        # 🗄️ Database infrastructure
│   │   ├── migrations/                      # TypeORM migrations
│   │   ├── seeds/                           # Database seeders (test data)
│   │   └── typeorm.config.ts                # TypeORM configuration
│   │
│   ├── modules/                         # 📦 Business Modules (Domain-driven)
│   │   │
│   │   ├── ingestion/                   # 📥 Data Ingestion - Thu thập dữ liệu từ API
│   │   │   ├── ingestion.module.ts
│   │   │   ├── ingestion.service.ts         # Orchestrator - Điều phối các providers
│   │   │   ├── ingestion.controller.ts      # Manual trigger endpoints (admin only)
│   │   │   ├── providers/                   # External API providers
│   │   │   │   ├── openweathermap.provider.ts   # Fetch weather from OWM
│   │   │   │   └── orion-client.provider.ts     # Push to Orion-LD Context Broker
│   │   │   ├── transformers/                # Convert to NGSI-LD entities
│   │   │   │   ├── airquality.transformer.ts    # OWM → AirQualityObserved
│   │   │   │   └── weather.transformer.ts       # OWM → WeatherObserved
│   │   │   ├── schedulers/                  # Cron jobs
│   │   │   │   └── ingestion.scheduler.ts       # Auto fetch every 30 mins
│   │   │   ├── dto/                         # DTOs for ingestion
│   │   │   │   ├── trigger-ingestion.dto.ts
│   │   │   │   └── ingestion-status.dto.ts
│   │   │   └── interfaces/                  # [MỚI] Provider interfaces
│   │   │       └── data-provider.interface.ts
│   │   │
│   │   ├── airquality/                  # 🌫️ Air Quality - Truy vấn dữ liệu chất lượng không khí
│   │   │   ├── airquality.module.ts
│   │   │   ├── airquality.controller.ts     # GET /airquality endpoints
│   │   │   ├── airquality.service.ts        # Query from Orion-LD & PostgreSQL
│   │   │   ├── entities/                    # Database entities
│   │   │   │   └── airquality.entity.ts
│   │   │   ├── dto/                         # Request/Response DTOs
│   │   │   │   ├── query-airquality.dto.ts
│   │   │   │   └── airquality-response.dto.ts
│   │   │   └── interfaces/
│   │   │       └── airquality.interface.ts
│   │   │
│   │   ├── weather/                     # 🌤️ Weather - Truy vấn dữ liệu thời tiết
│   │   │   ├── weather.module.ts
│   │   │   ├── weather.controller.ts        # GET /weather endpoints
│   │   │   ├── weather.service.ts           # Query from Orion-LD & PostgreSQL
│   │   │   ├── entities/                    # Database entities
│   │   │   │   └── weather.entity.ts
│   │   │   ├── dto/                         # Request/Response DTOs
│   │   │   │   ├── query-weather.dto.ts
│   │   │   │   └── weather-response.dto.ts
│   │   │   └── interfaces/
│   │   │       └── weather.interface.ts
│   │   │
│   │   ├── alert/                       # 🚨 Alert Management - Quản lý cảnh báo
│   │   │   ├── alert.module.ts
│   │   │   ├── alert.controller.ts          # CRUD alerts (admin), GET alerts (citizen)
│   │   │   ├── alert.service.ts             # Create/update/delete alerts
│   │   │   ├── entities/                    # Database entities
│   │   │   │   ├── alert.entity.ts              # Alert metadata
│   │   │   │   └── alert-rule.entity.ts         # Alert thresholds/rules
│   │   │   ├── dto/                         # Request/Response DTOs
│   │   │   │   ├── create-alert.dto.ts
│   │   │   │   ├── update-alert.dto.ts
│   │   │   │   └── alert-response.dto.ts
│   │   │   ├── processors/                  # Business logic
│   │   │   │   ├── threshold.processor.ts       # Auto-create alerts when threshold exceeded
│   │   │   │   └── alert-rules.processor.ts     # Evaluate custom rules
│   │   │   ├── schedulers/                  # Background jobs
│   │   │   │   └── alert-monitor.scheduler.ts   # Check data every 5 mins
│   │   │   └── interfaces/
│   │   │       └── alert-rule.interface.ts
│   │   │
│   │   ├── notification/                # 📢 Notification - Gửi thông báo đa kênh
│   │   │   ├── notification.module.ts
│   │   │   ├── notification.service.ts      # Main notification orchestrator
│   │   │   ├── providers/                   # Notification channels
│   │   │   │   ├── fcm.provider.ts              # Firebase Cloud Messaging (push)
│   │   │   │   ├── email.provider.ts            # Email (future - SendGrid/SES)
│   │   │   │   └── sms.provider.ts              # SMS (future - Twilio)
│   │   │   ├── entities/                    # Notification history
│   │   │   │   └── notification-log.entity.ts
│   │   │   ├── dto/                         # DTOs
│   │   │   │   ├── send-notification.dto.ts
│   │   │   │   └── notification-response.dto.ts
│   │   │   ├── interfaces/                  # [MỚI] Channel interface
│   │   │   │   └── notification-channel.interface.ts
│   │   │   └── queues/                      # [MỚI] Queue for async sending
│   │   │       └── notification.queue.ts
│   │   │
│   │   ├── incident/                    # 📋 Incident Reporting - Báo cáo sự cố từ người dân
│   │   │   ├── incident.module.ts
│   │   │   ├── incident.controller.ts       # POST /incidents, PATCH /incidents/:id
│   │   │   ├── incident.service.ts          # CRUD incidents
│   │   │   ├── file.service.ts              # Upload photos to MinIO
│   │   │   ├── entities/                    # Database entities
│   │   │   │   ├── incident.entity.ts           # Incident metadata
│   │   │   │   └── incident-photo.entity.ts     # Photo references
│   │   │   ├── dto/                         # Request/Response DTOs
│   │   │   │   ├── create-incident.dto.ts       # With multipart/form-data
│   │   │   │   ├── update-incident.dto.ts
│   │   │   │   └── incident-response.dto.ts
│   │   │   └── interfaces/
│   │   │       ├── incident-status.enum.ts      # PENDING, IN_PROGRESS, RESOLVED
│   │   │       └── incident-type.enum.ts        # FLOOD, TREE_DOWN, LANDSLIDE
│   │   │
│   │   │
│   │   ├── auth/                        # 🔐 Authentication - Xác thực người dùng
│   │   │   ├── auth.module.ts
│   │   │   ├── auth.controller.ts           # POST /auth/login, /auth/register
│   │   │   ├── auth.service.ts              # JWT generation, password hashing
│   │   │   ├── dto/                         # Request/Response DTOs
│   │   │   │   ├── login.dto.ts
│   │   │   │   ├── register.dto.ts
│   │   │   │   └── auth-response.dto.ts
│   │   │   ├── interfaces/
│   │   │   │   └── jwt-payload.interface.ts
│   │   │   └── strategies/                  # Passport strategies
│   │   │       ├── jwt.strategy.ts              # Validate JWT
│   │   │       └── local.strategy.ts            # Username/password login
│   │   │
│   │   ├── user/                        # 👤 User Management - Quản lý người dùng
│   │   │   ├── user.module.ts
│   │   │   ├── user.controller.ts           # CRUD users, GET /users/me
│   │   │   ├── user.service.ts              # User CRUD operations
│   │   │   ├── entities/                    # Database entities
│   │   │   │   ├── user.entity.ts               # User profile (id, email, role)
│   │   │   │   └── user-device.entity.ts        # FCM tokens for notifications
│   │   │   ├── dto/                         # Request/Response DTOs
│   │   │   │   ├── create-user.dto.ts
│   │   │   │   ├── update-user.dto.ts
│   │   │   │   └── user-response.dto.ts
│   │   │   └── interfaces/
│   │   │       └── user-role.enum.ts            # ADMIN, CITIZEN
│   │   │
│   │   └── health/                      # [MỚI] 🏥 Health Check - Monitoring
│   │       ├── health.module.ts
│   │       ├── health.controller.ts         # GET /health, /health/db, /health/orion
│   │       └── health.service.ts            # Check DB, Orion, MinIO, Redis
│   │
│   └── shared/                          # 🔄 Shared resources (Used across modules)
│       ├── interfaces/                      # Shared interfaces
│       │   ├── base-entity.interface.ts
│       │   └── pagination.interface.ts
│       ├── constants/                       # App-wide constants
│       │   ├── app.constants.ts
│       │   ├── error-messages.ts
│       │   └── ngsi-ld.constants.ts
│       ├── utils/                           # Utility functions
│       │   ├── date.utils.ts
│       │   ├── string.utils.ts
│       │   └── geo.utils.ts                     # GeoJSON helpers
│       └── types/                           # [MỚI] Shared types
│           └── express.d.ts                     # Extend Express Request
```
