@echo off
REM Hospital Attendance System - Vercel Deployment Script (Windows)
REM This script helps deploy the application to Vercel

echo ========================================
echo Hospital Attendance System
echo Vercel Deployment Script
echo ========================================
echo.

REM Check if Vercel CLI is installed
where vercel >nul 2>nul
if %ERRORLEVEL% NEQ 0 (
    echo Vercel CLI is not installed
    echo Installing Vercel CLI...
    call npm install -g vercel
    echo Vercel CLI installed successfully
)

echo.
echo Choose deployment option:
echo 1. Deploy Frontend only
echo 2. Deploy Backend only
echo 3. Deploy Both (Frontend + Backend)
echo.
set /p choice="Enter your choice (1-3): "

if "%choice%"=="1" (
    echo.
    echo Deploying Frontend to Vercel...
    cd frontend
    call vercel --prod
    cd ..
    echo Frontend deployment complete!
) else if "%choice%"=="2" (
    echo.
    echo Deploying Backend to Vercel...
    cd Backend
    call vercel --prod
    cd ..
    echo Backend deployment complete!
    echo.
    echo IMPORTANT: Update frontend REACT_APP_API_URL with new backend URL
) else if "%choice%"=="3" (
    echo.
    echo Deploying Backend to Vercel...
    cd Backend
    call vercel --prod
    cd ..
    
    echo.
    echo Deploying Frontend to Vercel...
    cd frontend
    call vercel --prod
    cd ..
    
    echo.
    echo Both deployments complete!
    echo.
    echo Next Steps:
    echo 1. Update frontend environment variable REACT_APP_API_URL
    echo 2. Redeploy frontend with updated backend URL
    echo 3. Test the application
) else (
    echo Invalid choice. Exiting...
    exit /b 1
)

echo.
echo ========================================
echo Deployment process completed!
echo ========================================
echo.
echo Post-Deployment Checklist:
echo   - Visit your Vercel dashboard
echo   - Check deployment logs
echo   - Test with demo credentials
echo   - Verify API connectivity
echo.
echo Demo Credentials:
echo   Admin: admin@hospital.com / admin123
echo   Staff: sarah@hospital.com / staff123
echo.
pause
