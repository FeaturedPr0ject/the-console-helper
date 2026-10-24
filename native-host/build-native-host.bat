@echo off
setlocal
cd /d "%~dp0"
dotnet publish ServerTrace.NativeHost.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:DebugType=None -p:DebugSymbols=false -o publish
if errorlevel 1 (
  echo.
  echo Build failed. Install the .NET 8 SDK and try again.
  pause
  exit /b 1
)
copy /Y "publish\ServerTrace.NativeHost.exe" "ServerTrace.NativeHost.exe" >nul
if errorlevel 1 (
  echo Could not copy the built native host.
  pause
  exit /b 1
)
echo.
echo Built: %CD%\ServerTrace.NativeHost.exe
echo Next: run install-native-host.bat
pause
