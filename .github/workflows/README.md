# GitHub Actions CI/CD Setup

## 📋 Tổng Quan

Repository này có 3 workflow GitHub Actions cho monorepo:

1. **`ci-simple.yml`** - CI pipeline đơn giản, build tất cả modules
2. **`ci-smart.yml`** - CI pipeline thông minh với change detection
3. **`ci.yml`** - CI pipeline đầy đủ với artifacts upload

## 🚀 Workflows

### 1. CI Simple (`ci-simple.yml`)

**Khuyến nghị: Dùng workflow này để bắt đầu**

**Đặc điểm:**

- ✅ Đơn giản, dễ hiểu
- ✅ Build tuần tự: Shared → Backend/Web/Mobile song song
- ✅ Sử dụng cache để tăng tốc
- ✅ Chạy lint và test

**Workflow:**

```
Install Dependencies
        ↓
  Build Shared
        ↓
   ┌────┼────┐
   ↓    ↓    ↓
Backend Web Mobile
   (Lint, Test, Build)
```

**Kích hoạt:**

- Pull request vào `main` hoặc `develop`
- Push vào `main` hoặc `develop`

---

### 2. CI Smart (`ci-smart.yml`)

**Khuyến nghị: Dùng khi muốn tối ưu thời gian CI**

**Đặc điểm:**

- ✅ **Change detection** - Chỉ build module có thay đổi
- ✅ Tiết kiệm thời gian và tài nguyên
- ✅ Summary report chi tiết
- ✅ Smart caching

**Change Detection Logic:**

```bash
# Nếu thay đổi shared/ → Build: Shared + Backend + Web + Mobile
# Nếu thay đổi backend/ → Build: Backend only
# Nếu thay đổi web/ → Build: Web only
# Nếu thay đổi mobile/ → Build: Mobile only
```

**Ví dụ:**

```
PR thay đổi:
  - backend/src/auth/auth.service.ts
  - web/src/app/page.tsx

→ Chỉ build Backend và Web
→ Skip Mobile build (tiết kiệm thời gian)
```

---

### 3. CI Full (`ci.yml`)

**Sử dụng cho production-ready projects**

**Đặc điểm:**

- ✅ Upload build artifacts
- ✅ Change detection với external action
- ✅ Parallel builds
- ✅ Retention của artifacts

---

## 📊 So Sánh Workflows

| Feature          | CI Simple | CI Smart   | CI Full   |
| ---------------- | --------- | ---------- | --------- |
| Change Detection | ❌        | ✅         | ✅        |
| Build Artifacts  | ❌        | ❌         | ✅        |
| Parallel Builds  | ✅        | ✅         | ✅        |
| Caching          | ✅        | ✅         | ✅        |
| Summary Report   | Basic     | Detailed   | Basic     |
| Complexity       | Low       | Medium     | High      |
| **Thời gian CI** | ~5-8 min  | ~2-5 min\* | ~6-10 min |

\*Tùy thuộc vào số module thay đổi

---

## 🔧 Cấu Hình

### Prerequisites

1. **Enable GitHub Actions**

   - Vào `Settings` → `Actions` → `General`
   - Enable "Allow all actions and reusable workflows"

2. **Branch Protection Rules** (Optional)
   - Vào `Settings` → `Branches` → `Add rule`
   - Branch name pattern: `main`
   - ✅ Require status checks before merging
   - Select: `CI Pipeline` hoặc `Smart CI`

### Workflow Selection

**Chọn 1 trong 3 workflows để sử dụng:**

#### Option 1: Simple (Recommended cho bắt đầu)

```bash
# Keep only ci-simple.yml
rm .github/workflows/ci.yml
rm .github/workflows/ci-smart.yml
```

#### Option 2: Smart (Recommended cho production)

```bash
# Keep only ci-smart.yml
rm .github/workflows/ci.yml
rm .github/workflows/ci-simple.yml
```

#### Option 3: Full (Advanced)

```bash
# Keep only ci.yml
rm .github/workflows/ci-simple.yml
rm .github/workflows/ci-smart.yml
```

---

## 📝 Cách Sử Dụng

### Tạo Pull Request

