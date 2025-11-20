@echo off
REM Smart-Forecast Setup Script for Windows
REM Automatically setup environment for development

echo ================================
echo Smart-Forecast Setup Script
echo ================================
echo.

REM Check if Docker is installed
echo Checking prerequisites...
docker --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not installed. Please install Docker Desktop first.
    echo Download from: https://www.docker.com/products/docker-desktop
    pause
    exit /b 1
)

docker-compose --version >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker Compose is not installed. Please install Docker Compose first.
    pause
    exit /b 1
)

echo [OK] Docker is installed
echo [OK] Docker Compose is installed
echo.

REM Setup environment files
echo Setting up environment variables...

REM Root .env for Docker Compose
if not exist ".env" (
    copy .env.example .env >nul
    echo [OK] .env created (for Docker Compose)
) else (
    echo [SKIP] .env already exists
)

REM Docker infrastructure (deprecated but kept for compatibility)
if not exist "docker\.env.infrastructure" (
    copy docker\.env.infrastructure.example docker\.env.infrastructure >nul
    echo [WARNING] docker\.env.infrastructure created (deprecated - use root .env)
) else (
    echo [SKIP] docker\.env.infrastructure already exists
)

REM Backend
if not exist "backend\.env" (
    copy backend\.env.example backend\.env >nul
    echo [OK] backend\.env created
) else (
    echo [SKIP] backend\.env already exists
)

REM Web
if not exist "web\.env.local" (
    copy web\.env.local.example web\.env.local >nul
    echo [OK] web\.env.local created
) else (
    echo [SKIP] web\.env.local already exists
)

REM Mobile
if not exist "mobile\.env" (
    copy mobile\.env.example mobile\.env >nul
    echo [OK] mobile\.env created
    echo [WARNING] Remember to update EXPO_PUBLIC_API_URL with your local IP address
) else (
    echo [SKIP] mobile\.env already exists
)
echo.

REM API Configuration notice
echo ================================
echo API Configuration
echo ================================
echo You need to configure the following:
echo   1. backend\.env - OPENWEATHER_API_KEY (Get from: https://openweathermap.org/api)
echo   2. backend\.env - JWT_SECRET (Change to a secure random string)
echo   3. mobile\.env - EXPO_PUBLIC_API_URL (Replace YOUR_LOCAL_IP with your machine's IP)
echo.
echo Press any key to continue...
pause >nul
echo.

REM Create necessary directories
echo Creating directories...
if not exist "backend\logs" mkdir backend\logs
if not exist "web\public\uploads" mkdir web\public\uploads
if not exist "mobile\assets\temp" mkdir mobile\assets\temp
echo [OK] Directories created
echo.

REM Pull Docker images
echo Pulling Docker images...
docker-compose pull
echo [OK] Docker images pulled
echo.

REM Start services
echo Starting Docker services...
docker-compose up -d
echo [OK] Docker services started
echo.

REM Wait for services
echo Waiting for services to start (30 seconds)...
timeout /t 30 /nobreak >nul
echo.

REM Display service status
echo ================================
echo Service Status
echo ================================
docker-compose ps
echo.

REM Display service URLs
echo ================================
echo Service URLs
echo ================================
echo [OK] Orion Context Broker: http://localhost:1026
echo [OK] MinIO Console: http://localhost:9001 (minioadmin/minioadmin)
echo [OK] PostgreSQL: localhost:5432 (admin/admin)
echo [OK] Backend API: http://localhost:8000
echo.

REM Test Orion endpoint
echo Testing Orion Context Broker...
curl -s http://localhost:1026/version >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Orion may not be ready yet. Wait a moment and try:
    echo curl http://localhost:1026/version
) else (
    echo [OK] Orion is responding!
)
echo.

REM Final instructions
echo ================================
echo Setup Complete!
echo ================================
echo.
echo Next steps:
echo   1. Configure API keys in .env file
echo   2. Restart services: docker-compose restart
echo   3. View logs: docker-compose logs -f
echo   4. Stop services: docker-compose down
echo.
echo For development:
echo   - Backend: pnpm --filter backend run start:dev
echo   - Web: pnpm --filter web run dev
echo   - Mobile: pnpm --filter mobile run start
echo.
echo Happy coding!
echo.
pause
