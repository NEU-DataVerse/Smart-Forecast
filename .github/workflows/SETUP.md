# GitHub Actions Setup - Quick Start

## ✅ Đã Setup

Dự án đã được cấu hình với 3 GitHub Actions workflows:

### 📁 Files đã tạo:

```
.github/
└── workflows/
    ├── ci-simple.yml    # ⭐ RECOMMENDED - CI đơn giản
    ├── ci-smart.yml     # 🚀 OPTIMAL - CI với change detection
    ├── ci.yml           # 🏭 ADVANCED - CI đầy đủ với artifacts
    └── README.md        # 📖 Hướng dẫn chi tiết
```

---

## 🎯 Chọn Workflow Phù Hợp

### Option 1: CI Simple (Khuyến nghị cho bắt đầu)

**File:** `ci-simple.yml`

**Đặc điểm:**

- ✅ Đơn giản, dễ hiểu
- ✅ Build tất cả modules mỗi lần
- ✅ Cache dependencies
- ✅ Chạy: Lint → Test → Build

**Sử dụng khi:**

- Mới bắt đầu với GitHub Actions
- Team nhỏ, ít commits
- Muốn đảm bảo tất cả modules luôn hoạt động

**Xóa workflows khác:**

```bash
rm .github/workflows/ci.yml
rm .github/workflows/ci-smart.yml
```

---

### Option 2: CI Smart (Khuyến nghị cho production) ⭐

**File:** `ci-smart.yml`

**Đặc điểm:**

- ✅ **Change detection** - Chỉ build module thay đổi
- ✅ Tiết kiệm 40-60% thời gian CI
- ✅ Smart caching
- ✅ Summary report chi tiết

**Sử dụng khi:**

- Đã quen với GitHub Actions
- Team lớn, nhiều commits
- Muốn tối ưu thời gian CI

**Logic:**

```
Thay đổi trong shared/    → Build: Shared + Backend + Web + Mobile
Thay đổi trong backend/   → Build: Backend only
Thay đổi trong web/       → Build: Web only
Thay đổi trong mobile/    → Build: Mobile only
```

**Xóa workflows khác:**

```bash
rm .github/workflows/ci.yml
rm .github/workflows/ci-simple.yml
```

---

### Option 3: CI Full (Advanced)

**File:** `ci.yml`

**Đặc điểm:**

- ✅ Upload build artifacts
- ✅ Change detection với external action
- ✅ Suitable cho complex pipelines

**Sử dụng khi:**

- Cần lưu build artifacts
- Cần deploy artifacts sang staging/production
- Advanced use cases

**Xóa workflows khác:**

```bash
rm .github/workflows/ci-simple.yml
rm .github/workflows/ci-smart.yml
```

---

## 🚀 Quick Start

### 1. Chọn Workflow (Recommend: ci-smart.yml)

```bash
# Xóa 2 workflows không dùng
rm .github/workflows/ci.yml
rm .github/workflows/ci-simple.yml

# Hoặc rename để backup
mv .github/workflows/ci.yml .github/workflows/ci.yml.backup
mv .github/workflows/ci-simple.yml .github/workflows/ci-simple.yml.backup
```

### 2. Test Workflow

```bash
# Tạo test branch
git checkout -b test/ci-setup

# Make a small change
echo "# Test CI" >> README.md

# Commit & push
git add .
git commit -m "test: verify CI setup"
git push origin test/ci-setup

# Tạo Pull Request trên GitHub
# → CI sẽ tự động chạy
```

### 3. Xem Kết Quả

1. Vào GitHub repository
2. Click tab **Actions**
3. Xem workflow run mới nhất

---

## 📊 Ví Dụ Thực Tế

### Scenario 1: Sửa Backend API

```bash
# Changes
- backend/src/auth/auth.service.ts

# CI Smart sẽ:
✅ Build Shared (nếu có thay đổi)
✅ Build Backend (Lint → Test → Build)
⏭️ Skip Web
⏭️ Skip Mobile
⏱️ Time saved: ~3-4 minutes
```

### Scenario 2: Update Shared Types

```bash
# Changes
- shared/src/types/user.types.ts

# CI Smart sẽ:
✅ Build Shared
✅ Build Backend (depends on shared)
✅ Build Web (depends on shared)
✅ Build Mobile (depends on shared)
⏱️ Full build (~6-8 minutes)
```

### Scenario 3: Fix Web Styling

