# 🛠️ Scripts Utilities

Các script tiện ích để quản lý Smart-Forecast

## 📋 Danh sách Scripts

### 1. setup.sh / setup.bat

**Mô tả:** Script tự động setup môi trường lần đầu

**Sử dụng:**

```bash
# Linux/Mac
bash scripts/setup.sh

# Windows
scripts\setup.bat
```

**Chức năng:**

- ✅ Kiểm tra Docker và Docker Compose
- ✅ Tạo các file environment từ template:
  - `docker/.env.infrastructure` (Docker services)
  - `backend/.env` (Backend API)
  - `web/.env.local` (Web frontend)
  - `mobile/.env` (Mobile app)
- ✅ Tạo các thư mục cần thiết
- ✅ Pull Docker images
- ✅ Khởi động services
- ✅ Kiểm tra health status
- ✅ Hiển thị service URLs

### 1.5. migrate-env.sh

**Mô tả:** Migrate từ cấu trúc .env cũ (single file) sang cấu trúc mới (separated files)

**Sử dụng:**

```bash
bash scripts/migrate-env.sh
```

**Chức năng:**

- ✅ Parse .env file cũ ở root
- ✅ Tạo 4 file .env mới theo cấu trúc separated
- ✅ Backup .env cũ thành .env.backup
- ✅ Map biến môi trường đúng vị trí

### 2. add-license-header.js

**Mô tả:** Tự động thêm MIT License header vào các file source code

**Sử dụng:**

```bash
# Kiểm tra files thiếu license header (không sửa)
pnpm license:check

# Thêm license header vào các files thiếu
pnpm license:add
```

**Chức năng:**

- ✅ Scan toàn bộ `.ts` và `.tsx` files trong backend, web, mobile, shared
- ✅ Kiểm tra file đã có MIT License header chưa
- ✅ Tự động thêm header nếu thiếu (khi dùng `--fix`)
- ✅ Bảo toàn shebang lines (`#!/usr/bin/env node`)
- ✅ Bỏ qua các file generated, config, và type definitions
- ✅ Sử dụng `git ls-files` để chỉ xử lý tracked files
- ✅ Báo cáo chi tiết: số file modified, skipped, errors

**License Header Template:**

```javascript
/*
 * SPDX-License-Identifier: MIT
 * Copyright (c) 2025 NEU-DataVerse
 */
```

**Files được xử lý:**

- `backend/src/**/*.ts`
- `web/src/**/*.{ts,tsx}`
- `mobile/app/**/*.{ts,tsx}`
- `mobile/components/**/*.{ts,tsx}`
- `mobile/services/**/*.{ts,tsx}`
- `mobile/hooks/**/*.{ts,tsx}`
- `mobile/context/**/*.{ts,tsx}`
- `mobile/store/**/*.{ts,tsx}`
- `mobile/utils/**/*.{ts,tsx}`
- `shared/src/**/*.ts`

**Files bị loại trừ:**

- `*.d.ts` (type definitions)
- `*.config.{ts,js,mjs}` (config files)
- `node_modules/`, `dist/`, `build/`, `.next/`, `.expo/`, `coverage/`

---

- ✅ Hướng dẫn next steps

**Khi nào dùng:**

- Khi bạn có file `.env` cũ ở root directory
- Khi upgrade từ version cũ lên cấu trúc environment mới
- Để tự động convert thay vì manual copy

### 2. health-check.sh

**Mô tả:** Kiểm tra health status của tất cả services

**Sử dụng:**

```bash
bash scripts/health-check.sh
```

**Chức năng:**

- ✅ Kiểm tra Docker Compose status
- ✅ Test endpoints (Orion, Backend, MinIO)
- ✅ Test database connections (PostgreSQL, MongoDB)
- ✅ Kiểm tra container health
- ✅ Kiểm tra ports đang mở
- ✅ Hiển thị summary report

**Output mẫu:**

```
================================
Smart-Forecast Health Check
================================

Checking Docker Compose status...
✅ Docker Compose is running

Testing Service Endpoints...
-----------------------------------
Testing Orion Context Broker... ✅ OK
Testing Backend API... ✅ OK
Testing MinIO Health... ✅ OK

Testing Database Connections...
-----------------------------------
Testing PostgreSQL... ✅ OK
Testing MongoDB... ✅ OK

Checking Container Health Status...
-----------------------------------
Checking orion... ✅ healthy
Checking mongodb... ✅ healthy
Checking postgres... ✅ healthy
Checking minio... ✅ healthy

🎉 All services are running and healthy!
```

## 🚀 Quick Start

### Lần đầu tiên setup:

```bash
# Windows
scripts\setup.bat

# Linux/Mac
bash scripts/setup.sh
```

### Kiểm tra health:

```bash
bash scripts/health-check.sh
```

### Hoặc dùng Makefile:

```bash
# Setup
make setup

# Start services
make up

# Health check
make health

# View logs
make logs
```

## 📝 Tạo Scripts mới

### Template cho Bash Script:

```bash
#!/bin/bash
set -e

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

echo -e "${BLUE}Your Script Name${NC}"
echo "================================"

# Your code here

echo -e "${GREEN}✅ Done!${NC}"
```

### Template cho Windows Batch:

```batch
@echo off
echo ================================
echo Your Script Name
echo ================================

REM Your code here

echo [OK] Done!
pause
```

## 🔧 Troubleshooting Scripts

### Script không chạy (Linux/Mac):

```bash
# Cấp quyền thực thi
chmod +x scripts/your-script.sh

# Chạy
bash scripts/your-script.sh
```

### Script lỗi trên Windows:

```bash
# Đảm bảo line endings đúng
dos2unix scripts/setup.sh

# Hoặc chạy với Git Bash
bash scripts/setup.sh
```

## 📚 Tài liệu liên quan

- [README.md](../README.md) - Hướng dẫn chính
- [QUICKSTART.md](../QUICKSTART.md) - Quick start guide
- [CHEATSHEET.md](../CHEATSHEET.md) - Command reference
- [docs/TROUBLESHOOTING.md](../docs/TROUBLESHOOTING.md) - Troubleshooting guide

## 💡 Tips

1. **Luôn kiểm tra health** sau khi start services:

   ```bash
   bash scripts/health-check.sh
   ```

2. **Sử dụng Makefile** cho các lệnh thường dùng:

   ```bash
   make help  # Xem tất cả lệnh
   ```

3. **Xem logs** khi có lỗi:

   ```bash
   docker-compose logs -f
   ```

4. **Reset toàn bộ** khi cần:
   ```bash
   make reset
   # hoặc
   docker-compose down -v && docker-compose up -d
   ```

---

**Note:** Tất cả scripts đều được test trên Windows Git Bash và Linux/Mac terminal.
