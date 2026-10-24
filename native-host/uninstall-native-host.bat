@echo off
setlocal
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0uninstall-native-host.ps1"
if errorlevel 1 (
  echo Uninstall failed.
  pause
  exit /b 1
)
echo Native host registration removed.
pause
