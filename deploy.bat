@echo off
REM Hospital Attendance System Deployment Script for Windows

echo 🏥 Hospital Attendance System Deployment
echo ========================================

REM Check if Docker is installed
docker --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
docker-compose --version >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

if "%1"=="dev" goto deploy_dev
if "%1"=="prod" goto deploy_prod
if "%1"=="logs" goto show_logs
if "%1"=="stop" goto stop_services
if "%1"=="seed" goto seed_database
if "%1"=="status" goto show_status
goto show_usage

:deploy_dev
echo 🚀 Deploying Development Environment...
docker-compose down
docker-compose up -d --build
echo ✅ Development environment deployed!
echo 📊 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:3000
echo 🗄️  MongoDB: localhost:27017
goto end

:deploy_prod
echo 🚀 Deploying Production Environment...
if not exist .env.production (
    echo ❌ .env.production file not found!
    echo Please create .env.production from .env.example
    exit /b 1
)
docker-compose -f docker-compose.prod.yml down
docker-compose -f docker-compose.prod.yml up -d --build
echo ✅ Production environment deployed!
echo 📊 Backend: http://localhost:5000
echo 🎨 Frontend: http://localhost:80
goto end

:show_logs
echo 📋 Showing application logs...
docker-compose logs -f
goto end

:stop_services
echo 🛑 Stopping services...
docker-compose down
docker-compose -f docker-compose.prod.yml down
echo ✅ Services stopped!
goto end

:seed_database
echo 🌱 Seeding database...
docker-compose exec backend npm run seed
echo ✅ Database seeded with demo data!
goto end

:show_status
echo 📊 Service Status:
docker-compose ps
goto end

:show_usage
echo Usage: %0 {dev^|prod^|logs^|stop^|seed^|status}
echo.
echo Commands:
echo   dev     - Deploy development environment
echo   prod    - Deploy production environment
echo   logs    - Show application logs
echo   stop    - Stop all services
echo   seed    - Seed database with demo data
echo   status  - Show service status
echo.
echo Examples:
echo   %0 dev     # Start development environment
echo   %0 prod    # Start production environment
echo   %0 logs    # View logs
echo   %0 stop    # Stop all services
exit /b 1

:end