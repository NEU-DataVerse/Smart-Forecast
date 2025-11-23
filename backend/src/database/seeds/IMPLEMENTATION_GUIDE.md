# Hướng Dẫn Sử Dụng Database Seeding System

## 📦 Tóm tắt Implementation

Đã tạo thành công hệ thống seed database hoàn chỉnh cho NestJS với TypeORM v0.3+, bao gồm:

### Files đã tạo:

- ✅ `seed.service.ts` - Service chứa logic seed với các methods: `run()`, `clear()`, `reseed()`
- ✅ `seed.module.ts` - NestJS Module với TypeORM integration
- ✅ `seed.ts` - Entry point để chạy seed standalone
- ✅ `generate-seed-data.ts` - Script tự động tạo seed-data.ts từ JSON
- ✅ `seed-data.ts` - File chứa dữ liệu embedded (auto-generated)
- ✅ `README.md` - Tài liệu hướng dẫn chi tiết
- ✅ `examples.ts` - Ví dụ sử dụng trong nhiều scenarios

### NPM Scripts đã thêm vào package.json:

```json
{
  "seed:generate": "Generate seed-data.ts từ source_data.json",
  "seed": "Chạy seed để insert data",
  "seed:clear": "Xóa toàn bộ dữ liệu đã seed",
  "seed:reseed": "Xóa và seed lại"
}
```

---

## 🚀 Quick Start

### Bước 1: Generate seed data từ JSON

```bash
cd backend
npm run seed:generate
```

**Output:**

```
🔄 Reading source_data.json...
✅ Loaded 2 stations from source file
📅 Version: 1.0, Last Updated: 2025-11-22T00:00:00.000Z
✅ Successfully generated seed-data.ts
```

### Bước 2: Seed vào database

```bash
npm run seed
```

**Output:**

```
🌱 Starting database seed process...

[SeedService] Starting database seeding process...
[SeedService] Database is empty. Starting to insert seed data...
[SeedService] Successfully seeded 2 stations into the database.
[SeedService]   ✓ Trạm Hoàn Kiếm (ha-noi-a1b2c3d4)
[SeedService]   ✓ Trạm Hà Đông (ha-noi-e5f6g7h8)
[SeedService] Seeding completed successfully!

✅ Seed process completed successfully!
```

---

## 🔧 Chi Tiết Kỹ Thuật

### 1. SeedService Logic

```typescript
// Workflow của run() method:
async run(): Promise<void> {
  // 1. Kiểm tra database có data chưa
  const count = await this.stationRepository.count();

  if (count > 0) {
    // Skip nếu đã có dữ liệu
    this.logger.log(`Database already contains ${count} stations`);
    return;
  }

  // 2. Map dữ liệu từ SEED_DATA
  const stationData = SEED_DATA.stations.map(station => ({
    id: station.id,
    type: station.type,
    code: station.code,
    // ... tất cả fields
    // Spread objects để convert readonly -> mutable
    location: { ...station.location },
    address: { ...station.address },
    categories: station.categories ? [...station.categories] : undefined,
  }));

  // 3. Create entities
  const stations = this.stationRepository.create(stationData);

  // 4. Save tất cả trong 1 transaction
  await this.stationRepository.save(stations);
}
```

### 2. Generate Script Logic

```typescript
// generate-seed-data.ts đọc JSON và tạo TypeScript file:
const rawData = fs.readFileSync('source_data.json', 'utf-8');
const data = JSON.parse(rawData);

const fileContent = `
export const SEED_DATA = ${JSON.stringify(data, null, 2)} as const;
`;

fs.writeFileSync('seed-data.ts', fileContent);
```

### 3. Seed Entry Point

```typescript
// seed.ts bootstrap standalone NestJS app:
const app = await NestFactory.createApplicationContext(SeedModule);
const seedService = app.get(SeedService);

// Support các command khác nhau
switch (command) {
  case 'clear':
    await seedService.clear();
    break;
  case 'reseed':
    await seedService.reseed();
    break;
  default:
    await seedService.run();
    break;
}

await app.close();
```

---

## 📋 Các Commands Có Thể Sử Dụng

| Command                 | Mô tả                                | Use case             |
| ----------------------- | ------------------------------------ | -------------------- |
| `npm run seed:generate` | Tạo seed-data.ts từ source_data.json | Sau khi update JSON  |
| `npm run seed`          | Insert data nếu DB rỗng              | Setup môi trường mới |
| `npm run seed:clear`    | Xóa toàn bộ stations                 | Reset database       |
| `npm run seed:reseed`   | Clear + Seed lại                     | Refresh data         |

