@echo off
title Avarice Client - quick build
rem Same as build.bat, but: installer only (no portable zip) and no compression.
rem Builds in about half the time; the installer is bigger (~250 MB instead of ~120 MB).
set AVARICE_QUICK=1
call "%~dp0build.bat" %*
