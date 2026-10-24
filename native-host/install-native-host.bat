@echo off
setlocal
cd /d "%~dp0"
if not exist "%~dp0ServerTrace.NativeHost.exe" (
  echo ServerTrace.NativeHost.exe is missing.
  echo Download it from the GitHub Actions artifact or run build-native-host.bat.
  pause
  exit /b 1
)
echo.
echo Open chrome://extensions and copy the ID of Server Trace.
echo The ID should contain 32 characters from a to p.
set /p EXTENSION_ID=Extension ID: 
powershell.exe -NoProfile -ExecutionPolicy Bypass -File "%~dp0install-native-host.ps1" -ExtensionId "%EXTENSION_ID%"
if errorlevel 1 (
  echo.
  echo Installation failed. Check the extension ID and try again.
  pause
  exit /b 1
)
echo.
echo Native host installed. Reload Server Trace in chrome://extensions.
pause