```bash
# 1. Create feature branch
git checkout -b feat/your-feature

# 2. Make changes
# Ví dụ: Sửa file trong backend/
code backend/src/auth/auth.service.ts

# 3. Commit changes
git add .
git commit -m "feat: add new auth feature"

# 4. Push to GitHub
git push origin feat/your-feature

# 5. Create Pull Request
# → GitHub Actions sẽ tự động chạy
```

### Xem Kết Quả CI

1. Vào tab **Actions** trên GitHub
2. Click vào workflow run mới nhất
3. Xem chi tiết từng job:
   - ✅ Green check = Success
   - ❌ Red X = Failed
   - ⏭️ Gray skip = Skipped

### Debug Failed CI

```bash
# 1. Xem logs trên GitHub Actions
# 2. Reproduce locally:

# Install dependencies
npm ci

# Build shared
npm run build:shared

# Run specific check that failed
npm run lint:backend
npm run test:backend
npm run build:backend
```

---

## 🎯 Best Practices

### 1. Commit Messages

```bash
# Good
git commit -m "feat(backend): add user authentication"
git commit -m "fix(web): resolve login button styling"

# Bad
git commit -m "update"
git commit -m "fix bug"
```

### 2. Test Locally Before Push

```bash
# Run all checks locally
npm run lint
npm run build
npm run test
```

### 3. Small, Focused PRs

- ✅ 1 PR = 1 feature
- ✅ Dễ review, dễ merge
- ✅ CI chạy nhanh hơn

### 4. Keep Dependencies Updated

```bash
# Update packages regularly
npm update
npm audit fix
```

---

## 🐛 Troubleshooting

### CI fails với "npm ci" error

```bash
# Solution: Delete package-lock.json và regenerate
rm package-lock.json
npm install
git add package-lock.json
git commit -m "chore: regenerate package-lock.json"
```

### CI fails với "build:shared" error

```bash
# Kiểm tra shared/tsconfig.json
# Đảm bảo có "declaration": true
cd shared
npm run build
```

### Cache issues

```yaml
# Trong workflow file, thêm:
- name: Clear cache
  run: npm cache clean --force
```

### Timeout issues

```yaml
# Tăng timeout (mặc định 60 phút)
jobs:
  build:
    timeout-minutes: 90
```

---

## 📈 Monitoring & Metrics

### GitHub Actions Dashboard

- Vào `Actions` tab
- Xem:
  - ✅ Success rate
  - ⏱️ Average duration
  - 📊 Workflow runs

### Optimize CI Time

1. **Enable caching** (Already done ✅)
2. **Use change detection** (ci-smart.yml)
3. **Parallel jobs** (Already done ✅)
4. **Reduce test time**:
   ```bash
   # Run only changed tests
   npm test -- --onlyChanged
   ```

---

## 🔐 Secrets Management

### Thêm Secrets (nếu cần)

1. Vào `Settings` → `Secrets and variables` → `Actions`
2. Click `New repository secret`
3. Thêm:
   - `DATABASE_URL`
   - `JWT_SECRET`
   - `API_KEY`

### Sử dụng trong workflow:

```yaml
- name: Run tests
  env:
    DATABASE_URL: ${{ secrets.DATABASE_URL }}
    JWT_SECRET: ${{ secrets.JWT_SECRET }}
  run: npm test
```

---

## 📚 Tài Liệu Thêm

- [GitHub Actions Docs](https://docs.github.com/en/actions)
- [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)
- [Caching Dependencies](https://docs.github.com/en/actions/guides/caching-dependencies-to-speed-up-workflows)

---

## 💡 Tips

### Speed Up CI

```yaml
# 1. Use latest Node.js version
node-version: "20"

# 2. Use npm ci instead of npm install
run: npm ci

# 3. Cache node_modules
uses: actions/cache@v4
```

### Notifications

```yaml
# Slack notification on failure
- name: Slack Notification
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
```

### Status Badge

Thêm vào README.md:

```markdown
![CI](https://github.com/YOUR_ORG/Smart-Forecast/workflows/CI%20Pipeline/badge.svg)
```

---

## 🎉 Kết Luận

Chọn workflow phù hợp với nhu cầu:

- 🚀 **Bắt đầu:** `ci-simple.yml`
- ⚡ **Tối ưu:** `ci-smart.yml`
- 🏭 **Production:** `ci.yml`

Happy coding! 🎨
