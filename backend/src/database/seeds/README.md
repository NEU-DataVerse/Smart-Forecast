# Database Seeding System

Hệ thống seed database cho NestJS với TypeORM, tự động tạo dữ liệu mẫu cho tất cả các bảng.

## 📋 Tổng quan

Hệ thống này seed dữ liệu cho **6 bảng**:

| Bảng                   | Mô tả                        | Số lượng records |
| ---------------------- | ---------------------------- | ---------------- |
| `users`                | Tài khoản người dùng         | 3                |
| `observation_station`  | Trạm quan trắc               | 4                |
| `weather_observed`     | Dữ liệu thời tiết            | ~256 (7 ngày)    |
| `air_quality_observed` | Dữ liệu chất lượng không khí | ~256 (7 ngày)    |
| `incidents`            | Báo cáo sự cố                | 11               |
| `alerts`               | Cảnh báo môi trường          | 10               |

## 🚀 Cách sử dụng

### 1. Seed dữ liệu (nếu DB rỗng)

```bash
npm run seed
```

Lệnh này sẽ kiểm tra nếu database đã có dữ liệu thì bỏ qua.

### 2. Force reseed (xóa và seed lại)

```bash
npm run seed:force
# hoặc
npm run seed:reseed
```

**Đây là lệnh nên dùng khi develop** - mỗi khi xóa Docker và run lại.

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

Khi develop với Docker:

```bash
# 1. Khởi động containers
docker-compose up -d

# 2. Seed dữ liệu
cd backend
npm run seed:force

# 3. Sau khi xóa Docker và chạy lại
docker-compose down -v
docker-compose up -d
npm run seed:force  # Seed lại dữ liệu
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