```bash
# Changes
- web/src/app/page.tsx
- web/src/styles/globals.css

# CI Smart sẽ:
✅ Build Shared (nếu có thay đổi)
✅ Build Web (Lint → Build)
⏭️ Skip Backend
⏭️ Skip Mobile
⏱️ Time saved: ~4-5 minutes
```

---

## 🔧 Cấu Hình Branch Protection

### Enable Status Checks

1. Vào `Settings` → `Branches`
2. Add rule cho branch `main`
3. ✅ Require status checks before merging
4. Select checks:
   - `✅ Backend`
   - `✅ Web Frontend`
   - `✅ Mobile App`
   - `✅ CI Success`

### Merge Requirements

- ✅ Require pull request before merging
- ✅ Require approvals: 1
- ✅ Dismiss stale reviews
- ✅ Require status checks to pass

---

## 📈 Expected Performance

### CI Simple

```
Average time: 6-8 minutes
Build order:
1. Install (2 min)
2. Shared (30s)
3. Backend + Web + Mobile (4-5 min parallel)
4. Success check (10s)
```

### CI Smart (with change detection)

```
Backend only: 3-4 minutes
Web only: 2-3 minutes
Mobile only: 1-2 minutes
All modules: 6-8 minutes
Shared + deps: 5-7 minutes
```

---

## 🎯 Next Steps

### 1. Thêm Status Badge vào README

```markdown
<!-- Add to Smart-Forecast/README.md -->

![CI Status](https://github.com/NEU-DataVerse/Smart-Forecast/workflows/Smart%20CI%20-%20Change%20Detection/badge.svg)

# Hoặc

[![CI](https://github.com/NEU-DataVerse/Smart-Forecast/actions/workflows/ci-smart.yml/badge.svg)](https://github.com/NEU-DataVerse/Smart-Forecast/actions/workflows/ci-smart.yml)
```

### 2. Setup Notifications (Optional)

```yaml
# Thêm vào workflow
- name: Notify on failure
  if: failure()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

### 3. Add Code Coverage (Optional)

```yaml
# Trong backend job
- name: Generate coverage
  run: npm --workspace backend run test:cov

- name: Upload coverage
  uses: codecov/codecov-action@v3
  with:
    files: ./backend/coverage/lcov.info
```

---

## 📝 Checklist

- [ ] Chọn 1 trong 3 workflows
- [ ] Xóa/backup các workflows không dùng
- [ ] Test với Pull Request
- [ ] Setup Branch Protection Rules
- [ ] Thêm Status Badge vào README
- [ ] Notify team về CI setup
- [ ] Document trong team wiki

---

## 💡 Pro Tips

### Speed Up Local Development

```bash
# Build only what you need
npm run build:shared        # Shared only
npm run build:backend       # Backend only
npm run build:web           # Web only

# Watch mode for development
npm run dev:shared          # Auto rebuild shared
npm run dev:backend         # Backend dev server
npm run dev:web             # Web dev server
```

### Debug CI Failures Locally

```bash
# Run exact same commands as CI
npm ci                      # Clean install
npm run build:shared        # Build shared
npm run lint:backend        # Lint
npm --workspace backend run test  # Test
npm run build:backend       # Build
```

### Optimize Package.json Scripts

```json
{
  "scripts": {
    "ci:backend": "npm run lint:backend && npm run test && npm run build:backend",
    "ci:web": "npm run lint:web && npm run build:web",
    "ci:mobile": "npm run lint:mobile",
    "ci:all": "npm run build:shared && npm run ci:backend && npm run ci:web && npm run ci:mobile"
  }
}
```

---

## 🆘 Troubleshooting

### CI không chạy

- ✅ Check: GitHub Actions enabled in repository settings
- ✅ Check: Workflow file syntax (YAML)
- ✅ Check: Branch name matches trigger conditions

### Build fails nhưng local OK

- ✅ Check: Node version (CI uses v20)
- ✅ Check: Use `npm ci` not `npm install`
- ✅ Check: Environment variables

### Cache issues

```yaml
# Clear cache bằng cách thay đổi cache key
key: node-modules-v2-${{ runner.os }}-${{ hashFiles('**/package-lock.json') }}
```

---

## 📚 Resources

- 📖 [Detailed README](.github/workflows/README.md)
- 📖 [GitHub Actions Docs](https://docs.github.com/en/actions)
- 📖 [Workflow Syntax](https://docs.github.com/en/actions/reference/workflow-syntax-for-github-actions)

---

**Recommended:** Start với `ci-smart.yml` - Best balance giữa simplicity và optimization! 🚀
