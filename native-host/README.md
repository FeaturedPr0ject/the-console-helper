# Server Trace CMD Native Host

This companion executable lets the Chrome extension run commands using Windows \`cmd.exe\` through Chrome Native Messaging.

## Build

Run \`build-native-host.bat\` with the .NET 8 SDK installed, or download the \`ServerTrace-NativeHost-win-x64\` artifact from GitHub Actions and place \`ServerTrace.NativeHost.exe\` beside the installer scripts in this folder.

## Install

1. Open \`chrome://extensions\` and copy the extension ID from Server Trace.
2. Run \`install-native-host.bat\` and paste that ID.
3. Reload Server Trace, open **CONSOLE → COMMANDS**, and click **CONNECT CMD.EXE**.
4. Tick the confirmation checkbox before executing commands.

The native host manifest is registered under the current Windows user in \`HKCU\`. The extension ID is written to \`allowed_origins\`, so other extension IDs cannot connect through this registration.

## Safety and behavior

- Commands are run by \`cmd.exe /d /s /c\` as the signed-in Windows user.
- The native host does not forward commands automatically from the website or page JavaScript. Commands come from the extension's Commands input when the user clicks Run or presses Enter.
- Each command has a 15-second limit; the host kills the command process tree when the limit is exceeded.
- Each output stream is limited to 32,000 characters.
- The working directory persists while the native host connection stays open. The host handles \`cd\` and \`cd /d\` to update that directory; other shell session state does not persist between commands.
- \`uninstall-native-host.bat\` removes the registry entry and installed host files.

Do not run commands you do not understand. CMD commands can delete files, change system settings, install software, or perform other actions with your Windows account privileges.
