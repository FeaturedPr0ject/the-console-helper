@echo off
setlocal
cd /d "%~dp0"
dotnet publish src\ServerTrace\ServerTrace.csproj -c Release -r win-x64 --self-contained true -p:PublishSingleFile=true -p:IncludeNativeLibrariesForSelfExtract=true -p:DebugType=None -p:DebugSymbols=false -o publish
if errorlevel 1 (
  echo.
  echo Build failed. Install the .NET 8 SDK and try again.
  pause
  exit /b 1
)
echo.
echo EXE created at: %CD%\publish\ServerTrace.exe
pause
