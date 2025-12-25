using Asisya.Application.DTOs.Jobs;
using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Database;
using Dapper;

namespace Asisya.Infrastructure.Repositories;

public sealed class ImportJobRepository : IImportJobRepository
{
    private readonly IDbConnectionFactory _db;

    public ImportJobRepository(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task CreateAsync(Guid jobId, string type, string filename, CancellationToken ct)
    {
        const string sql = """
        INSERT INTO import_jobs (id, type, status, filename)
        VALUES (@Id, @Type, 'Queued', @Filename);
        """;

        using var conn = _db.CreateConnection();

        await conn.ExecuteAsync(
            new CommandDefinition(
                sql,
                new { Id = jobId, Type = type, Filename = filename },
                cancellationToken: ct
            )
        );
    }

    public async Task MarkProcessingAsync(Guid jobId, CancellationToken ct)
    {
        const string sql = """
        UPDATE import_jobs
        SET status='Processing', started_at = COALESCE(started_at, now())
        WHERE id = @Id;
        """;

        using var conn = _db.CreateConnection();

        await conn.ExecuteAsync(
            new CommandDefinition(sql, new { Id = jobId }, cancellationToken: ct)
        );
    }

    public async Task UpdateProgressAsync(Guid jobId, long processed, long inserted, long failed, long total, CancellationToken ct)
    {
        const string sql = """
        UPDATE import_jobs
        SET processed_rows = @Processed,
            inserted_rows  = @Inserted,
            failed_rows    = @Failed,
            total_rows     = @Total
        WHERE id = @Id;
        """;

        using var conn = _db.CreateConnection();

        await conn.ExecuteAsync(
            new CommandDefinition(
                sql,
                new
                {
                    Id = jobId,
                    Processed = processed,
                    Inserted = inserted,
                    Failed = failed,
                    Total = total
                },
                cancellationToken: ct
            )
        );
    }

    public async Task MarkCompletedAsync(Guid jobId, CancellationToken ct)
    {
        const string sql = """
        UPDATE import_jobs
        SET status='Completed', finished_at = now()
        WHERE id = @Id;
        """;

        using var conn = _db.CreateConnection();

        await conn.ExecuteAsync(
            new CommandDefinition(sql, new { Id = jobId }, cancellationToken: ct)
        );
    }

    public async Task MarkFailedAsync(Guid jobId, string error, CancellationToken ct)
    {
        const string sql = """
        UPDATE import_jobs
        SET status='Failed', error=@Error, finished_at = now()
        WHERE id = @Id;
        """;

        using var conn = _db.CreateConnection();

        await conn.ExecuteAsync(
            new CommandDefinition(sql, new { Id = jobId, Error = error }, cancellationToken: ct)
        );
    }

    public async Task<ImportJobDto?> GetAsync(Guid jobId, CancellationToken ct)
    {
        const string sql = """
        SELECT
          id             AS "JobId",
          status         AS "Status",
          total_rows     AS "TotalRows",
          processed_rows AS "ProcessedRows",
          inserted_rows  AS "InsertedRows",
          failed_rows    AS "FailedRows",
          created_at     AS "CreatedAt",
          started_at     AS "StartedAt",
          finished_at    AS "FinishedAt",
          error          AS "Error"
        FROM import_jobs
        WHERE id = @Id;
        """;

        using var conn = _db.CreateConnection();

        return await conn.QuerySingleOrDefaultAsync<ImportJobDto>(
            new CommandDefinition(sql, new { Id = jobId }, cancellationToken: ct)
        );
    }

    public async Task<(IReadOnlyList<ImportJobDto> Items, long Total)> GetPagedAsync(
        int page,
        int pageSize,
        CancellationToken ct
    )
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        var offset = (page - 1) * pageSize;

        const string sql = """
        SELECT
          id             AS "JobId",
          status         AS "Status",
          total_rows     AS "TotalRows",
          processed_rows AS "ProcessedRows",
          inserted_rows  AS "InsertedRows",
          failed_rows    AS "FailedRows",
          created_at     AS "CreatedAt",
          started_at     AS "StartedAt",
          finished_at    AS "FinishedAt",
          error          AS "Error"
        FROM import_jobs
        ORDER BY created_at DESC
        OFFSET @Offset
        LIMIT @PageSize;

        SELECT COUNT(*)::bigint FROM import_jobs;
        """;

        using var conn = _db.CreateConnection();

        using var multi = await conn.QueryMultipleAsync(
            new CommandDefinition(
                sql,
                new { Offset = offset, PageSize = pageSize },
                cancellationToken: ct
            )
        );

        var items = (await multi.ReadAsync<ImportJobDto>()).AsList();
        var total = await multi.ReadSingleAsync<long>();

        return (items, total);
    }
}
