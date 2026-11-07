@echo off
title Avarice Client builder
setlocal
cd /d "%~dp0"

echo.
echo  === Avarice Client builder ===
echo.

rem ---- Git ----
where git >nul 2>nul || (
    echo Installing Git...
    winget install --id Git.Git -e --silent --accept-package-agreements --accept-source-agreements
)
if exist "%ProgramFiles%\Git\cmd\git.exe" set "PATH=%ProgramFiles%\Git\cmd;%PATH%"
where git >nul 2>nul || (echo [X] Git is missing. Install it from https://git-scm.com then run this again. & pause & exit /b 1)

rem ---- Node.js ----
where node >nul 2>nul || (
    echo Installing Node.js LTS...
    winget install --id OpenJS.NodeJS.LTS -e --silent --accept-package-agreements --accept-source-agreements
)
if exist "%ProgramFiles%\nodejs\node.exe" set "PATH=%ProgramFiles%\nodejs;%APPDATA%\npm;%PATH%"
where node >nul 2>nul || (echo [X] Node.js is missing. Install the LTS from https://nodejs.org then run this again. & pause & exit /b 1)

rem ---- pnpm ----
set "PATH=%APPDATA%\npm;%PATH%"
where pnpm >nul 2>nul || (
    echo Installing pnpm...
    call npm install --global pnpm || (echo [X] Could not install pnpm. & pause & exit /b 1)
)

rem ---- Vesktop source ----
if not exist "..\Vesktop" (
    echo Downloading Vesktop...
    git clone https://github.com/Vencord/Vesktop "..\Vesktop" || (echo [X] Download failed. & pause & exit /b 1)
) else (
    echo Updating Vesktop...
    pushd "..\Vesktop"
    git checkout -- .
    git pull
    popd
)

pushd "..\Vesktop"

echo.
echo Rebranding to Avarice Client...
if "%~1"=="" (
    call node "%~dp0rebrand.mjs" || goto :fail
) else (
    call node "%~dp0rebrand.mjs" "%~1" || goto :fail
)

echo.
echo Installing dependencies (first time takes a few minutes)...
rem append-only + debug log = every package scrolls past as it is resolved, fetched and linked
call pnpm i --reporter=append-only --loglevel=debug || goto :fail

echo.
echo Closing any running Avarice Client so its files can be replaced...
taskkill /im "Avarice Client.exe" /f >nul 2>nul & taskkill /im avarice-client.exe /f >nul 2>nul
timeout /t 2 /nobreak >nul
if exist "dist\win-unpacked" rmdir /s /q "dist\win-unpacked"
del /q "dist\*Setup*.exe" "dist\*Setup*.blockmap" "dist\*.nsis.7z" >nul 2>nul
set "OUT=dist"
if exist "dist\win-unpacked\resources\app.asar" (
    echo Old build is locked by another program - building into a fresh folder instead.
    set "OUT=dist-%RANDOM%"
)
echo %OUT%> "%~dp0last-build-folder.txt"

echo.
echo Building the installer (Windows x64)...
call pnpm build || goto :fail
rem verbose packaging: prints every step and file electron-builder handles
set "DEBUG=electron-builder"
set "TARGETS=nsis zip"
set "EXTRA="
rem quick mode: installer only, no compression (much faster, bigger file)
if defined AVARICE_QUICK set "TARGETS=nsis"
if defined AVARICE_QUICK set "EXTRA=-c.compression=store"
if defined AVARICE_TEST set "TARGETS=dir"
call pnpm exec electron-builder --win %TARGETS% --x64 --publish never %EXTRA% -c.directories.output=%OUT% && goto :built
rem Windows Defender sometimes locks the fresh exe for a few seconds - wait and retry once
echo.
echo Build hit a locked file, retrying in 10 seconds...
taskkill /im "Avarice Client.exe" /f >nul 2>nul & taskkill /im avarice-client.exe /f >nul 2>nul
timeout /t 10 /nobreak >nul
if exist "dist\win-unpacked" rmdir /s /q "dist\win-unpacked"
del /q "dist\*Setup*.exe" "dist\*Setup*.blockmap" "dist\*.nsis.7z" >nul 2>nul
call pnpm exec electron-builder --win %TARGETS% --x64 --publish never %EXTRA% -c.directories.output=%OUT% || goto :fail
:built

popd
echo.
echo  === Done! ===
echo  Your installer is in: %~dp0..\Vesktop\%OUT%
if defined AVARICE_NOPAUSE exit /b 0
explorer "%~dp0..\Vesktop\%OUT%"
pause
exit /b 0

:fail
popd
echo.
echo [X] Something failed. Scroll up to see the error.
if not defined AVARICE_NOPAUSE pause
exit /b 1
