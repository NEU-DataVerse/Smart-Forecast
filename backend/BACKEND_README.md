# Smart Forecast Backend - API Documentation

Backend service của Smart Forecast platform, xây dựng với NestJS.

## 📋 Các Issue đã hoàn thành

### ✅ P1-AUTH-01: Thiết kế DB (User)

- Tạo User entity với TypeORM
- Hỗ trợ 2 role: ADMIN và CITIZEN
- Tự động hash password với bcrypt
- Các trường: id, email, password, fullName, phoneNumber, avatarUrl, fcmToken, role, isActive

### ✅ P1-BE-02: Cấu hình cơ sở dữ liệu

- Thiết lập TypeORM kết nối PostgreSQL
- Database configuration trong `config/database.config.ts`
- Tự động sync schema trong development mode

### ✅ P1-BE-03: Cấu trúc Module

- Module auth: Xác thực và phân quyền
- Module user: Quản lý người dùng
- Module airquality: Dữ liệu chất lượng không khí (placeholder)
- Module incident: Báo cáo sự cố (placeholder)
- Common guards, decorators, interceptors

### ✅ P1-BE-04: Cấu hình Environment

- File .env và .env.example
- ConfigModule với app, database, jwt configs
- Quản lý biến môi trường tập trung

## 🎯 API Endpoints

### Authentication

**POST** `/api/v1/auth/register` - Đăng ký tài khoản (Citizen)

```json
{
  "email": "user@example.com",
  "password": "password123",
  "fullName": "Nguyễn Văn A",
  "phoneNumber": "0123456789"
}
```

**POST** `/api/v1/auth/login` - Đăng nhập

```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**GET** `/api/v1/auth/me` - Lấy thông tin user hiện tại (cần JWT token)

### Users

**GET** `/api/v1/users` - Danh sách users (cần auth)

**GET** `/api/v1/users/:id` - Chi tiết user (cần auth)

## 🔐 Sử dụng Shared Types

Backend sử dụng types từ package `@smart-forecast/shared`:

```typescript
import { UserRole, IUser, ILoginRequest, IJwtPayload } from '@smart-forecast/shared';

// DTO implements shared interface
export class LoginDto implements ILoginRequest {
  email: string;
  password: string;
}
```

## 🚀 Chạy ứng dụng

```bash
# Build shared package trước
cd ../shared && npm run build

# Về backend và cài đặt
cd ../backend
npm install

# Copy file env
cp .env.example .env

# Chạy development
npm run start:dev
```

Application sẽ chạy tại: `http://localhost:8000`

API docs: `http://localhost:8000/api/v1`

## 📦 Dependencies chính

- @nestjs/core, @nestjs/common - NestJS framework
- @nestjs/typeorm, typeorm, pg - Database ORM
- @nestjs/jwt, @nestjs/passport - Authentication
- @smart-forecast/shared - Shared types & constants
- bcrypt - Password hashing
- class-validator, class-transformer - Validation

## 🗄️ Database Schema

### Table: users

| Column      | Type      | Constraints       |
| ----------- | --------- | ----------------- |
| id          | UUID      | PRIMARY KEY       |
| email       | VARCHAR   | UNIQUE, NOT NULL  |
| password    | VARCHAR   | NOT NULL          |
| fullName    | VARCHAR   | NULL              |
| phoneNumber | VARCHAR   | NULL              |
| avatarUrl   | VARCHAR   | NULL              |
| fcmToken    | VARCHAR   | NULL              |
| role        | ENUM      | DEFAULT 'CITIZEN' |
| isActive    | BOOLEAN   | DEFAULT true      |
| createdAt   | TIMESTAMP | DEFAULT NOW()     |
| updatedAt   | TIMESTAMP | DEFAULT NOW()     |

## 👥 Team NEU-DataVerse

- Khải - Backend Lead, DevOps
- Đạt - Frontend Web
- Bích - Frontend Mobile & Documentation