---

## 🎯 Use Cases

### Use Case 1: Setup môi trường development mới

```bash
# 1. Clone project
git clone ...

# 2. Install dependencies
npm install

# 3. Setup database
docker-compose up -d

# 4. Generate seed data (nếu chưa có seed-data.ts)
npm run seed:generate

# 5. Seed database
npm run seed

# 6. Start app
npm run start:dev
```

### Use Case 2: Update dữ liệu seed

```bash
# 1. Chỉnh sửa source_data.json
vim backend/src/modules/stations/source_data.json

# 2. Regenerate seed-data.ts
npm run seed:generate

# 3. Re-seed database
npm run seed:reseed
```

### Use Case 3: Tích hợp với CI/CD

```yaml
# .github/workflows/test.yml
- name: Setup test database
  run: |
    npm run seed:generate
    npm run seed

- name: Run tests
  run: npm test
```

### Use Case 4: Tự động seed khi app start

```typescript
// app.module.ts
@Module({
  imports: [SeedModule],
  providers: [AutoSeedService], // Tự động seed
})
export class AppModule {}
```

---

## 🔍 Kiểm Tra Kết Quả

### Option 1: Sử dụng psql

```bash
psql $DATABASE_URL

# Xem tất cả stations
SELECT id, name, code, city, district FROM observation_station;

# Đếm số lượng
SELECT COUNT(*) FROM observation_station;

# Xem chi tiết 1 station
SELECT * FROM observation_station WHERE code = 'ha-noi-a1b2c3d4';
```

### Option 2: Sử dụng TypeORM CLI

```bash
npm run typeorm query "SELECT * FROM observation_station"
```

### Option 3: Sử dụng API endpoint (sau khi tạo)

```bash
curl http://localhost:3000/api/stations
```

---

## ⚡ Features

✅ **Đọc JSON một lần**: Source data chỉ đọc khi generate, không đọc lúc runtime  
✅ **Auto-generate TypeScript**: File seed-data.ts tự động tạo với types  
✅ **Idempotent**: Chỉ seed nếu DB rỗng, không duplicate data  
✅ **TypeORM v0.3+ compatible**: Không dùng CLI cũ  
✅ **Transaction support**: Save tất cả records trong 1 transaction  
✅ **Type-safe**: Full TypeScript với proper types  
✅ **Logging**: Chi tiết logs để debug  
✅ **Multiple commands**: seed, clear, reseed  
✅ **Standalone**: Chạy độc lập không cần start full app

---

## 🛠️ Troubleshooting

### Lỗi: "Database connection failed"

```bash
# Kiểm tra DATABASE_URL trong .env
echo $DATABASE_URL

# Kiểm tra PostgreSQL đang chạy
docker ps | grep postgres
```

### Lỗi: "Table doesn't exist"

```bash
# Chạy migration trước
npm run typeorm migration:run

# Hoặc enable synchronize trong development
# database.config.ts: synchronize: true
```

### Lỗi: "Data already exists"

```bash
# Nếu muốn seed lại
npm run seed:reseed

# Hoặc clear rồi seed
npm run seed:clear
npm run seed
```

### Lỗi: "Cannot find module 'seed-data'"

```bash
# Generate lại seed-data.ts
npm run seed:generate
```

---

## 📚 Tài Liệu Tham Khảo

- [NestJS Documentation](https://docs.nestjs.com/)
- [TypeORM 0.3 Documentation](https://typeorm.io/)
- [File seed.service.ts](./seed.service.ts)
- [File seed.module.ts](./seed.module.ts)
- [File examples.ts](./examples.ts)

---

## ✨ Next Steps

Sau khi setup xong seed system, bạn có thể:

1. **Thêm entities khác vào seed**
   - Tạo seed service riêng cho từng entity
   - Hoặc mở rộng SeedService hiện tại

2. **Tạo admin panel để trigger seed**
   - Thêm controller với endpoints
   - Bảo vệ với authentication/authorization

3. **Tích hợp với migration system**
   - Chạy seed sau khi run migrations
   - Tạo script setup database toàn bộ

4. **Thêm seed data cho môi trường khác**
   - Seed data khác nhau cho dev/staging/prod
   - Conditional seeding based on environment

---

**Tác giả**: GitHub Copilot  
**Ngày tạo**: November 22, 2025  
**Version**: 1.0.0
