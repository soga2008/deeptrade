@echo off
echo ========================================
echo Building AI Trading Application Installer
echo ========================================
echo.

echo Step 1: Building frontend...
cd frontend
call npm run build
if errorlevel 1 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Building Windows installer...
call npm run electron:build:win
if errorlevel 1 (
    echo Installer build failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Installer location: frontend\dist-electron\
echo.
echo Files created:
echo   - AI Trading Application Setup.exe (Installer)
echo   - win-unpacked\ (Portable version)
echo.
pause

