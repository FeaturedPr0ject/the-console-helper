$ErrorActionPreference = "Stop"
$registryKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.coneui.server_trace_cmd"
if (Test-Path $registryKey) {
    Remove-Item -LiteralPath $registryKey -Recurse -Force
}
$root = Join-Path $env:LOCALAPPDATA "ServerTrace\NativeHost"
if (Test-Path $root) {
    Remove-Item -LiteralPath $root -Recurse -Force
}
Write-Output "Server Trace native host uninstalled."
