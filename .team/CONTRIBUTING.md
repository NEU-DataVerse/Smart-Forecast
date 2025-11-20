# Contributing Guidelines

Hướng dẫn quy trình làm việc nhóm với Git và GitHub cho dự án Smart-Forecast.

## 📋 Mục lục

- [Quy trình làm việc cơ bản](#quy-trình-làm-việc-cơ-bản)
- [Quy tắc đặt tên Branch](#quy-tắc-đặt-tên-branch)
- [Quy tắc viết Commit Message](#quy-tắc-viết-commit-message)
- [Tạo Pull Request](#tạo-pull-request)
- [Code Review](#code-review)
- [Chạy Lint và Test](#chạy-lint-và-test)

---

## 🔄 Quy trình làm việc cơ bản

### 1. Đồng bộ code từ remote repository

Trước khi bắt đầu làm việc, luôn đảm bảo code của bạn được cập nhật mới nhất:

```bash
# Chuyển về nhánh main
git checkout main

# Lấy thông tin mới nhất từ remote
git fetch origin

# Cập nhật nhánh main local
git pull origin main
```

### 2. Tạo nhánh mới cho tính năng/bugfix

**⚠️ QUAN TRỌNG**: Không bao giờ code trực tiếp trên nhánh `main` hoặc `develop`

```bash
# Tạo và chuyển sang nhánh mới
git checkout -b feature/ten-tinh-nang

# Hoặc
git checkout -b fix/ten-bug
```

### 3. Làm việc trên nhánh của bạn

```bash
# Thực hiện các thay đổi code
# ...

# Kiểm tra các file đã thay đổi
git status

# Xem chi tiết thay đổi
git diff
```

### 4. Chạy Lint và Test trước khi commit

Xem chi tiết ở phần [Chạy Lint và Test](#chạy-lint-và-test)

### 5. Commit code

```bash
# Thêm file vào staging area
git add .

# Hoặc thêm từng file cụ thể
git add src/component/MyComponent.tsx

# Commit với message rõ ràng
git commit -m "feat: add user authentication feature"
```

### 6. Đồng bộ với nhánh main trước khi push

```bash
# Lấy code mới nhất từ main
git fetch origin main

# Rebase nhánh của bạn lên main (khuyến nghị)
git rebase origin/main

# Hoặc merge (nếu team quy định)
git merge origin/main

# Giải quyết conflicts nếu có
```

### 7. Push code lên remote

```bash
# Lần đầu tiên push nhánh mới
git push -u origin feature/ten-tinh-nang

# Các lần push tiếp theo
git push

# Nếu đã rebase, cần force push (cẩn thận!)
git push --force-with-lease
```

### 8. Tạo Pull Request

Xem chi tiết ở phần [Tạo Pull Request](#tạo-pull-request)

---

## 🌿 Quy tắc đặt tên Branch

### Cấu trúc tên branch

```
<type>/<short-description>
```

### Các loại branch

| Type                  | Mục đích                         | Ví dụ                       |
| --------------------- | -------------------------------- | --------------------------- |
| `feature/`            | Phát triển tính năng mới         | `feature/user-login`        |
| `fix/` hoặc `bugfix/` | Sửa lỗi                          | `fix/login-validation`      |
| `hotfix/`             | Sửa lỗi khẩn cấp trên production | `hotfix/security-patch`     |
| `refactor/`           | Tái cấu trúc code                | `refactor/auth-service`     |
| `docs/`               | Cập nhật tài liệu                | `docs/api-documentation`    |
| `test/`               | Thêm hoặc sửa tests              | `test/user-service`         |
| `chore/`              | Các tác vụ bảo trì               | `chore/update-dependencies` |

### Quy tắc đặt tên

✅ **Nên:**

- Sử dụng chữ thường
- Sử dụng dấu gạch ngang `-` để phân tách từ
- Ngắn gọn, mô tả rõ ràng
- Sử dụng tiếng Anh

❌ **Không nên:**

- Sử dụng khoảng trắng
- Sử dụng ký tự đặc biệt (ngoại trừ `-`, `/`)
- Tên quá dài hoặc quá chung chung

**Ví dụ:**

```bash
✅ feature/add-payment-gateway
✅ fix/navbar-responsive-issue
✅ refactor/database-connection
✅ docs/update-readme

❌ feature/Add Payment Gateway
❌ fix_navbar_issue
❌ myfeature
❌ abc123
```

---

## 📝 Quy tắc viết Commit Message

### Format chuẩn (Conventional Commits)

```
<type>(<scope>): <subject>

<body>

<footer>
```

### Cấu trúc chi tiết

#### 1. Header (bắt buộc)

```
<type>(<scope>): <subject>
```

- **type**: Loại thay đổi (bắt buộc)
- **scope**: Phạm vi thay đổi (tùy chọn)
- **subject**: Mô tả ngắn gọn (bắt buộc, <= 50 ký tự)

#### 2. Body (tùy chọn)

Mô tả chi tiết hơn về thay đổi, lý do thay đổi, và cách thực hiện.

#### 3. Footer (tùy chọn)

Thông tin về breaking changes hoặc reference đến issues.

### Các loại type

| Type       | Mô tả                               | Ví dụ                                       |
| ---------- | ----------------------------------- | ------------------------------------------- |
| `feat`     | Tính năng mới                       | `feat(auth): add Google OAuth login`        |
| `fix`      | Sửa lỗi                             | `fix(api): handle null pointer exception`   |
| `docs`     | Thay đổi tài liệu                   | `docs(readme): update installation guide`   |
| `style`    | Format code (không ảnh hưởng logic) | `style(header): fix indentation`            |
| `refactor` | Tái cấu trúc code                   | `refactor(user): simplify validation logic` |
| `perf`     | Cải thiện performance               | `perf(db): optimize query execution`        |
| `test`     | Thêm/sửa tests                      | `test(auth): add unit tests for login`      |
| `chore`    | Tác vụ bảo trì                      | `chore(deps): update dependencies`          |
| `ci`       | Thay đổi CI/CD                      | `ci(github): add automated testing`         |
| `revert`   | Hoàn tác commit trước               | `revert: feat(auth): add OAuth`             |

### Quy tắc viết

✅ **Nên:**

- Viết ở thì hiện tại: "add feature" không phải "added feature"
- Không viết hoa chữ cái đầu của subject
- Không dùng dấu chấm ở cuối subject
- Subject ngắn gọn, rõ ràng (≤ 50 ký tự)
- Body giải thích "why" và "what", không phải "how"
- Tách các thay đổi không liên quan thành nhiều commits

❌ **Không nên:**

- Commit message chung chung: "update code", "fix bug"
- Một commit chứa quá nhiều thay đổi không liên quan
- Subject quá dài

### Ví dụ commit messages

#### Commit đơn giản

```bash
feat: add user registration endpoint
fix: resolve login timeout issue
docs: update API documentation
style: format code with prettier
refactor: extract validation logic to helper
```

#### Commit với scope

```bash
feat(backend): implement JWT authentication
fix(frontend): correct input validation in signup form
test(api): add integration tests for user endpoints
chore(docker): update Node.js to version 20
```

#### Commit với body và footer

```bash
feat(auth): implement two-factor authentication

Add support for TOTP-based 2FA using speakeasy library.
Users can enable 2FA in their profile settings.

Closes #123
```

#### Breaking change

```bash
feat(api)!: change response format for user endpoint

BREAKING CHANGE: User API now returns nested objects
instead of flat structure. Update your client code accordingly.

Before: { id: 1, userName: "john" }
After: { id: 1, profile: { userName: "john" } }
```

### Các lệnh Git hữu ích

```bash
# Sửa commit message của commit cuối cùng
git commit --amend -m "new message"

# Thêm file vào commit cuối cùng mà không thay đổi message
git add forgotten-file.js
git commit --amend --no-edit

# Xem lịch sử commit
git log --oneline --graph

# Tạo commit với body và footer
git commit -m "feat(auth): add OAuth" -m "Detailed description here" -m "Closes #123"
```

---

## 🔀 Tạo Pull Request

### Trước khi tạo PR

#### 1. Checklist

- [ ] Code đã được test kỹ trên local
- [ ] Đã chạy lint và fix tất cả warnings/errors
- [ ] Đã chạy tests và tất cả đều pass
- [ ] Code đã được rebase/merge với nhánh main mới nhất
- [ ] Không có conflicts
- [ ] Đã xóa code debug/console.log không cần thiết
- [ ] Đã update documentation nếu cần

#### 2. Cập nhật từ main

```bash
git checkout main
git pull origin main
git checkout feature/your-branch
git rebase origin/main  # hoặc git merge origin/main
git push --force-with-lease  # nếu đã rebase
```

### Cách tạo Pull Request trên GitHub

1. **Truy cập repository trên GitHub**
2. **Click nút "Pull requests" → "New pull request"**
3. **Chọn base branch (thường là `main`) và compare branch (nhánh của bạn)**

### Template cho PR Title

```
<type>(<scope>): <short description>
```

**Ví dụ:**

```
feat(auth): implement user login with JWT
fix(api): resolve CORS issue in production
docs: update contributing guidelines
```

### Template cho PR Description

```markdown
## 📝 Description

[Mô tả ngắn gọn về những gì PR này làm]

## 🎯 Type of Change

- [ ] ✨ New feature
- [ ] 🐛 Bug fix
- [ ] 📝 Documentation update
- [ ] ♻️ Code refactoring
- [ ] ⚡ Performance improvement
- [ ] ✅ Test update
- [ ] 🔧 Configuration change

## 🔗 Related Issues

Closes #[issue number]
Related to #[issue number]

## 📸 Screenshots (if applicable)

[Thêm screenshots nếu có thay đổi UI]

## ✅ Testing

- [ ] Unit tests passed
- [ ] Integration tests passed
- [ ] Manual testing completed

### Test Steps:

1. [Bước test 1]
2. [Bước test 2]
3. [Bước test 3]

## 📋 Checklist

- [ ] Code follows project style guidelines
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No new warnings generated
- [ ] Tests added/updated
- [ ] All tests passing
- [ ] Rebased with latest main

## 💬 Additional Notes

[Bất kỳ thông tin bổ sung nào mà reviewers cần biết]
```

### Ví dụ PR hoàn chỉnh

**Title:**

```
feat(backend): add email verification for new users
```

**Description:**

```markdown
## 📝 Description

Implement email verification functionality for newly registered users. Users will receive a verification email with a unique token that expires in 24 hours.

## 🎯 Type of Change

- [x] ✨ New feature
- [ ] 🐛 Bug fix

## 🔗 Related Issues

Closes #45

## ✅ Testing

- [x] Unit tests passed
- [x] Integration tests passed
- [x] Manual testing completed

### Test Steps:

1. Register a new user account
2. Check email for verification link
3. Click verification link
4. Verify account is activated
5. Test token expiration after 24 hours

## 📋 Checklist

- [x] Code follows project style guidelines
- [x] Self-review completed
- [x] Comments added for complex logic
- [x] Documentation updated
- [x] No new warnings generated
- [x] Tests added/updated
- [x] All tests passing
- [x] Rebased with latest main

## 💬 Additional Notes

- Using nodemailer for sending emails
- Tokens are stored in Redis with TTL of 24 hours
- Email templates are in `/templates/email/`
```

### Best Practices cho PR

✅ **Nên:**

- PR nhỏ, tập trung vào một vấn đề cụ thể
- Title và description rõ ràng, chi tiết
- Link đến related issues
- Thêm screenshots cho UI changes
- Request reviewers phù hợp
- Respond nhanh chóng với review comments
- Keep PR updated với main branch

❌ **Không nên:**

- PR quá lớn (>500 lines changed)
- Thay đổi nhiều thứ không liên quan trong 1 PR
- Description mơ hồ hoặc để trống
- Ignore review comments
- Force push sau khi có reviews (trừ khi cần thiết)

---

## 👀 Code Review

### Khi bạn là người tạo PR

1. **Self-review trước:**
   - Đọc lại toàn bộ code changes
   - Check formatting và style
   - Đảm bảo không commit files không cần thiết

2. **Respond với review comments:**

   ```markdown
   ✅ Good response:
   "Good catch! I've updated the validation logic in commit abc123"

   ❌ Bad response:
   "ok"
   ```

3. **Request re-review sau khi fix:**
   - Click "Re-request review" sau khi đã address comments

### Khi bạn review PR của người khác

1. **Review kỹ càng:**
   - Logic có đúng không?
   - Code có dễ đọc, dễ maintain không?
   - Có potential bugs không?
   - Performance có vấn đề gì không?
   - Security có vấn đề gì không?

2. **Comment constructive:**

   ```markdown
   ✅ Good comment:
   "Consider using Array.map() here instead of forEach for better
   readability and functional programming style."

   ❌ Bad comment:
   "This is wrong."
   ```

3. **Phân loại comments:**
   - 🔴 **Critical:** Phải fix trước khi merge
   - 🟡 **Suggestion:** Nên fix nhưng không bắt buộc
   - 💬 **Question:** Hỏi để hiểu rõ hơn

4. **Approve/Request changes:**
   - ✅ **Approve:** Code OK, có thể merge
   - 💬 **Comment:** Có ý kiến nhưng không block merge
   - ⚠️ **Request changes:** Cần fix trước khi merge

---

## 🔍 Chạy Lint và Test

### Trước khi commit

**⚠️ QUAN TRỌNG:** Luôn chạy lint và test trước khi commit!

### Backend (NestJS)

```bash
# Chạy ESLint cho backend
pnpm --filter backend run lint

# Tự động fix các lỗi có thể fix được
pnpm --filter backend run lint:fix

# Chạy unit tests
pnpm --filter backend run test

# Chạy e2e tests
pnpm --filter backend run test:e2e

# Chạy tests với coverage
pnpm --filter backend run test:cov
```

### Frontend Web (Next.js)

```bash
# Chạy ESLint cho web
pnpm --filter web run lint

# Tự động fix các lỗi có thể fix được
pnpm --filter web run lint -- --fix

# Chạy type checking
pnpm --filter web run type-check  # nếu có script này

# Build để check errors
pnpm --filter web run build
```

### Mobile (Expo/React Native)

```bash
# Chạy ESLint cho mobile
pnpm --filter mobile run lint

# Tự động fix
pnpm --filter mobile run lint -- --fix
```

### Chạy tất cả lint cùng lúc (từ root)

```bash
# Chạy lint cho tất cả packages
pnpm -r run lint

# Hoặc chạy tuần tự từng package
pnpm --filter backend run lint && pnpm --filter web run lint && pnpm --filter mobile run lint
```

### Setup Git Hooks (Tự động)

Sử dụng **husky** và **lint-staged** để tự động chạy lint trước khi commit:

#### 1. Cài đặt (nếu chưa có)

```bash
pnpm add -D husky lint-staged
npx husky install
```

#### 2. Thêm vào package.json

```json
{
  "lint-staged": {
    "*.{js,jsx,ts,tsx}": ["eslint --fix", "git add"]
  },
  "scripts": {
    "prepare": "husky install"
  }
}
```

#### 3. Tạo pre-commit hook

```bash
npx husky add .husky/pre-commit "npx lint-staged"
```

Sau khi setup, mỗi lần commit, lint sẽ tự động chạy!

### Xử lý lỗi Lint

```bash
# Nếu có lỗi lint, fix bằng tay hoặc:
pnpm -r run lint:fix

# Nếu không fix được, đọc error message và fix manual
# KHÔNG BAO GIỜ dùng --no-verify để skip lint!

# Check lại sau khi fix
pnpm -r run lint
```

---

## 🚀 Workflow hoàn chỉnh (Example)

### Ví dụ: Phát triển tính năng User Profile

```bash
# 1. Đồng bộ code mới nhất
git checkout main
git pull origin main

# 2. Tạo nhánh mới
git checkout -b feature/user-profile

# 3. Code tính năng...
# (Viết code, tạo components, services, etc.)

# 4. Chạy lint
pnpm --filter backend run lint:fix
pnpm --filter web run lint:fix

# 5. Chạy tests
pnpm --filter backend run test
pnpm --filter backend run test:e2e

# 6. Commit code
git add .
git status  # Review files
git commit -m "feat(user): add user profile page with edit functionality"

# 7. Đồng bộ với main
git fetch origin main
git rebase origin/main

# 8. Giải quyết conflicts (nếu có)
# ... fix conflicts ...
git add .
git rebase --continue

# 9. Push lên remote
git push -u origin feature/user-profile

# 10. Tạo Pull Request trên GitHub
# - Điền title: "feat(user): add user profile page"
# - Điền description theo template
# - Request reviewers
# - Assign yourself
# - Add labels

# 11. Sau khi được approve, merge PR
# - Squash and merge (khuyến nghị)
# - Delete branch sau khi merge

# 12. Đồng bộ local
git checkout main
git pull origin main
git branch -d feature/user-profile  # Xóa nhánh local
```

---

## 📚 Tài nguyên tham khảo

- [Conventional Commits](https://www.conventionalcommits.org/)
- [Git Best Practices](https://git-scm.com/book/en/v2)
- [GitHub Flow](https://guides.github.com/introduction/flow/)
- [How to Write a Git Commit Message](https://chris.beams.io/posts/git-commit/)
- [Code Review Best Practices](https://google.github.io/eng-practices/review/)

---

## ❓ FAQ

### Q: Tôi làm gì nếu quên không tạo nhánh mới và đã code trên main?

```bash
# Tạo nhánh mới từ vị trí hiện tại
git checkout -b feature/my-feature

# Main vẫn giữ nguyên, bạn đã chuyển sang nhánh mới với code của mình
```

### Q: Làm sao để hoàn tác commit cuối cùng?

```bash
# Giữ lại changes trong working directory
git reset --soft HEAD~1

# Hoàn tác cả changes
git reset --hard HEAD~1
```

### Q: Conflict khi rebase, làm sao?

```bash
# 1. Mở file conflict, tìm markers:
# <<<<<<< HEAD
# ...your code...
# =======
# ...their code...
# >>>>>>> commit-message

# 2. Edit file, giữ lại code đúng

# 3. Mark as resolved
git add <file>

# 4. Continue rebase
git rebase --continue

# Hoặc abort nếu muốn hủy
git rebase --abort
```

### Q: Tôi push nhầm secret keys/passwords, làm sao?

```bash
# 1. Xóa ngay trong code
git rm --cached <file>
git commit -m "chore: remove sensitive file"
git push

# 2. Rotate/thay đổi credentials đã bị lộ NGAY LẬP TỨC

# 3. Add vào .gitignore
echo "<file>" >> .gitignore

# 4. Cân nhắc dùng git-filter-repo để xóa khỏi history
```

### Q: PR quá lớn, reviewer khó review?

```bash
# Chia nhỏ PR:
# 1. Tạo nhiều commits logical
git add <files-for-feature-1>
git commit -m "feat: part 1"

git add <files-for-feature-2>
git commit -m "feat: part 2"

# 2. Hoặc chia thành nhiều PRs nhỏ, merge tuần tự
```

---

## 🎯 Quick Reference

### Các lệnh Git thường dùng

```bash
# Status & Info
git status
git log --oneline --graph
git diff
git diff --staged

# Branch
git branch                    # List branches
git branch -d <branch>        # Delete local branch
git checkout -b <branch>      # Create and switch branch
git switch <branch>           # Switch branch (Git 2.23+)

# Sync
git fetch origin
git pull origin main
git push origin <branch>
git push --force-with-lease   # Safe force push

# Commit
git add .
git add <file>
git commit -m "message"
git commit --amend

# Stash
git stash                     # Save changes temporarily
git stash pop                 # Apply and remove stash
git stash list                # List stashes

# Undo
git reset HEAD <file>         # Unstage file
git checkout -- <file>        # Discard changes
git reset --soft HEAD~1       # Undo last commit, keep changes
git reset --hard HEAD~1       # Undo last commit, discard changes

# Remote
git remote -v                 # Show remotes
git remote add origin <url>   # Add remote
```

### Commit Type Quick Reference

```
feat:     ✨ New feature
fix:      🐛 Bug fix
docs:     📝 Documentation
style:    💎 Code style
refactor: ♻️  Refactoring
perf:     ⚡ Performance
test:     ✅ Testing
chore:    🔧 Maintenance
ci:       👷 CI/CD
revert:   ⏪ Revert
```

---

**Chúc các bạn code vui vẻ! 🚀**

_Nếu có thắc mắc, hãy tạo issue hoặc liên hệ team lead._
