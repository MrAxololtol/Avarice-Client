@echo off
title Avarice Client - rebuild and test setup screen
setlocal
cd /d "%~dp0"

echo Closing Avarice Client if it's running...
taskkill /im "Avarice Client.exe" /f >nul 2>nul & taskkill /im avarice-client.exe /f >nul 2>nul
timeout /t 2 /nobreak >nul

echo Rebuilding (test build, no installer)...
set AVARICE_NOPAUSE=1
set AVARICE_TEST=1
call "%~dp0build.bat" || (echo [X] Build failed, see above. & pause & exit /b 1)

rem The unpacked build is "portable": it keeps its own data in win-unpacked\Data,
rem so wiping that only resets this test copy. Your installed app stays logged in.
set "OUT=dist"
if exist "%~dp0last-build-folder.txt" set /p OUT=<"%~dp0last-build-folder.txt"
set "TEST=%~dp0..\Vesktop\%OUT%\win-unpacked"
if exist "%TEST%\Data" rmdir /s /q "%TEST%\Data"

echo Launching fresh test copy (setup screen will show)...
start "" "%TEST%\Avarice Client.exe"
exit /b 0
