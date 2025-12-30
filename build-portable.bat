@echo off
echo ========================================
echo Building AI Trading Application (Portable)
echo ========================================
echo.

cd frontend

echo Step 1: Building frontend...
call npm run build
if errorlevel 1 (
    echo Frontend build failed!
    pause
    exit /b 1
)

echo.
echo Step 2: Packaging as portable app...
call npm run electron:package:win
if errorlevel 1 (
    echo Packaging failed!
    pause
    exit /b 1
)

echo.
echo ========================================
echo Build Complete!
echo ========================================
echo.
echo Portable app location: frontend\dist\AI Trading Application-win32-x64\
echo.
echo To distribute:
echo   1. Zip the "AI Trading Application-win32-x64" folder
echo   2. Share the zip file
echo   3. Users extract and run "AI Trading Application.exe"
echo.
pause

