# Hướng Dẫn CI/CD - Smart Forecast

## Tổng Quan

Dự án đã được cấu hình CI/CD tự động sử dụng GitHub Actions. Hệ thống sẽ tự động chạy kiểm tra linting và build khi có code được push lên repository.

## Các Workflow Đã Thiết Lập

### 1. CI/CD Pipeline (`.github/workflows/ci.yml`)

**Kích hoạt khi:**

-   Push code lên các nhánh: `main`, `develop`, hoặc `feat/*`
-   Tạo Pull Request vào nhánh `main` hoặc `develop`

**Các bước thực hiện:**

1. **Backend (NestJS)**

    - ✅ Chạy ESLint để kiểm tra code
    - ✅ Build project
    - ✅ Chạy unit tests

2. **Web (Next.js)**

    - ✅ Chạy ESLint để kiểm tra code
    - ✅ Build project với Turbopack

3. **Mobile (Expo)**
    - ✅ Chạy ESLint để kiểm tra code

### 2. Docker Build (`.github/workflows/docker.yml`)

**Kích hoạt khi:**

-   Push code thay đổi các file liên quan đến Docker
-   Tạo Pull Request với thay đổi Docker

**Các bước thực hiện:**

-   ✅ Build Docker image cho backend
-   ✅ Kiểm tra cấu hình docker-compose.yml

## Cách Sử Dụng Locally

### Kiểm tra linting cho tất cả workspace:

```bash
npm run lint
```

### Kiểm tra linting cho từng workspace:

```bash
npm run lint:backend   # Backend
npm run lint:web       # Web
npm run lint:mobile    # Mobile
```

### Build tất cả project:

```bash
npm run build
```

### Build từng project:

```bash
npm run build:backend  # Backend
npm run build:web      # Web
```

### Chạy tests:

```bash
npm run test
```

## Scripts Đã Thêm Vào Root package.json

Đã thêm các scripts tiện ích sau vào `package.json` gốc:

-   `npm run lint` - Chạy lint cho tất cả workspace
-   `npm run lint:backend` - Lint riêng backend
-   `npm run lint:web` - Lint riêng web
-   `npm run lint:mobile` - Lint riêng mobile
-   `npm run build` - Build tất cả
-   `npm run build:backend` - Build riêng backend
-   `npm run build:web` - Build riêng web
-   `npm run test` - Chạy tests

## Kiểm Tra Trạng Thái Workflow

Sau khi push code lên GitHub, bạn có thể:

1. Vào tab "Actions" trên GitHub repository
2. Xem trạng thái của các workflow đang chạy
3. Kiểm tra logs nếu có lỗi

## Xử Lý Lỗi

### Nếu linting fail:

```bash
# Chạy local để xem lỗi
npm run lint:backend

# Tự động fix (nếu có thể)
npm run lint:backend -- --fix
```

### Nếu build fail:

```bash
# Kiểm tra build local
npm run build:backend
npm run build:web
```

### Nếu Docker build fail:

```bash
# Test Docker locally
docker-compose build
docker-compose config
```

## Lưu Ý

-   Workflow sẽ tự động chạy khi push code
-   Tất cả checks phải pass thì mới được merge PR
-   Nên chạy `npm run lint` và `npm run build` trước khi push để tránh lỗi trên CI

## File Structure

```
.github/
  workflows/
    ├── ci.yml          # Main CI/CD pipeline
    ├── docker.yml      # Docker build validation
    └── README.md       # English documentation
```
