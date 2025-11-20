# 🤖 Automation Tools Guide

Hướng dẫn sử dụng các công cụ tự động hóa trong Smart-Forecast cho người mới bắt đầu.

## 📋 Mục lục

- [Tổng quan](#tổng-quan)
- [Makefile - Công cụ chính](#makefile---công-cụ-chính)
- [Setup Scripts](#setup-scripts)
- [Khi nào dùng gì](#khi-nào-dùng-gì)
- [Troubleshooting](#troubleshooting)

---

## 🎯 Tổng quan

Smart-Forecast cung cấp 3 loại công cụ tự động hóa:

| Công cụ             | Hệ điều hành                   | Mục đích          | Vị trí                     |
| ------------------- | ------------------------------ | ----------------- | -------------------------- |
| **Makefile**        | Linux/macOS/Windows (Git Bash) | Tác vụ hàng ngày  | `/Makefile`                |
| **setup.sh**        | Linux/macOS/Git Bash           | Setup ban đầu     | `/scripts/setup.sh`        |
| **setup.bat**       | Windows (CMD/PowerShell)       | Setup ban đầu     | `/scripts/setup.bat`       |
| **health-check.sh** | Linux/macOS/Git Bash           | Kiểm tra services | `/scripts/health-check.sh` |

---

## 🔨 Makefile - Công cụ chính

### Makefile là gì?

Makefile là file cấu hình cho công cụ `make` - giúp tự động hóa các tác vụ lặp đi lặp lại bằng các lệnh ngắn gọn.

### Cài đặt Make

#### Linux

```bash
# Ubuntu/Debian
sudo apt-get install build-essential

# Fedora/RHEL
sudo dnf install make
```

#### macOS

```bash
# Đã có sẵn với Xcode Command Line Tools
xcode-select --install
```

#### Windows

```bash
# Cách 1: Dùng Git Bash (khuyến nghị)
# Make đã có sẵn với Git for Windows

# Cách 2: Chocolatey
choco install make

# Cách 3: WSL (Windows Subsystem for Linux)
wsl --install
```

### Cách sử dụng Makefile

#### 1. Xem danh sách lệnh có sẵn

```bash
make help
```

Kết quả:

```
Smart-Forecast - Makefile Commands
======================================
backup               Backup databases
build                Build services
clean                Dừng và xóa tất cả (bao gồm volumes)
dev-backend          Chạy backend development
dev-mobile           Chạy mobile app development
dev-web              Chạy web frontend development
down                 Dừng tất cả services
health               Kiểm tra health của services
help                 Hiển thị help
install              Install dependencies cho tất cả packages
...
```

#### 2. Docker & Services Management

```bash
# Khởi động tất cả Docker services
make up

# Dừng tất cả services
make down

# Restart services
make restart

# Xem logs
make logs

# Xem logs của service cụ thể
make logs-orion
make logs-postgres
make logs-minio

# Xem status các services
make ps

# Pull images mới
make pull

# Build lại services
make build

# Rebuild và restart
make rebuild
```

#### 3. Development Commands

```bash
# Cài đặt dependencies cho tất cả packages
make install

# Chạy backend development
make dev-backend

# Chạy web frontend
make dev-web

# Chạy mobile app
make dev-mobile
```

#### 4. Database Management

```bash
# Mở PostgreSQL shell
make db-shell

# Mở MongoDB shell
make mongo-shell

# Backup databases
make backup

# Mở MinIO console trong browser
make minio-console
```

#### 5. System Monitoring

```bash
# Kiểm tra health của services
make health

# Xem resource usage
make stats

# Xem docker networks
make networks

# Xem docker volumes
make volumes

# Test các services
make test

# Xem version các services
make version
```

#### 6. Maintenance

```bash
# Setup môi trường lần đầu
make setup

# Dừng và xóa tất cả (bao gồm data)
make clean

# Reset toàn bộ hệ thống
make reset
```

### Ví dụ workflow hàng ngày

```bash
# Sáng - bắt đầu làm việc
make up              # Start Docker services
make install         # Cài/update dependencies (nếu cần)
make dev-backend     # Terminal 1: Start backend

# Terminal mới
make dev-web         # Terminal 2: Start web frontend

# Kiểm tra health
make health

# Xem logs nếu có lỗi
make logs-orion

# Tối - kết thúc
make down            # Stop tất cả services
```

---

## 📜 Setup Scripts

### setup.sh (Linux/macOS) & setup.bat (Windows)

Scripts này giúp setup toàn bộ môi trường lần đầu tiên.

#### Chức năng:

1. ✅ Kiểm tra Docker & Docker Compose đã cài chưa
2. ✅ Tạo file `.env` từ `.env.example`
3. ✅ Tạo các thư mục cần thiết
4. ✅ Pull Docker images
5. ✅ Khởi động tất cả services
6. ✅ Đợi và kiểm tra health
7. ✅ Hiển thị URLs và hướng dẫn tiếp theo

#### Cách dùng:

**Linux/macOS/Git Bash:**

```bash
# Đảm bảo script có quyền execute
chmod +x scripts/setup.sh

# Chạy script
./scripts/setup.sh

# Hoặc
bash scripts/setup.sh
```

**Windows (Command Prompt):**

```cmd
scripts\setup.bat
```

**Windows (PowerShell):**

```powershell
.\scripts\setup.bat
```

#### Kết quả mong đợi:

```
🚀 Smart-Forecast Setup Script
================================

📋 Checking prerequisites...
✅ Docker is installed: Docker version 24.0.0
✅ Docker Compose is installed: Docker Compose version v2.20.0

⚙️  Setting up environment variables...
✅ .env file created from .env.example

📁 Creating directories...
✅ Directories created

🐳 Pulling Docker images...
✅ Docker images pulled

🚀 Starting Docker services...
✅ Docker services started

⏳ Waiting for services to be healthy...
   Health check: 4/4 services healthy
✅ All services are healthy!

🌐 Service URLs
===============
✅ Orion Context Broker: http://localhost:1026
✅ MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
✅ PostgreSQL: localhost:5432 (admin/admin)
✅ Backend API: http://localhost:8000

🎉 Setup Complete!
```

### health-check.sh

Script kiểm tra health của tất cả services.

#### Cách dùng:

```bash
chmod +x scripts/health-check.sh
./scripts/health-check.sh
```

#### Kiểm tra gì:

- ✅ Docker Compose đang chạy không
- ✅ Các HTTP endpoints (Orion, Backend, MinIO)
- ✅ Database connections (PostgreSQL, MongoDB)
- ✅ Container health status
- ✅ Open ports

#### Kết quả:

```
================================
Smart-Forecast Health Check
================================

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
Checking mongodb... ✅ running
Checking postgres... ✅ healthy
Checking minio... ✅ healthy

Checking Open Ports...
-----------------------------------
Port 1026 (Orion)... ✅ open
Port 5432 (PostgreSQL)... ✅ open
Port 9000 (MinIO API)... ✅ open
Port 9001 (MinIO Console)... ✅ open

================================
Summary
================================
Containers Running: 4
Containers Healthy: 4

🎉 All services are running and healthy!
```

---

## 🤔 Khi nào dùng gì?

### 🆕 Lần đầu clone project:

```bash
# Bước 1: Clone
git clone https://github.com/NEU-DataVerse/Smart-Forecast.git
cd Smart-Forecast

# Bước 2: Setup (chọn 1 trong 2)
# Linux/macOS:
./scripts/setup.sh

# Windows:
scripts\setup.bat

# Bước 3: Cài dependencies
make install
# hoặc: pnpm install

# Bước 4: Build shared package
make build-shared
# hoặc: pnpm run build:shared
```

### 💼 Làm việc hàng ngày:

```bash
# Sử dụng Makefile cho mọi tác vụ
make up              # Sáng: Start services
make dev-backend     # Chạy backend
make dev-web         # Chạy web
make logs            # Debug
make down            # Tối: Stop services
```

### 🏥 Kiểm tra health:

```bash
# Cách 1: Makefile (nhanh)
make health
make test

# Cách 2: Health check script (chi tiết)
./scripts/health-check.sh
```

### 🔧 Khi gặp vấn đề:

```bash
# Xem logs
make logs

# Xem logs service cụ thể
make logs-orion
make logs-postgres

# Restart
make restart

# Rebuild nếu có thay đổi Docker config
make rebuild

# Reset hoàn toàn (cẩn thận: xóa data!)
make clean
make setup
```

---

## 🛠️ Troubleshooting

### Lỗi: `make: command not found`

**Giải pháp:**

```bash
# Linux
sudo apt-get install build-essential

# macOS
xcode-select --install

# Windows: Dùng Git Bash hoặc cài Make
choco install make
```

### Lỗi: `permission denied: ./scripts/setup.sh`

**Giải pháp:**

```bash
chmod +x scripts/setup.sh
chmod +x scripts/health-check.sh
```

### Lỗi: `docker: command not found`

**Giải pháp:**

Cài đặt Docker Desktop:

- Windows/macOS: https://www.docker.com/products/docker-desktop
- Linux: https://docs.docker.com/engine/install/

### Services không healthy sau setup

**Giải pháp:**

```bash
# Chờ thêm 1-2 phút
./scripts/health-check.sh

# Xem logs để debug
make logs-orion
make logs-postgres

# Restart nếu cần
make restart

# Hoặc reset hoàn toàn
make clean
./scripts/setup.sh
```

### Port bị conflict (đã được dùng)

**Giải pháp:**

Sửa port trong `docker-compose.yml`:

```yaml
services:
  postgres:
    ports:
      - '5433:5432' # Đổi port bên trái
```

Sau đó:

```bash
make rebuild
```

### Windows: Scripts không chạy được

**Giải pháp:**

```bash
# Cách 1: Dùng Git Bash
# Cài Git for Windows từ https://git-scm.com/

# Cách 2: Dùng WSL
wsl --install

# Cách 3: Dùng .bat files
scripts\setup.bat
```

---

## 📚 Tài nguyên tham khảo

- **GNU Make Manual**: https://www.gnu.org/software/make/manual/
- **Bash Scripting Guide**: https://tldp.org/LDP/abs/html/
- **Docker Documentation**: https://docs.docker.com/
- **PNPM Workspaces**: https://pnpm.io/workspaces

---

## 💡 Tips & Tricks

### 1. Alias cho các lệnh thường dùng

Thêm vào `~/.bashrc` hoặc `~/.zshrc`:

```bash
alias sf-up='cd ~/Smart-Forecast && make up'
alias sf-down='cd ~/Smart-Forecast && make down'
alias sf-dev='cd ~/Smart-Forecast && make dev-backend'
alias sf-logs='cd ~/Smart-Forecast && make logs'
```

### 2. Chạy nhiều terminals cùng lúc

```bash
# Terminal 1
make up && make dev-backend

# Terminal 2 (tab mới)
make dev-web

# Terminal 3 (tab mới)
make dev-mobile

# Terminal 4 (tab mới)
make logs
```

### 3. VS Code Tasks

Thêm vào `.vscode/tasks.json`:

```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Start Backend",
      "type": "shell",
      "command": "make dev-backend",
      "group": "build"
    },
    {
      "label": "Start Web",
      "type": "shell",
      "command": "make dev-web",
      "group": "build"
    }
  ]
}
```

### 4. Git Hooks

Tự động test trước khi commit:

```bash
# .git/hooks/pre-commit
#!/bin/bash
make health
if [ $? -ne 0 ]; then
    echo "Health check failed. Fix services before committing."
    exit 1
fi
```

---

## 🎯 Tóm tắt

| Tình huống      | Công cụ         | Lệnh                        |
| --------------- | --------------- | --------------------------- |
| Setup lần đầu   | setup.sh/bat    | `./scripts/setup.sh`        |
| Start services  | Makefile        | `make up`                   |
| Development     | Makefile        | `make dev-backend`          |
| Kiểm tra health | health-check.sh | `./scripts/health-check.sh` |
| Debug           | Makefile        | `make logs`                 |
| Stop services   | Makefile        | `make down`                 |
| Reset project   | Makefile        | `make clean`                |

---

**Happy Automating! 🚀**

_Nếu có câu hỏi, tạo issue trên GitHub hoặc liên hệ team._
