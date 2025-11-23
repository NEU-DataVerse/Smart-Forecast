# Database Seeding System

Hệ thống seed database cho NestJS với TypeORM, cho phép tự động tạo dữ liệu mẫu từ file JSON.

## 📋 Tổng quan

Hệ thống này bao gồm:

- **SeedModule**: Module NestJS quản lý seeding
- **SeedService**: Service thực hiện logic seed
- **seed-data.ts**: File chứa dữ liệu được embed (auto-generated)
- **generate-seed-data.ts**: Script tự động tạo seed-data.ts từ source_data.json
- **seed.ts**: Entry point để chạy seed

## 🚀 Cách sử dụng

### 1. Generate seed data từ JSON

Khi bạn cập nhật `source_data.json`, chạy lệnh này để tạo lại file `seed-data.ts`:

```bash
npm run seed:generate
```

Lệnh này sẽ:

- Đọc toàn bộ dữ liệu từ `backend/src/modules/stations/source_data.json`
- Tạo file `backend/src/database/seeds/seed-data.ts` với dữ liệu được embed
- File này không cần file JSON nữa về sau

### 2. Chạy seed để insert data vào database

```bash
npm run seed
```

Lệnh này sẽ:

- Kiểm tra xem database đã có dữ liệu chưa
- Nếu chưa có → insert toàn bộ dữ liệu từ SEED_DATA
- Nếu đã có → bỏ qua và thông báo

### 3. Xóa toàn bộ dữ liệu đã seed

```bash
npm run seed:clear
```

⚠️ **Cảnh báo**: Lệnh này sẽ xóa TẤT CẢ dữ liệu trong bảng `observation_station`!

### 4. Re-seed (xóa và seed lại)

```bash
npm run seed:reseed
```

Lệnh này sẽ:

1. Xóa toàn bộ dữ liệu hiện có
2. Insert lại từ đầu

## 📁 Cấu trúc file

```
backend/src/
├── database/
│   └── seeds/
│       ├── seed.module.ts          # NestJS Module
│       ├── seed.service.ts         # Service chứa logic seed
│       ├── seed.ts                 # Entry point
│       ├── seed-data.ts            # Dữ liệu embedded (auto-generated)
│       ├── generate-seed-data.ts   # Script tạo seed-data.ts
│       └── README.md               # Tài liệu này
└── modules/
    └── stations/
        └── source_data.json        # File JSON gốc
```

## 🔧 Chi tiết kỹ thuật

### SeedService

```typescript
@Injectable()
export class SeedService {
  async run(): Promise<void> {
    // Kiểm tra DB có dữ liệu chưa
    const count = await this.stationRepository.count();

    if (count > 0) {
      // Skip nếu đã có dữ liệu
      return;
    }

    // Insert toàn bộ SEED_DATA
    await this.stationRepository.save(stations);
  }
}
```

### seed-data.ts

File này được tự động tạo từ `source_data.json`:

```typescript
export const SEED_DATA = {
  version: "1.0",
  lastUpdated: "2025-11-22T00:00:00.000Z",
  stations: [
    { id: "...", name: "...", ... },
    // ...
  ]
} as const;
```

## 🔄 Workflow

1. **Cập nhật dữ liệu**: Chỉnh sửa `source_data.json`
2. **Generate**: Chạy `npm run seed:generate` để tạo `seed-data.ts`
3. **Seed**: Chạy `npm run seed` để insert vào database

## 📝 Lưu ý

- File `seed-data.ts` được tạo tự động, **KHÔNG nên chỉnh sửa trực tiếp**
- Seed service chỉ insert data khi database **RỖNG**
- Sử dụng TypeORM Repository, tương thích với TypeORM 0.3+
- Không sử dụng TypeORM CLI cũ
- Database connection được lấy từ `DATABASE_URL` environment variable

## 🌱 Commands tóm tắt

| Command                 | Mô tả                                |
| ----------------------- | ------------------------------------ |
| `npm run seed:generate` | Tạo seed-data.ts từ source_data.json |
| `npm run seed`          | Insert dữ liệu nếu DB rỗng           |
| `npm run seed:clear`    | Xóa toàn bộ dữ liệu                  |
| `npm run seed:reseed`   | Xóa và seed lại                      |

## 🐛 Troubleshooting

### Database connection error

Đảm bảo `DATABASE_URL` đã được set trong `.env`:

```
DATABASE_URL=postgresql://user:password@localhost:5432/database
```

### TypeORM entity not found

Kiểm tra entity đã được import đúng trong `seed.module.ts`:

```typescript
TypeOrmModule.forFeature([StationEntity]);
```

### Data already exists

Nếu muốn seed lại, dùng:

```bash
npm run seed:reseed
```
