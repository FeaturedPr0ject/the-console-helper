using System.Buffers.Binary;
using System.Diagnostics;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

internal static class Program
{
    private const int MaxRequestBytes = 1_048_576;
    private const int MaxOutputChars = 32_000;
    private static readonly TimeSpan CommandTimeout = TimeSpan.FromSeconds(15);
    private static string _currentDirectory = Environment.GetFolderPath(Environment.SpecialFolder.UserProfile);

    private static async Task Main(string[] args)
    {
        if (args.Length == 0 || !args[0].StartsWith("chrome-extension://", StringComparison.OrdinalIgnoreCase))
            return;

        using var input = Console.OpenStandardInput();
        using var output = Console.OpenStandardOutput();

        while (true)
        {
            byte[]? header;
            try
            {
                header = await ReadExactlyOrNullAsync(input, 4);
                if (header is null)
                    return;

                var length = BinaryPrimitives.ReadInt32LittleEndian(header);
                if (length <= 0 || length > MaxRequestBytes)
                {
                    await WriteMessageAsync(output, new
                    {
                        requestId = "",
                        ok = false,
                        error = "Request size is invalid or exceeds the 1 MiB limit.",
                        cwd = _currentDirectory
                    });
                    return;
                }

                var payload = await ReadExactlyOrNullAsync(input, length);
                if (payload is null)
                    return;

                object response;
                try
                {
                    using var document = JsonDocument.Parse(payload);
                    response = await HandleRequestAsync(document.RootElement);
                }
                catch (Exception exception)
                {
                    response = new
                    {
                        requestId = GetRequestIdFromBytes(payload),
                        ok = false,
                        error = "Request failed: " + exception.Message,
                        cwd = _currentDirectory
                    };
                }

                await WriteMessageAsync(output, response);
            }
            catch (EndOfStreamException)
            {
                return;
            }
            catch (IOException)
            {
                return;
            }
        }
    }

    private static async Task<object> HandleRequestAsync(JsonElement root)
    {
        var requestId = ReadPropertyString(root, "requestId") ?? "";
        var type = ReadPropertyString(root, "type") ?? "";

        if (type == "ping")
        {
            return new
            {
                requestId,
                ok = true,
                type = "pong",
                version = "1.0.0",
                cwd = _currentDirectory,
                user = Environment.UserName,
                shell = Environment.GetEnvironmentVariable("ComSpec") ?? "cmd.exe"
            };
        }

        if (type != "run")
        {
            return new
            {
                requestId,
                ok = false,
                error = "Unsupported request type.",
                cwd = _currentDirectory
            };
        }

        var command = ReadPropertyString(root, "command") ?? "";
        if (string.IsNullOrWhiteSpace(command))
        {
            return new
            {
                requestId,
                ok = false,
                error = "Enter a command first.",
                stdout = "",
                stderr = "",
                exitCode = 1,
                timedOut = false,
                truncated = false,
                cwd = _currentDirectory
            };
        }

        if (command.Length > 8192)
        {
            return new
            {
                requestId,
                ok = false,
                error = "Command exceeds the 8 KiB limit.",
                cwd = _currentDirectory
            };
        }

        var cdResult = TryChangeDirectory(command);
        if (cdResult is not null)
        {
            var result = cdResult.Value;
            return new
            {
                requestId,
                ok = result.Ok,
                stdout = result.Stdout,
                stderr = result.Stderr,
                exitCode = result.Ok ? 0 : 1,
                timedOut = false,
                truncated = false,
                cwd = _currentDirectory,
                error = result.Ok ? null : result.Stderr
            };
        }

        return await RunCommandAsync(requestId, command);
    }

    private static (bool Ok, string Stdout, string Stderr)? TryChangeDirectory(string command)
    {
        var match = Regex.Match(command, @"^\s*cd(?:\s+/d)?(?:\s+(.*?))?\s*$", RegexOptions.IgnoreCase);
        if (!match.Success)
            return null;

        var requested = match.Groups[1].Success ? match.Groups[1].Value.Trim() : "";
        if (requested.Length == 0)
            return (true, _currentDirectory + Environment.NewLine, "");

        if (requested.Length >= 2 && requested[0] == '"' && requested[^1] == '"')
            requested = requested[1..^1];

        requested = Environment.ExpandEnvironmentVariables(requested);
        try
        {
            var fullPath = Path.IsPathRooted(requested)
                ? Path.GetFullPath(requested)
                : Path.GetFullPath(requested, _currentDirectory);

            if (!Directory.Exists(fullPath))
                return (false, "", "The system cannot find the path specified: " + fullPath);

            _currentDirectory = fullPath;
            return (true, _currentDirectory + Environment.NewLine, "");
        }
        catch (Exception exception)
        {
            return (false, "", exception.Message);
        }
    }

