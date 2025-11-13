## Plan: STAGE 2 - Chi tiết 6 Epics (17/11 – 23/11)

Dựa trên nghiên cứu codebase hiện tại, dưới đây là outline chi tiết cho từng Epic trong STAGE 2. Mỗi Epic đã được phân tích kỹ lưỡng về những gì đã có, thiếu gì, và cần làm gì.

---

## 📦 **Epic 1: Module Thu thập Dữ liệu (Data Ingestion)**

**Context:** Module `airquality` đã tồn tại nhưng trống, types NGSI-LD đầy đủ trong `shared/`, Docker đã có Orion-LD + MongoDB.

### Steps

1. **Cài đặt dependencies** - Thêm `@nestjs/schedule`, `@nestjs/axios`, `axios` vào `backend/package.json`
2. **Tạo `OrionService`** - Service HTTP client tương tác với Orion-LD API (`POST /ngsi-ld/v1/entities`, `PATCH /entities/{id}/attrs`) trong `backend/src/airquality/services/orion.service.ts`
3. **Tạo `OpenAQService`** - Gọi OpenAQ API và transform sang `AirQualityObserved` (NGSI-LD) trong `backend/src/airquality/services/openaq.service.ts`, sử dụng types từ `@smart-forecast/shared`
4. **Tạo `OpenWeatherMapService`** - Tạo module `weather/`, service gọi OWM API, transform sang `WeatherObserved` trong `backend/src/weather/services/openweathermap.service.ts`
5. **Tạo NGSI-LD Transformer** - Utility functions chuyển đổi JSON responses sang NGSI-LD format trong `backend/src/common/transformers/ngsi-ld.transformer.ts`
6. **Cấu hình Cron Job** - Enable `@nestjs/schedule`, tạo `@Cron('0 */30 * * * *')` trong `AirQualityService` để chạy ingestion mỗi 30 phút
7. **Kết nối modules** - Import `WeatherModule`, `ScheduleModule` vào `AppModule`, verify environment variables (`OPENAQ_API_KEY`, `OWM_API_KEY`, `ORION_LD_URL`)

### Further Considerations

1. **Error handling:** Retry logic khi API external timeout? Exponential backoff / Circuit breaker pattern
2. **Data validation:** Validate NGSI-LD payload trước khi push lên Orion? Dùng class-validator
3. **Logging:** Sử dụng NestJS Logger để track ingestion status, failures?
4. **Testing:** Mock external APIs (OpenAQ, OWM) trong unit tests? Tạo e2e test cho full flow?

---

## 🔄 **Epic 2: Cấu hình Cygnus (Historical Data Sync)**

**Context:** Cygnus đã có trong `docker-compose.yml` với PostgreSQL sink, cần tạo subscriptions và configuration.

### Steps

1. **Tạo custom `agent.conf`** - Config file cho Cygnus với PostgreSQL sink parameters, mount vào container qua Docker volume trong `docker-compose.yml`
2. **Tạo `SubscriptionService`** - Service quản lý Orion-LD subscriptions (`POST /ngsi-ld/v1/subscriptions`) trong `backend/src/cygnus/services/subscription.service.ts`
3. **Tạo subscription cho `AirQualityObserved`** - Entity type pattern, notification endpoint `http://cygnus:5050/notify`, persistence mode
4. **Tạo subscription cho `WeatherObserved`** - Tương tự trên, có thể dùng watchedAttributes để filter specific properties
5. **Verify PostgreSQL schema** - Check tables auto-created bởi Cygnus (format: `<service>_<servicepath>_<entity>`), tạo indexes cho performance
6. **Kiểm tra data flow** - Chạy ingestion cron job, query PostgreSQL để confirm historical data được ghi, check Cygnus logs

### Further Considerations

1. **Subscription lifecycle:** Auto-recreate subscriptions khi container restart? Store subscription IDs trong database?
2. **Data retention:** Policy xóa dữ liệu cũ trong PostgreSQL? Partition tables by date?
3. **Cygnus performance:** Batch size, flush timeout trong agent.conf cần tune?

---

## 🔌 **Epic 3: REST APIs Đọc Dữ liệu**

**Context:** API structure sẵn có (`api/v1` prefix), validation pipes, guards đã setup, cần thêm endpoints mới.

### Steps

1. **Tạo `AirQualityController`** - Endpoints `GET /api/v1/airquality/current`, `/history`, `/stats` trong `backend/src/airquality/controllers/airquality.controller.ts`
2. **Tạo `WeatherController`** - Endpoints `GET /api/v1/weather/current`, `/history`, `/forecast` trong `backend/src/weather/controllers/weather.controller.ts`
3. **Implement query services** - `getCurrentAirQuality()` query Orion-LD, `getAirQualityHistory()` query PostgreSQL với date range filters
4. **Tạo DTOs** - `GetAirQualityHistoryDto`, `GetWeatherForecastDto` với class-validator decorators (`@IsDateString()`, `@IsOptional()`, `@IsString()`)
5. **Transform responses** - Convert NGSI-LD entities sang frontend-friendly format (flat objects, remove metadata)
6. **Add Swagger docs** - Install `@nestjs/swagger`, thêm `@ApiTags()`, `@ApiOperation()`, `@ApiResponse()` decorators

