# Database Seeding System

Hệ thống seed database cho NestJS với TypeORM, tự động tạo dữ liệu mẫu cho tất cả các bảng.

## 📋 Tổng quan

Hệ thống này seed dữ liệu cho **7 bảng**:

| Bảng                   | Mô tả                        | Số lượng records |
| ---------------------- | ---------------------------- | ---------------- |
| `users`                | Tài khoản người dùng         | 3                |
| `observation_station`  | Trạm quan trắc               | 4                |
| `weather_observed`     | Dữ liệu thời tiết            | ~256 (7 ngày)\*  |
| `air_quality_observed` | Dữ liệu chất lượng không khí | ~256 (7 ngày)\*  |
| `incidents`            | Báo cáo sự cố                | 11               |
| `alert_thresholds`     | Ngưỡng cảnh báo              | 4                |
| `alerts`               | Cảnh báo môi trường          | 10               |

> **\*** Dữ liệu weather và air-quality có thể bỏ qua bằng option `--skip-env` để sau đó thu thập dữ liệu thật từ OpenWeatherMap.

## 🚀 Cách sử dụng

### 1. Seed đầy đủ (bao gồm fake weather/air-quality)

```bash
npm run seed              # Seed nếu DB rỗng
npm run seed:force        # Force reseed (xóa và seed lại)
npm run seed:reseed       # Alias cho seed:force
```

### 2. Seed cơ bản (KHÔNG có fake weather/air-quality)

```bash
npm run seed:base         # Seed base data nếu DB rỗng
npm run seed:base:force   # Force reseed base data
```

**💡 Khuyến nghị**: Sử dụng `seed:base:force` khi muốn dùng dữ liệu thật từ OpenWeatherMap:

```bash
# 1. Seed base data (users, stations, incidents, alerts, thresholds)
npm run seed:base:force

# 2. Vào Dashboard → "Thu thập dữ liệu lịch sử" để lấy data thật
```

### 3. Chỉ xóa dữ liệu

```bash
npm run seed:clear
```

⚠️ **Cảnh báo**: Lệnh này sẽ xóa TẤT CẢ dữ liệu trong tất cả các bảng!

## 📁 Cấu trúc file

```
backend/src/database/seeds/
├── seed.module.ts          # NestJS Module - import tất cả entities
├── seed.service.ts         # Service chứa logic seed
├── seed.ts                 # Entry point
├── README.md               # Tài liệu này
└── data/                   # Thư mục chứa dữ liệu seed
    ├── index.ts            # Barrel export
    ├── users.seed.ts       # Dữ liệu users
    ├── stations.seed.ts    # Dữ liệu stations
    ├── weather.seed.ts     # Generator dữ liệu weather
    ├── air-quality.seed.ts # Generator dữ liệu air quality
    ├── incidents.seed.ts   # Dữ liệu incidents
    └── alerts.seed.ts      # Dữ liệu alerts
```

## 👤 Tài khoản mẫu

| Email                   | Password | Role  | Provider |
| ----------------------- | -------- | ----- | -------- |
| admin@smartforecast.com | admin123 | ADMIN | local    |
| user@test.com           | (OAuth)  | USER  | google   |
| demo@smartforecast.com  | demo123  | USER  | local    |

### Fixed UUIDs

Các user có UUID cố định để các bảng khác có thể reference:

```typescript
ADMIN_USER_ID = '11111111-1111-1111-1111-111111111111';
TEST_USER_ID = '22222222-2222-2222-2222-222222222222';
DEMO_USER_ID = '33333333-3333-3333-3333-333333333333';
```

## 🏢 Trạm quan trắc

4 trạm tại Hà Nội:

- **Hoàn Kiếm** (HN-HK-001) - Trung tâm, priority: HIGH
- **Hà Đông** (HN-HD-001) - Phía Tây, priority: MEDIUM
- **Cầu Giấy** (HN-CG-001) - Khu đại học, priority: HIGH
- **Long Biên** (HN-LB-001) - Ven sông, priority: MEDIUM

## 🌤️ Dữ liệu thời tiết & chất lượng không khí

- **Thời gian**: 7 ngày gần nhất
- **Tần suất**: Mỗi 3 giờ
- **Số records**: 4 trạm × 8 ngày × 8 lần/ngày = ~256 records mỗi bảng

Dữ liệu được generate ngẫu nhiên với các đặc điểm:

- Nhiệt độ thay đổi theo giờ (đêm mát hơn)
- AQI cao hơn vào giờ cao điểm (7-9h, 17-19h)
- Mức ô nhiễm khác nhau theo từng trạm

## 🚨 Incidents & Alerts

- **Incidents**: 11 báo cáo mẫu với các loại: ngập, cây đổ, ô nhiễm, đường hỏng, sạt lở
- **Alerts**: 10 cảnh báo mẫu với các mức độ: CRITICAL, HIGH, MEDIUM, LOW

## 🔧 Development Workflow

### Với fake data (nhanh, offline)

```bash
# 1. Khởi động containers
docker-compose up -d

# 2. Seed đầy đủ dữ liệu
cd backend
npm run seed:force
```

### Với real data từ OpenWeatherMap

```bash
# 1. Khởi động containers
docker-compose up -d

# 2. Seed base data (không có weather/air-quality fake)
cd backend
npm run seed:base:force

# 3. Vào Dashboard web → Click "Thu thập dữ liệu lịch sử"
#    - Chọn khoảng thời gian (tối đa 7 ngày)
#    - Chọn loại dữ liệu (weather và/hoặc air-quality)
#    - Click "Bắt đầu thu thập"
```

> **Lưu ý**: Historical Weather API của OpenWeatherMap yêu cầu **paid subscription**. Historical Air Quality API là **miễn phí**.

### Sau khi xóa Docker

```bash
docker-compose down -v
docker-compose up -d
npm run seed:force       # Hoặc seed:base:force
```

## 🐛 Troubleshooting

### Database connection error

Đảm bảo `DATABASE_URL` đã được set trong `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

### Foreign key constraint error

Nếu gặp lỗi foreign key, chạy:

```bash
npm run seed:clear
npm run seed
```

### Entity not found

Kiểm tra entity đã được import trong `seed.module.ts`.

## 📝 Thêm dữ liệu seed mới

1. Tạo file mới trong `data/` (ví dụ: `new-entity.seed.ts`)
2. Export data hoặc generator function
3. Import trong `data/index.ts`
4. Thêm method seed trong `seed.service.ts`
5. Gọi method trong `run()` theo đúng thứ tự dependency