    private static async Task<object> RunCommandAsync(string requestId, string command)
    {
        using var process = new Process();
        var startInfo = new ProcessStartInfo
        {
            FileName = Environment.GetEnvironmentVariable("ComSpec") ?? "cmd.exe",
            Arguments = "/d /s /c chcp 65001>nul & " + command,
            WorkingDirectory = Directory.Exists(_currentDirectory) ? _currentDirectory : Environment.GetFolderPath(Environment.SpecialFolder.UserProfile),
            UseShellExecute = false,
            RedirectStandardOutput = true,
            RedirectStandardError = true,
            CreateNoWindow = true,
            StandardOutputEncoding = new UTF8Encoding(false),
            StandardErrorEncoding = new UTF8Encoding(false)
        };

        try
        {
            process.StartInfo = startInfo;
            if (!process.Start())
                throw new InvalidOperationException("cmd.exe did not start.");
        }
        catch (Exception exception)
        {
            return new
            {
                requestId,
                ok = false,
                error = "Could not start cmd.exe: " + exception.Message,
                stdout = "",
                stderr = "",
                exitCode = -1,
                timedOut = false,
                truncated = false,
                cwd = _currentDirectory
            };
        }

        var stdoutTask = ReadLimitedAsync(process.StandardOutput, MaxOutputChars);
        var stderrTask = ReadLimitedAsync(process.StandardError, MaxOutputChars);
        var timedOut = false;

        try
        {
            using var timeout = new CancellationTokenSource(CommandTimeout);
            await process.WaitForExitAsync(timeout.Token);
        }
        catch (OperationCanceledException)
        {
            timedOut = true;
            try
            {
                if (!process.HasExited)
                    process.Kill(true);
            }
            catch
            {
            }
            try
            {
                await process.WaitForExitAsync();
            }
            catch
            {
            }
        }
        catch (InvalidOperationException)
        {
        }

        var stdout = await stdoutTask;
        var stderr = await stderrTask;
        var combinedTruncated = stdout.Truncated || stderr.Truncated;
        var exitCode = timedOut ? -1 : SafeExitCode(process);

        return new
        {
            requestId,
            ok = !timedOut && exitCode == 0,
            stdout = stdout.Text,
            stderr = stderr.Text,
            exitCode,
            timedOut,
            truncated = combinedTruncated,
            cwd = _currentDirectory,
            error = timedOut ? "Command exceeded the 15 second execution limit and was stopped." : null
        };
    }

    private static int SafeExitCode(Process process)
    {
        try { return process.ExitCode; }
        catch { return -1; }
    }

    private static async Task<(string Text, bool Truncated)> ReadLimitedAsync(StreamReader reader, int maxChars)
    {
        var builder = new StringBuilder();
        var buffer = new char[2048];
        var truncated = false;

        while (true)
        {
            var read = await reader.ReadAsync(buffer.AsMemory(0, buffer.Length));
            if (read <= 0)
                break;

            var remaining = maxChars - builder.Length;
            if (remaining > 0)
                builder.Append(buffer, 0, Math.Min(remaining, read));
            if (read > remaining)
                truncated = true;
        }

        return (builder.ToString(), truncated);
    }

    private static string? ReadPropertyString(JsonElement root, string name)
    {
        if (!root.TryGetProperty(name, out var value))
            return null;

        return value.ValueKind switch
        {
            JsonValueKind.String => value.GetString(),
            JsonValueKind.Number => value.ToString(),
            _ => null
        };
    }

    private static string GetRequestIdFromBytes(byte[] payload)
    {
        try
        {
            using var document = JsonDocument.Parse(payload);
            return ReadPropertyString(document.RootElement, "requestId") ?? "";
        }
        catch
        {
            return "";
        }
    }

    private static async Task<byte[]?> ReadExactlyOrNullAsync(Stream stream, int count)
    {
        var buffer = new byte[count];
        var offset = 0;
        while (offset < count)
        {
            var read = await stream.ReadAsync(buffer.AsMemory(offset, count - offset));
            if (read == 0)
            {
                if (offset == 0)
                    return null;
                throw new EndOfStreamException("Unexpected end of native message.");
            }
            offset += read;
        }
        return buffer;
    }

    private static async Task WriteMessageAsync(Stream output, object response)
    {
        var payload = JsonSerializer.SerializeToUtf8Bytes(response);
        if (payload.Length > 1_048_576)
        {
            payload = JsonSerializer.SerializeToUtf8Bytes(new
            {
                requestId = "",
                ok = false,
                error = "Response exceeded the 1 MiB limit.",
                cwd = _currentDirectory
            });
        }

        var header = new byte[4];
        BinaryPrimitives.WriteInt32LittleEndian(header, payload.Length);
        await output.WriteAsync(header);
        await output.WriteAsync(payload);
        await output.FlushAsync();
    }
}