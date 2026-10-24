param(
    [Parameter(Mandatory = $true)]
    [string]$ExtensionId
)

$ErrorActionPreference = "Stop"

if ($ExtensionId -notmatch '^[a-p]{32}$') {
    Write-Error "The extension ID must be exactly 32 characters from a to p."
    exit 2
}

$sourceExe = Join-Path $PSScriptRoot "ServerTrace.NativeHost.exe"
if (-not (Test-Path -LiteralPath $sourceExe -PathType Leaf)) {
    Write-Error "ServerTrace.NativeHost.exe was not found beside this installer."
    exit 3
}

$root = Join-Path $env:LOCALAPPDATA "ServerTrace\NativeHost"
New-Item -ItemType Directory -Path $root -Force | Out-Null
$installedExe = Join-Path $root "ServerTrace.NativeHost.exe"
$manifestPath = Join-Path $root "com.coneui.server_trace_cmd.json"

Copy-Item -LiteralPath $sourceExe -Destination $installedExe -Force

$hostManifest = [ordered]@{
    name = "com.coneui.server_trace_cmd"
    description = "Server Trace Windows CMD Native Messaging Host"
    path = $installedExe
    type = "stdio"
    allowed_origins = @("chrome-extension://$ExtensionId/")
}

$json = $hostManifest | ConvertTo-Json -Depth 4
[System.IO.File]::WriteAllText($manifestPath, $json, [System.Text.UTF8Encoding]::new($false))

$registryKey = "HKCU:\Software\Google\Chrome\NativeMessagingHosts\com.coneui.server_trace_cmd"
New-Item -Path $registryKey -Force | Out-Null
Set-Item -Path $registryKey -Value $manifestPath

Write-Output "Native Messaging Host installed."
Write-Output "Executable: $installedExe"
Write-Output "Manifest: $manifestPath"
Write-Output "Allowed extension: chrome-extension://$ExtensionId/"
