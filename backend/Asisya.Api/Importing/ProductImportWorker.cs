using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Database;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using System.Data;
using System.Data.Common;
using System.Globalization;

namespace Asisya.Api.Importing;

public sealed class ProductImportWorker : BackgroundService
{
    private readonly ILogger<ProductImportWorker> _logger;
    private readonly IImportQueue _queue;
    private readonly IServiceScopeFactory _scopeFactory;

    // tuning
    private const int BatchSize = 5000;
    private const int ProgressUpdateEvery = 5000;

    public ProductImportWorker(
        ILogger<ProductImportWorker> logger,
        IImportQueue queue,
        IServiceScopeFactory scopeFactory
    )
    {
        _logger = logger;
        _queue = queue;
        _scopeFactory = scopeFactory;
    }

    protected override async Task ExecuteAsync(CancellationToken stoppingToken)
    {
        _logger.LogInformation("ProductImportWorker started.");

        while (!stoppingToken.IsCancellationRequested)
        {
            ImportJobMessage msg;

            try
            {
                msg = await _queue.DequeueAsync(stoppingToken);
            }
            catch (OperationCanceledException)
            {
                break;
            }

            await ProcessJob(msg, stoppingToken);
        }

        _logger.LogInformation("ProductImportWorker stopped.");
    }

    private async Task ProcessJob(ImportJobMessage msg, CancellationToken ct)
    {
        var jobId = msg.JobId;
        var filePath = msg.FilePath;

        using var scope = _scopeFactory.CreateScope();

        var jobs = scope.ServiceProvider.GetRequiredService<IImportJobRepository>();
        var bulk = scope.ServiceProvider.GetRequiredService<IProductBulkImporter>();
        var db = scope.ServiceProvider.GetRequiredService<IDbConnectionFactory>();

        try
        {
            await jobs.MarkProcessingAsync(jobId, ct);

            // 1) Cargar categorías a diccionario (por nombre)
            var categories = await LoadCategoryMap(db, ct);

            long total = 0;
            long processed = 0;
            long inserted = 0;
            long failed = 0;

            var batch = new List<ProductImportRow>(BatchSize);

            using var fs = File.OpenRead(filePath);
            using var sr = new StreamReader(fs);

            // 2) Header
            var header = await sr.ReadLineAsync();
            if (header is null)
                throw new InvalidOperationException("CSV is empty.");

            string? line;
            while ((line = await sr.ReadLineAsync()) is not null)
            {
                ct.ThrowIfCancellationRequested();

                if (string.IsNullOrWhiteSpace(line))
                    continue;

                total++;

                if (!TryParseCsvLine(line, categories, out var row))
                {
                    failed++;
                    processed++;
                    continue;
                }

                batch.Add(row);
                processed++;

                if (batch.Count >= BatchSize)
                {
                    inserted += await bulk.ImportBatchAsync(batch, ct);
                    batch.Clear();
                }

                if (processed % ProgressUpdateEvery == 0)
                {
                    await jobs.UpdateProgressAsync(jobId, processed, inserted, failed, total, ct);
                }
            }

            if (batch.Count > 0)
            {
                inserted += await bulk.ImportBatchAsync(batch, ct);
                batch.Clear();
            }

            await jobs.UpdateProgressAsync(jobId, processed, inserted, failed, total, ct);
            await jobs.MarkCompletedAsync(jobId, ct);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Import job failed: {JobId}", jobId);
            await jobs.MarkFailedAsync(jobId, ex.Message, ct);
        }
    }

    private static async Task<Dictionary<string, Guid>> LoadCategoryMap(
        IDbConnectionFactory db,
        CancellationToken ct
    )
    {
        const string sql = """
        SELECT id, name
        FROM categories;
        """;

        using var conn = db.CreateConnection();
        if (conn is not DbConnection dbConn)
            throw new InvalidOperationException("Connection does not support asynchronous operations.");

        using var cmd = dbConn.CreateCommand();
        cmd.CommandText = sql;

        if (dbConn.State != ConnectionState.Open)
            await dbConn.OpenAsync(ct);

        var map = new Dictionary<string, Guid>(StringComparer.OrdinalIgnoreCase);

        using var reader = await cmd.ExecuteReaderAsync(ct);
        while (await reader.ReadAsync(ct))
        {
            var id = reader.GetGuid(0);
            var name = reader.GetString(1).Trim();
            map[name.ToUpperInvariant()] = id;
        }

        return map;
    }

    private static bool TryParseCsvLine(
        string line,
        Dictionary<string, Guid> categoryMap,
        out ProductImportRow row
    )
    {
        row = default!;

        var parts = line.Split(',', 4);
        if (parts.Length != 4) return false;

        var name = parts[0].Trim();
        var sku = parts[1].Trim();
        var priceStr = parts[2].Trim();
        var categoryStr = parts[3].Trim().ToUpperInvariant();

        if (string.IsNullOrWhiteSpace(name)) return false;
        if (string.IsNullOrWhiteSpace(sku)) return false;

        if (!decimal.TryParse(priceStr, NumberStyles.Any, CultureInfo.InvariantCulture, out var price))
            return false;

        if (!categoryMap.TryGetValue(categoryStr, out var categoryId))
            return false;

        row = new ProductImportRow(name, sku, price, categoryId);
        return true;
    }
}
