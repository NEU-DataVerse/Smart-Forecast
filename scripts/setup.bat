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

REM Check if .env file exists
echo Setting up environment variables...
if exist .env (
    echo [WARNING] .env file already exists.
    set /p "overwrite=Do you want to overwrite it? (y/N): "
    if /i "%overwrite%"=="y" (
        copy /Y .env.example .env >nul
        echo [OK] .env file created from .env.example
    ) else (
        echo [SKIP] Keeping existing .env file
    )
) else (
    copy .env.example .env >nul
    echo [OK] .env file created from .env.example
)
echo.

REM API Configuration notice
echo ================================
echo API Configuration
echo ================================
echo You need to configure the following API keys in .env file:
echo   1. OPENAQ_API_KEY - Get from: https://openaq.org/
echo   2. OWM_API_KEY - Get from: https://openweathermap.org/api
echo   3. NEXT_PUBLIC_MAPBOX_TOKEN - Get from: https://www.mapbox.com/
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
echo [OK] Cygnus: http://localhost:5080
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
echo   - Backend: cd backend ^&^& npm install ^&^& npm run start:dev
echo   - Web: cd web ^&^& npm install ^&^& npm run dev
echo   - Mobile: cd mobile ^&^& npm install ^&^& npx expo start
echo.
echo Happy coding!
echo.
pause