### Further Considerations

1. **Pagination:** Implement cursor-based hoặc offset-based pagination cho `/history`?
2. **Caching:** Redis cache cho `/current` endpoints (TTL 5-10 phút)?
3. **Authentication:** Các API này public hay cần JWT guard? Permissions khác nhau cho different user roles?
4. **Rate limiting:** Throttle requests để protect backend?

---

## 🗺️ **Epic 4: Web Dashboard (Map + Charts)**

**Context:** Next.js 15 app router, Radix UI components, dashboard layout sẵn có với stub pages, chưa có map/chart libraries.

### Steps

1. **Install dependencies** - `mapbox-gl`, `react-map-gl`, `recharts`, `axios`, `zustand`, `date-fns` vào `web/package.json`
2. **Tạo API client** - Axios instance với baseURL từ env, interceptors cho error handling trong `web/src/services/api.service.ts`
3. **Tạo data services** - `AirQualityService`, `WeatherService` gọi backend APIs trong `web/src/services/`
4. **Build `DisasterMap` component** - Mapbox GL với markers cho stations, heat map cho AQI, popup với real-time data trong `web/src/components/Map/DisasterMap.tsx`
5. **Build chart components** - `AirQualityChart` (line chart với Recharts), `WeatherChart` trong `web/src/components/Charts/`
6. **Create custom hooks** - `useAirQuality()`, `useWeather()` với SWR hoặc React Query pattern trong `web/src/hooks/`
7. **Update dashboard page** - Integrate map + charts vào `web/src/app/(protected)/dashboard/page.tsx`, layout với grid system

### Further Considerations

1. **Map provider:** Mapbox (paid) vs Leaflet (free)? Budget cho Mapbox token?
2. **Real-time updates:** WebSocket hoặc polling cho live data? Frequency?
3. **State management:** Zustand vs Context API vs Redux Toolkit?
4. **Mobile responsive:** Charts và map responsive trên mobile breakpoints?

---

## 📱 **Epic 5: Mobile Home Screen**

**Context:** Expo 54 với router, tab navigation sẵn có, home screen hiện tại là template, chưa có permissions setup.

### Steps

1. **Install dependencies** - `expo-location`, `expo-camera`, `expo-image-picker`, `axios`, `zustand` vào `mobile/package.json`
2. **Setup permissions** - Request location permissions trong `mobile/hooks/use-location.ts`, camera permissions trong report screen
3. **Tạo API client** - Similar backend service structure như web trong `mobile/services/`
4. **Build home components** - `AirQualityCard`, `WeatherCard`, `AlertCard` trong `mobile/components/` với themed styling
5. **Redesign home screen** - Update `mobile/app/(tabs)/index.tsx` với location-based AQ/weather data, quick report button
6. **Create report UI** - Form với incident type picker, description input, photo picker, location selector trong `mobile/app/(tabs)/report.tsx` (không connect API yet)

### Further Considerations

1. **Location tracking:** Background location updates or foreground only? Battery impact?
2. **Offline support:** Cache data locally với AsyncStorage? Sync khi online?
3. **Push notifications:** Setup Expo push notifications cho alerts?
4. **Platform differences:** iOS vs Android permission flows, test trên cả hai?

---

## 📚 **Epic 6: Documentation**

**Context:** README.md, backend docs, docker compose guide đã có, thiếu API docs và architecture diagrams.

### Steps

1. **Setup Swagger** - Install `@nestjs/swagger`, config trong `main.ts`, serve tại `/api/docs` endpoint
2. **Document APIs** - Add decorators cho tất cả controllers từ Epic 3, export OpenAPI JSON
3. **Create architecture docs** - `docs/architecture/DATA_FLOW.md` với mermaid diagrams (OpenAQ → Orion → Cygnus → PostgreSQL)
4. **Write API guides** - `docs/api/AIRQUALITY_API.md`, `WEATHER_API.md` với curl examples, response schemas
5. **Update main README** - Section cho STAGE 2 features, link tới new docs
6. **Create Postman collection** - Export từ Swagger, add vào repo tại `docs/api/Smart-Forecast.postman_collection.json`

### Further Considerations

1. **Auto-generated docs:** Swagger UI vs Redoc vs Stoplight?
2. **Versioning:** API versioning strategy cho future changes?
3. **Examples:** Real-world request/response examples với actual data?
4. **Changelog:** Track API changes trong `CHANGELOG.md`?

---

### 🎯 **Cross-Epic Dependencies**

- Epic 3 phụ thuộc Epic 1 (cần data trong Orion/PostgreSQL)
- Epic 4, 5 phụ thuộc Epic 3 (cần APIs)
- Epic 2 có thể chạy song song với Epic 1
- Epic 6 nên làm cuối cùng khi features hoàn thành

### ⚡ **Quick Start Recommendation**

1. Start với Epic 1 + 2 (Backend data flow)
2. Parallel Epic 3 (APIs) khi có sample data
3. Parallel Epic 4 + 5 (Frontends) khi APIs ready
4. Finish với Epic 6 (Documentation)
