using System.Collections.Concurrent;
using System.Diagnostics;
using System.Net;
using System.Net.Http;
using System.Text;
using System.Text.Json;
using System.Text.RegularExpressions;

namespace ServerTrace;

internal sealed class MainForm : Form
{
    private static readonly Color Bg = Color.FromArgb(20, 23, 28);
    private static readonly Color PanelBg = Color.FromArgb(29, 33, 40);
    private static readonly Color FieldBg = Color.FromArgb(37, 42, 50);
    private static readonly Color Border = Color.FromArgb(62, 68, 78);
    private static readonly Color TextColor = Color.FromArgb(230, 233, 239);
    private static readonly Color Muted = Color.FromArgb(156, 164, 176);
    private static readonly Color Accent = Color.FromArgb(184, 205, 229);

    private static readonly Regex ScriptSourceRegex = new(
        @"<script\b[^>]*?\bsrc\s*=\s*['""]([^'""]+)['""]",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly Regex AbsoluteUrlRegex = new(
        @"https?://[a-zA-Z0-9._-]+(?::\d{1,5})?(?:/[a-zA-Z0-9._~!$&'()*+,;=:@%/?#-]*)?",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly Regex ApiPathRegex = new(
        @"(?<![A-Za-z0-9])/(?:api|graphql|oauth|auth|v\d+|rest|rpc|accounts|users)(?:/[A-Za-z0-9._~!$&'()*+,;=:@%/-]*)?",
        RegexOptions.IgnoreCase | RegexOptions.Compiled);

    private static readonly (string Name, Regex Pattern)[] SecretPatterns =
    [
        ("Provider/API key pattern", new Regex(@"\b(?:sk_live|sk_test|ghp|github_pat|glpat|xox[baprs]|AKIA|AIza)[-_A-Za-z0-9]{12,}\b", RegexOptions.Compiled)),
        ("JWT-like token pattern", new Regex(@"\beyJ[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\.[A-Za-z0-9_-]{10,}\b", RegexOptions.Compiled)),
        ("Credential assignment pattern", new Regex(@"(?:access[_-]?token|refresh[_-]?token|api[_-]?key|client[_-]?secret|private[_-]?key|session[_-]?token|authorization|bearer)\s*[""'\s:=]+\s*[""']?[A-Za-z0-9._~+/=-]{12,}", RegexOptions.IgnoreCase | RegexOptions.Compiled)),
        ("Private key marker", new Regex(@"-----BEGIN (?:RSA |EC |OPENSSH )?PRIVATE KEY-----", RegexOptions.Compiled))
    ];

    private readonly HttpClient _http;
    private readonly TextBox _siteUrl = new();
    private readonly Button _scanButton = new();
    private readonly Button _cancelButton = new();
    private readonly Button _exportButton = new();
    private readonly Label _status = new();
    private readonly Label _summary = new();
    private readonly DataGridView _endpointGrid = new();
    private readonly DataGridView _findingGrid = new();
    private readonly RichTextBox _activity = new();
    private readonly TabControl _tabs = new();
    private CancellationTokenSource? _scanCts;
    private readonly Dictionary<string, EndpointItem> _endpoints = new(StringComparer.OrdinalIgnoreCase);
    private readonly Dictionary<string, FindingItem> _findings = new(StringComparer.OrdinalIgnoreCase);
    private DateTimeOffset? _lastScan;
    private string _scannedUrl = "";
    private int _scannedScripts;

    public MainForm()
    {
        Text = "Server Trace";
        StartPosition = FormStartPosition.CenterScreen;
        MinimumSize = new Size(850, 600);
        Size = new Size(1150, 760);
        BackColor = Bg;
        ForeColor = TextColor;
        Font = new Font("Segoe UI", 9F);
        FormBorderStyle = FormBorderStyle.Sizable;
        MaximizeBox = true;

        _http = new HttpClient(new HttpClientHandler
        {
            AllowAutoRedirect = true,
            UseCookies = false,
            AutomaticDecompression = DecompressionMethods.GZip | DecompressionMethods.Deflate | DecompressionMethods.Brotli
        })
        {
            Timeout = TimeSpan.FromSeconds(20)
        };
        _http.DefaultRequestHeaders.UserAgent.ParseAdd("ServerTrace-LocalAudit/1.0");

        BuildUi();
        FormClosed += (_, _) =>
        {
            _scanCts?.Cancel();
            _scanCts?.Dispose();
            _http.Dispose();
        };
        Log("Ready. Enter a website URL you are authorized to inspect.");
    }

    private void BuildUi()
    {
        var header = new Panel
        {
            Dock = DockStyle.Top,
            Height = 132,
            BackColor = PanelBg,
            Padding = new Padding(18, 12, 18, 12)
        };
        var title = new Label
        {
            Text = "SERVER TRACE",
            Font = new Font("Segoe UI Semibold", 17F, FontStyle.Bold),
            ForeColor = TextColor,
            AutoSize = true,
            Location = new Point(16, 11)
        };
        var subtitle = new Label
        {
            Text = "Standalone endpoint discovery and safe exposure audit",
            ForeColor = Muted,
            AutoSize = true,
            Location = new Point(18, 42)
        };
        _siteUrl.Text = "https://scratch.mit.edu/";
        _siteUrl.Location = new Point(18, 78);
        _siteUrl.Width = 600;
        _siteUrl.Anchor = AnchorStyles.Left | AnchorStyles.Right | AnchorStyles.Top;
        StyleTextBox(_siteUrl);
        _scanButton.Text = "SCAN SITE";
        _scanButton.Location = new Point(626, 76);
        _scanButton.Size = new Size(104, 30);
        _scanButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
        StyleButton(_scanButton, true);
        _scanButton.Click += async (_, _) => await ScanSiteAsync();
        _cancelButton.Text = "CANCEL";
        _cancelButton.Location = new Point(738, 76);
        _cancelButton.Size = new Size(84, 30);
        _cancelButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
        StyleButton(_cancelButton, false);
        _cancelButton.Enabled = false;
        _cancelButton.Click += (_, _) => _scanCts?.Cancel();
        _exportButton.Text = "EXPORT REPORT";
        _exportButton.Location = new Point(830, 76);
        _exportButton.Size = new Size(125, 30);
        _exportButton.Anchor = AnchorStyles.Top | AnchorStyles.Right;
        StyleButton(_exportButton, false);
        _exportButton.Click += (_, _) => ExportReport();

        header.Controls.AddRange([title, subtitle, _siteUrl, _scanButton, _cancelButton, _exportButton]);

        _tabs.Dock = DockStyle.Fill;
        _tabs.Appearance = TabAppearance.Normal;
        _tabs.Padding = new Point(14, 5);
        _tabs.BackColor = Bg;
        _tabs.ForeColor = TextColor;
        _tabs.TabPages.Add(BuildEndpointTab());
        _tabs.TabPages.Add(BuildFindingTab());
        _tabs.TabPages.Add(BuildActivityTab());

        var footer = new Panel
        {
            Dock = DockStyle.Bottom,
            Height = 47,
            BackColor = PanelBg,
            Padding = new Padding(16, 5, 16, 5)
        };
        _status.Text = "Ready";
        _status.ForeColor = Muted;
        _status.AutoEllipsis = true;
        _status.Dock = DockStyle.Top;
        _status.Height = 19;
        _summary.Text = "0 endpoints  ·  0 possible exposure categories";
        _summary.ForeColor = Accent;
        _summary.Dock = DockStyle.Bottom;
        _summary.Height = 18;
        footer.Controls.Add(_status);
        footer.Controls.Add(_summary);

        Controls.Add(_tabs);
        Controls.Add(footer);
        Controls.Add(header);
        Resize += (_, _) => PositionHeaderButtons(header);
        PositionHeaderButtons(header);
    }

    private void PositionHeaderButtons(Panel header)
    {
        if (_exportButton.Parent != header) return;
        _exportButton.Left = header.ClientSize.Width - 143;
        _cancelButton.Left = _exportButton.Left - 92;
        _scanButton.Left = _cancelButton.Left - 112;
        _siteUrl.Width = Math.Max(260, _scanButton.Left - _siteUrl.Left - 10);
    }

    private TabPage BuildEndpointTab()
    {
        var page = MakeTab("API ENDPOINTS");
        var info = MakeInfoLabel("URLs found in the page HTML and same-origin JavaScript bundles. Discovery is passive with respect to API routes: the app does not call discovered endpoints.");
        info.Dock = DockStyle.Top;
        info.Height = 42;
        _endpointGrid.Dock = DockStyle.Fill;
        ConfigureGrid(_endpointGrid, ("url", "Endpoint URL", 58), ("source", "Source", 20), ("host", "Host", 22));
        page.Controls.Add(_endpointGrid);
        page.Controls.Add(info);
        return page;
    }

    private TabPage BuildFindingTab()
    {
        var page = MakeTab("EXPOSURE AUDIT");
        var info = MakeInfoLabel("Checks embedded page code for common secret-shaped patterns. Matched values are never displayed or included in the exported report. False positives are possible.");
        info.Dock = DockStyle.Top;
        info.Height = 42;
        _findingGrid.Dock = DockStyle.Fill;
        ConfigureGrid(_findingGrid, ("category", "Pattern", 24), ("source", "Source", 24), ("result", "Finding", 52));
        page.Controls.Add(_findingGrid);
        page.Controls.Add(info);
        return page;
    }

    private TabPage BuildActivityTab()
    {
        var page = MakeTab("ACTIVITY");
        _activity.Dock = DockStyle.Fill;
        _activity.ReadOnly = true;
        _activity.BorderStyle = BorderStyle.None;
        _activity.BackColor = FieldBg;
        _activity.ForeColor = TextColor;
        _activity.Font = new Font("Cascadia Mono", 9F);
        _activity.WordWrap = false;
        _activity.DetectUrls = false;
        _activity.ScrollBars = RichTextBoxScrollBars.Both;
        page.Controls.Add(_activity);
        return page;
    }

    private TabPage MakeTab(string text)
    {
        var page = new TabPage(text)
        {
            BackColor = Bg,
            ForeColor = TextColor,
            Padding = new Padding(10)
        };
        return page;
    }

    private Label MakeInfoLabel(string text) => new()
    {
        Text = text,
        ForeColor = Muted,
        BackColor = Bg,
        Padding = new Padding(8, 5, 8, 5),
        TextAlign = ContentAlignment.MiddleLeft
    };

    private void ConfigureGrid(DataGridView grid, params (string Name, string Header, int Weight)[] columns)
    {
        grid.AllowUserToAddRows = false;
        grid.AllowUserToDeleteRows = false;
        grid.AllowUserToResizeRows = false;
        grid.AutoGenerateColumns = false;
        grid.BackgroundColor = Bg;
        grid.BorderStyle = BorderStyle.None;
        grid.CellBorderStyle = DataGridViewCellBorderStyle.SingleHorizontal;
        grid.ColumnHeadersBorderStyle = DataGridViewHeaderBorderStyle.Single;
        grid.EnableHeadersVisualStyles = false;
        grid.ReadOnly = true;
        grid.RowHeadersVisible = false;
        grid.SelectionMode = DataGridViewSelectionMode.FullRowSelect;
        grid.MultiSelect = false;
        grid.AutoSizeRowsMode = DataGridViewAutoSizeRowsMode.AllCells;
        grid.DefaultCellStyle.BackColor = FieldBg;
        grid.DefaultCellStyle.ForeColor = TextColor;
        grid.DefaultCellStyle.SelectionBackColor = Color.FromArgb(60, 72, 88);
        grid.DefaultCellStyle.SelectionForeColor = Color.White;
        grid.DefaultCellStyle.WrapMode = DataGridViewTriState.True;
        grid.ColumnHeadersDefaultCellStyle.BackColor = PanelBg;
        grid.ColumnHeadersDefaultCellStyle.ForeColor = TextColor;
        grid.ColumnHeadersDefaultCellStyle.SelectionBackColor = PanelBg;
        grid.ColumnHeadersDefaultCellStyle.Font = new Font("Segoe UI Semibold", 9F, FontStyle.Bold);
        grid.GridColor = Border;
        grid.Columns.Clear();
        foreach (var c in columns)
        {
            grid.Columns.Add(new DataGridViewTextBoxColumn
            {
                Name = c.Name,
                HeaderText = c.Header,
                FillWeight = c.Weight,
                SortMode = DataGridViewColumnSortMode.Automatic
            });
        }
    }

    private void StyleTextBox(TextBox box)
    {
        box.BorderStyle = BorderStyle.FixedSingle;
        box.BackColor = FieldBg;
        box.ForeColor = TextColor;
        box.Font = new Font("Cascadia Mono", 9.2F);
    }

    private void StyleButton(Button button, bool primary)
    {
        button.FlatStyle = FlatStyle.Flat;
        button.FlatAppearance.BorderColor = primary ? Accent : Border;
        button.FlatAppearance.MouseOverBackColor = Color.FromArgb(51, 58, 68);
        button.BackColor = primary ? Color.FromArgb(58, 70, 84) : FieldBg;
        button.ForeColor = TextColor;
        button.Cursor = Cursors.Hand;
    }

    private async Task ScanSiteAsync()
    {
        if (!Uri.TryCreate(_siteUrl.Text.Trim(), UriKind.Absolute, out var startUri) ||
            (startUri.Scheme != Uri.UriSchemeHttp && startUri.Scheme != Uri.UriSchemeHttps))
        {
            SetStatus("Enter a valid http:// or https:// URL.", true);
            return;
        }

        _scanCts?.Cancel();
        _scanCts?.Dispose();
        _scanCts = new CancellationTokenSource();
        var token = _scanCts.Token;
        _endpoints.Clear();
        _findings.Clear();
        _endpointGrid.Rows.Clear();
        _findingGrid.Rows.Clear();
        _scannedScripts = 0;
        _scannedUrl = SanitizeUrl(startUri);
        _lastScan = DateTimeOffset.UtcNow;
        SetBusy(true);
        _tabs.SelectedIndex = 0;
        Log($"Start scan: {_scannedUrl}");
        SetStatus("Downloading page HTML…", false);

        try
        {
            var page = await FetchTextAsync(startUri, 4 * 1024 * 1024, token);
            _scannedUrl = SanitizeUrl(page.FinalUri);
            AddFromSource(page.Text, page.FinalUri, "page HTML");
            AuditText(page.Text, "page HTML");

            var scriptUris = new HashSet<string>(StringComparer.OrdinalIgnoreCase);
            foreach (Match m in ScriptSourceRegex.Matches(page.Text))
            {
                if (!Uri.TryCreate(page.FinalUri, WebUtility.HtmlDecode(m.Groups[1].Value), out var scriptUri)) continue;
                if (scriptUri.Scheme is not ("http" or "https")) continue;
                if (SameOrigin(page.FinalUri, scriptUri))
                    scriptUris.Add(scriptUri.AbsoluteUri);
                else
                    AddEndpointIfApi(scriptUri, "script reference");
            }

            var scriptsToRead = scriptUris.Take(30).ToList();
            Log($"Found {scriptUris.Count} same-origin script references; scanning up to {scriptsToRead.Count}.");
            var completed = 0;
            foreach (var raw in scriptsToRead)
            {
                token.ThrowIfCancellationRequested();
                if (!Uri.TryCreate(raw, UriKind.Absolute, out var scriptUri)) continue;
                try
                {
                    var script = await FetchTextAsync(scriptUri, 900 * 1024, token);
                    _scannedScripts++;
                    AddFromSource(script.Text, script.FinalUri, "script");
                    AuditText(script.Text, $"script {_scannedScripts}");
                    completed++;
                    SetStatus($"Scanning same-origin scripts: {completed}/{scriptsToRead.Count}…", false);
                }
                catch (OperationCanceledException) { throw; }
                catch (Exception ex)
                {
                    Log($"Skipped script {SanitizeUrl(scriptUri)} ({ex.GetType().Name}).");
                }
            }

            RenderEndpoints();
            RenderFindings();
            UpdateSummary();
            Log($"Scan complete. Endpoints: {_endpoints.Count}; possible exposure categories: {_findings.Count}; scripts read: {_scannedScripts}.");
            SetStatus($"Scan complete: {_endpoints.Count} endpoints, {_findings.Count} possible findings. Review findings manually.", false);
        }
        catch (OperationCanceledException)
        {
            SetStatus("Scan cancelled.", false);
            Log("Scan cancelled by user.");
        }
        catch (Exception ex)
        {
            SetStatus($"Scan failed: {ex.Message}", true);
            Log($"Scan failed: {ex.GetType().Name}: {ex.Message}");
        }
        finally
        {
            SetBusy(false);
        }
    }

    private async Task<(string Text, Uri FinalUri)> FetchTextAsync(Uri uri, int maxBytes, CancellationToken token)
    {
        using var response = await _http.GetAsync(uri, HttpCompletionOption.ResponseHeadersRead, token);
        response.EnsureSuccessStatusCode();
        if (response.Content.Headers.ContentLength is long size && size > maxBytes)
            throw new InvalidOperationException($"Resource is larger than the {maxBytes / 1024} KB safety limit.");
        await using var stream = await response.Content.ReadAsStreamAsync(token);
        using var memory = new MemoryStream();
        var buffer = new byte[16 * 1024];
        int read;
        while ((read = await stream.ReadAsync(buffer.AsMemory(0, buffer.Length), token)) > 0)
        {
            if (memory.Length + read > maxBytes)
                throw new InvalidOperationException($"Resource exceeded the {maxBytes / 1024} KB safety limit.");
            memory.Write(buffer, 0, read);
        }
        var finalUri = response.RequestMessage?.RequestUri ?? uri;
        return (Encoding.UTF8.GetString(memory.ToArray()), finalUri);
    }

    private void AddFromSource(string text, Uri baseUri, string source)
    {
        foreach (Match match in AbsoluteUrlRegex.Matches(text))
        {
            if (!Uri.TryCreate(match.Value.TrimEnd('.', ',', ';', ')', ']', '}'), UriKind.Absolute, out var uri)) continue;
            AddEndpointIfApi(uri, source);
        }

        foreach (Match match in ApiPathRegex.Matches(text))
        {
            var candidate = match.Value.TrimEnd('.', ',', ';', ')', ']', '}');
            if (!Uri.TryCreate(baseUri, candidate, out var uri)) continue;
            AddEndpointIfApi(uri, source);
        }

        foreach (Match match in Regex.Matches(text, @"(?:fetch|axios\.(?:get|post|put|patch|delete)|XMLHttpRequest|url)\s*(?:\(\s*)?['""]([^'""]{2,500})['""]", RegexOptions.IgnoreCase))
        {
            var candidate = match.Groups[1].Value;
            if (Uri.TryCreate(baseUri, candidate, out var uri))
                AddEndpointIfApi(uri, source + " reference");
        }
    }

    private void AddEndpointIfApi(Uri uri, string source)
    {
        if (uri.Scheme is not ("http" or "https")) return;
        var path = uri.AbsolutePath;
        var isApi = uri.Host.StartsWith("api.", StringComparison.OrdinalIgnoreCase) ||
                    uri.Host.Contains(".api.", StringComparison.OrdinalIgnoreCase) ||
                    Regex.IsMatch(path, @"(^|/)(api|graphql|oauth|auth|v\d+|rest|rpc|accounts|users)(/|$)", RegexOptions.IgnoreCase);
        if (!isApi) return;
        var safeUrl = SanitizeUrl(uri);
        if (string.IsNullOrWhiteSpace(safeUrl)) return;
        var key = safeUrl;
        if (!_endpoints.ContainsKey(key))
        {
            var item = new EndpointItem(safeUrl, source, uri.Host);
            _endpoints.Add(key, item);
            _endpointGrid.Rows.Add(item.Url, item.Source, item.Host);
        }
    }

    private void AuditText(string text, string source)
    {
        foreach (var (name, pattern) in SecretPatterns)
        {
            if (!pattern.IsMatch(text)) continue;
            var key = name + "|" + source;
            if (_findings.ContainsKey(key)) continue;
            var item = new FindingItem(name, source, "Possible match. Value intentionally hidden; verify source manually.");
            _findings.Add(key, item);
            _findingGrid.Rows.Add(item.Category, item.Source, item.Result);
            Log($"Possible exposure pattern in {source}: {name}. Matched value was not collected.");
        }
    }

    private static bool SameOrigin(Uri a, Uri b) =>
        a.Scheme.Equals(b.Scheme, StringComparison.OrdinalIgnoreCase) &&
        a.Host.Equals(b.Host, StringComparison.OrdinalIgnoreCase) &&
        a.Port == b.Port;

    private static string SanitizeUrl(Uri uri)
    {
        try
        {
            var builder = new UriBuilder(uri) { UserName = "", Password = "", Fragment = "" };
            var parts = builder.Query.TrimStart('?').Split('&', StringSplitOptions.RemoveEmptyEntries);
            for (var i = 0; i < parts.Length; i++)
            {
                var split = parts[i].Split('=', 2);
                var key = WebUtility.UrlDecode(split[0]);
                if (Regex.IsMatch(key, @"(token|secret|password|passwd|auth|session|cookie|csrf|xsrf|api.?key|signature|credential|jwt|bearer)", RegexOptions.IgnoreCase))
                    parts[i] = split[0] + "=%5BREDACTED%5D";
            }
            builder.Query = string.Join("&", parts);
            var pathParts = builder.Path.Split('/');
            for (var i = 0; i < pathParts.Length - 1; i++)
            {
                if (Regex.IsMatch(pathParts[i], @"(^|[-_])(token|secret|session|auth|key|credential|jwt)([-_]|$)", RegexOptions.IgnoreCase) &&
                    pathParts[i + 1].Length > 6)
                    pathParts[i + 1] = "[REDACTED]";
            }
            builder.Path = string.Join("/", pathParts);
            return builder.Uri.AbsoluteUri;
        }
        catch
        {
            return "";
        }
    }

    private void RenderEndpoints()
    {
        _endpointGrid.Rows.Clear();
        foreach (var item in _endpoints.Values.OrderBy(x => x.Host).ThenBy(x => x.Url))
            _endpointGrid.Rows.Add(item.Url, item.Source, item.Host);
    }

    private void RenderFindings()
    {
        _findingGrid.Rows.Clear();
        foreach (var item in _findings.Values.OrderBy(x => x.Source).ThenBy(x => x.Category))
            _findingGrid.Rows.Add(item.Category, item.Source, item.Result);
    }

    private void UpdateSummary() =>
        _summary.Text = $"{_endpoints.Count} endpoints  ·  {_findings.Count} possible exposure categories  ·  {_scannedScripts} scripts read";

    private void ExportReport()
    {
        using var dialog = new SaveFileDialog
        {
            Title = "Export sanitized audit report",
            Filter = "JSON report (*.json)|*.json",
            FileName = "server-trace-report.json",
            AddExtension = true,
            DefaultExt = "json"
        };
        if (dialog.ShowDialog(this) != DialogResult.OK) return;
        var report = new
        {
            scannedAtUtc = _lastScan,
            pageUrl = _scannedUrl,
            sameOriginScriptsRead = _scannedScripts,
            endpoints = _endpoints.Values.OrderBy(x => x.Host).ThenBy(x => x.Url),
            findings = _findings.Values.OrderBy(x => x.Source).ThenBy(x => x.Category),
            privacy = "No matched secret values, cookies, browser sessions, or authorization headers are collected or exported. Scan requests only fetch the user-entered page and same-origin script resources."
        };
        File.WriteAllText(dialog.FileName, JsonSerializer.Serialize(report, new JsonSerializerOptions { WriteIndented = true }), Encoding.UTF8);
        Log($"Exported sanitized report: {dialog.FileName}");
        SetStatus("Sanitized report exported.", false);
    }

    private void SetBusy(bool busy)
    {
        _scanButton.Enabled = !busy;
        _cancelButton.Enabled = busy;
        _siteUrl.Enabled = !busy;
        _exportButton.Enabled = !busy;
    }

    private void SetStatus(string text, bool error)
    {
        _status.Text = text;
        _status.ForeColor = error ? Color.FromArgb(245, 150, 150) : Muted;
    }

    private void Log(string message)
    {
        if (IsDisposed) return;
        _activity.AppendText($"[{DateTime.Now:HH:mm:ss}] {message}{Environment.NewLine}");
    }

    private sealed record EndpointItem(string Url, string Source, string Host);
    private sealed record FindingItem(string Category, string Source, string Result);
}