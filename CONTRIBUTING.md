# 🤝 Hướng dẫn đóng góp

Cảm ơn bạn đã quan tâm đến việc đóng góp cho **Smart Forecast**! Chúng tôi hoan nghênh mọi đóng góp từ cộng đồng.

## 📋 Mục Lục

- [Quy tắc ứng xử](#-quy-tắc-ứng-xử)
- [Bắt đầu đóng góp](#-bắt-đầu-đóng-góp)
- [Quy trình phát triển](#-quy-trình-phát-triển)
- [Commit Convention](#-commit-convention)
- [Pull Request](#-pull-request)
- [Coding Standards](#-coding-standards)
- [Báo lỗi](#-báo-lỗi)
- [Đề xuất tính năng](#-đề-xuất-tính-năng)

---

## 📜 Quy tắc ứng xử

Dự án này tuân thủ [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). Bằng việc tham gia, bạn đồng ý tuân thủ các quy tắc này.

---

## 🚀 Bắt đầu đóng góp

### 1. Fork repository

```bash
# Fork trên GitHub, sau đó clone
git clone https://github.com/YOUR_USERNAME/Smart-Forecast.git
cd Smart-Forecast

# Thêm upstream remote
git remote add upstream https://github.com/NEU-DataVerse/Smart-Forecast.git
```

### 2. Cài đặt môi trường

```bash
# Cài đặt dependencies
pnpm install

# Copy file môi trường
cp .env.example .env
cp backend/.env.example backend/.env

# Build shared package
pnpm run build:shared

# Khởi động Docker services
docker compose up -d
```

### 3. Tạo branch mới

```bash
# Cập nhật từ upstream
git fetch upstream
git checkout main
git merge upstream/main

# Tạo branch mới
git checkout -b feat/your-feature-name
```

---

## 🔄 Quy trình phát triển

### Cấu trúc Monorepo

```
Smart-Forecast/
├── backend/     # NestJS Backend
├── web/         # Next.js Web Dashboard
├── mobile/      # Expo React Native App
├── shared/      # Shared TypeScript code
└── docs-site/   # Docusaurus Documentation
```

### Chạy development

```bash
# Backend (NestJS)
pnpm run dev:backend

# Web (Next.js)
pnpm run dev:web

# Mobile (Expo)
pnpm run dev:mobile

# Shared (watch mode)
pnpm run dev:shared
```

### Chạy tests

```bash
# Chạy tất cả tests
pnpm test

# Chạy tests cho từng package
pnpm run test:backend
pnpm run test:web

# Chạy tests với coverage
pnpm run test:cov
```

### Kiểm tra linting

```bash
# Lint tất cả packages
pnpm lint

# Lint và auto-fix
pnpm lint:fix

# Format code với Prettier
pnpm format
```

---

## 📝 Commit Convention

Chúng tôi sử dụng [Conventional Commits](https://www.conventionalcommits.org/) để tạo commit messages rõ ràng và nhất quán.

### Format

```
<type>(<scope>): <subject>

[body]

[footer]
```

### Types

| Type       | Mô tả                               |
| ---------- | ----------------------------------- |
| `feat`     | Tính năng mới                       |
| `fix`      | Sửa lỗi                             |
| `docs`     | Thay đổi tài liệu                   |
| `style`    | Format code (không ảnh hưởng logic) |
| `refactor` | Tái cấu trúc code                   |
| `perf`     | Cải thiện hiệu suất                 |
| `test`     | Thêm/sửa tests                      |
| `chore`    | Công việc bảo trì (build, deps...)  |
| `ci`       | Thay đổi CI/CD                      |

### Scopes

| Scope     | Mô tả                 |
| --------- | --------------------- |
| `backend` | Backend NestJS        |
| `web`     | Web Dashboard Next.js |
| `mobile`  | Mobile App Expo       |
| `shared`  | Shared package        |
| `docs`    | Tài liệu              |
| `docker`  | Docker configuration  |

### Ví dụ

```bash
# Tính năng mới
git commit -m "feat(backend): add weather data caching"

# Sửa lỗi
git commit -m "fix(mobile): resolve map marker rendering issue"

# Tài liệu
git commit -m "docs: update API documentation"

# Refactor
git commit -m "refactor(web): simplify dashboard components"

# Breaking change
git commit -m "feat(backend)!: change API response format

BREAKING CHANGE: API response now uses camelCase instead of snake_case"
```

---

## 🔀 Pull Request

### Trước khi tạo PR

- [ ] Code đã được lint và format
- [ ] Tất cả tests pass
- [ ] Đã thêm tests cho code mới (nếu có)
- [ ] Đã cập nhật tài liệu (nếu cần)
- [ ] Commit messages tuân thủ convention

### Tạo Pull Request

1. Push branch lên fork của bạn:

   ```bash
   git push origin feat/your-feature-name
   ```

2. Tạo Pull Request trên GitHub

3. Điền đầy đủ thông tin trong PR template:
   - Mô tả thay đổi
   - Link đến issue liên quan (nếu có)
   - Screenshots (nếu có thay đổi UI)
   - Checklist đã hoàn thành

### PR Review Process

1. **Automated checks**: CI sẽ chạy lint, tests
2. **Code review**: Ít nhất 1 member review
3. **Merge**: Sau khi được approve, sẽ merge vào `main`

---

## 💻 Coding Standards

### TypeScript

- Sử dụng TypeScript strict mode
- Định nghĩa types/interfaces rõ ràng
- Tránh sử dụng `any`

```typescript
// ✅ Good
interface User {
  id: string;
  name: string;
  email: string;
}

function getUser(id: string): Promise<User> {
  // ...
}

// ❌ Bad
function getUser(id: any): any {
  // ...
}
```

### Naming Conventions

| Loại       | Convention       | Ví dụ                                      |
| ---------- | ---------------- | ------------------------------------------ |
| Variables  | camelCase        | `userName`, `isActive`                     |
| Functions  | camelCase        | `getUserById()`, `handleClick()`           |
| Classes    | PascalCase       | `UserService`, `WeatherController`         |
| Interfaces | PascalCase       | `IUser`, `WeatherData`                     |
| Constants  | UPPER_SNAKE_CASE | `MAX_RETRY`, `API_URL`                     |
| Files      | kebab-case       | `user-service.ts`, `weather-controller.ts` |

### File Structure (NestJS)

```
src/modules/weather/
├── weather.controller.ts
├── weather.service.ts
├── weather.module.ts
├── dto/
│   ├── create-weather.dto.ts
│   └── update-weather.dto.ts
├── entities/
│   └── weather.entity.ts
└── interfaces/
    └── weather.interface.ts
```

---

## 🐛 Báo lỗi

Khi báo lỗi, vui lòng cung cấp:

1. **Mô tả lỗi**: Lỗi là gì?
2. **Các bước tái hiện**: Làm thế nào để gặp lỗi?
3. **Kết quả mong đợi**: Bạn nghĩ nó nên hoạt động như thế nào?
4. **Kết quả thực tế**: Thực tế nó hoạt động như thế nào?
5. **Môi trường**: OS, Node version, Browser...
6. **Screenshots/Logs**: Nếu có

Sử dụng [Bug Report template](https://github.com/NEU-DataVerse/Smart-Forecast/issues/new?template=bug_report.md) khi tạo issue.

---

## 💡 Đề xuất tính năng

Chúng tôi hoan nghênh các ý tưởng mới! Khi đề xuất:

1. **Kiểm tra issues**: Đảm bảo tính năng chưa được đề xuất
2. **Mô tả chi tiết**: Tính năng hoạt động như thế nào?
3. **Use case**: Ai sẽ sử dụng và trong trường hợp nào?
4. **Mockups**: Nếu là UI, có thể thêm wireframe

Sử dụng [Feature Request template](https://github.com/NEU-DataVerse/Smart-Forecast/issues/new?template=feature_request.md) khi tạo issue.

---

## ❓ Cần hỗ trợ?

- 📖 Đọc [Tài liệu](https://neu-dataverse.github.io/Smart-Forecast/)
- 💬 Tạo [GitHub Issue](https://github.com/NEU-DataVerse/Smart-Forecast/issues)
- 📧 Liên hệ team: [GitHub Discussions](https://github.com/NEU-DataVerse/Smart-Forecast/discussions)

---

<p align="center">
  <strong>Cảm ơn bạn đã đóng góp cho Smart Forecast! 🙏</strong>
</p>
