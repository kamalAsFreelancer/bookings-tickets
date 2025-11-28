@echo off
REM Cinema Booking System - Quick Diagnostics
REM Run this to verify your setup

color 0A
cls
echo.
echo ====================================
echo Cinema Booking System - Diagnostics
echo ====================================
echo.

REM Check if XAMPP is accessible
echo Checking XAMPP...
powershell -Command "try { $r = Invoke-WebRequest -Uri 'http://127.0.0.1/project/backend/health-check.php' -UseBasicParsing -TimeoutSec 5; if ($r.StatusCode -eq 200) { Write-Host '[OK] Backend is running'; exit 0 } else { Write-Host '[FAIL] Backend returned' $r.StatusCode; exit 1 } } catch { Write-Host '[FAIL] Cannot reach backend: ' $_.Exception.Message; exit 1 }" 
if %ERRORLEVEL% EQU 0 (
    echo Status: Backend PASS
) else (
    echo Status: Backend FAIL - Start XAMPP and try again
    goto end
)

REM Check if Node is installed
echo.
echo Checking Node.js...
node --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('node --version') do set NODE_VER=%%i
    echo Status: Node !NODE_VER! PASS
) else (
    echo Status: Node.js NOT FOUND - Install Node.js
    goto end
)

REM Check if npm is installed
echo.
echo Checking npm...
npm --version >nul 2>&1
if %ERRORLEVEL% EQU 0 (
    for /f "tokens=*" %%i in ('npm --version') do set NPM_VER=%%i
    echo Status: npm !NPM_VER! PASS
) else (
    echo Status: npm NOT FOUND
    goto end
)

REM Check if dependencies are installed
echo.
echo Checking dependencies...
if exist "node_modules" (
    echo Status: node_modules PASS
) else (
    echo Status: node_modules NOT FOUND
    echo Running: npm install
    call npm install
)

REM Summary
echo.
echo ====================================
echo Diagnostic Summary
echo ====================================
echo [OK] Backend API is working
echo [OK] Node.js is installed
echo [OK] npm is installed  
echo [OK] Dependencies are installed
echo.
echo Ready to start development server!
echo.
echo To start: npm run dev
echo Then open: http://127.0.0.1:5173
echo.

:end
pause
