using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Database;
using Npgsql;
using NpgsqlTypes;

namespace Asisya.Infrastructure.Repositories;

public sealed class PostgresProductBulkImporter : IProductBulkImporter
{
    private readonly IDbConnectionFactory _db;

    public PostgresProductBulkImporter(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<long> ImportBatchAsync(IReadOnlyList<ProductImportRow> rows, CancellationToken ct)
    {
        if (rows.Count == 0) return 0;

        using var conn = _db.CreateConnection();

        if (conn is not NpgsqlConnection npgsql)
            throw new InvalidOperationException("Postgres bulk import requires NpgsqlConnection.");

        if (npgsql.State != System.Data.ConnectionState.Open)
            await npgsql.OpenAsync(ct);

        var copySql = "COPY products (id, name, sku, price, category_id) FROM STDIN (FORMAT BINARY)";

        await using var importer = await npgsql.BeginBinaryImportAsync(copySql, ct);

        foreach (var r in rows)
        {
            await importer.StartRowAsync(ct);

            importer.Write(Guid.NewGuid(), NpgsqlDbType.Uuid);
            importer.Write(r.Name, NpgsqlDbType.Text);
            importer.Write(r.Sku, NpgsqlDbType.Text);
            importer.Write(r.Price, NpgsqlDbType.Numeric);
            importer.Write(r.CategoryId, NpgsqlDbType.Uuid);
        }

        var inserted = await importer.CompleteAsync(ct);
        return (long)inserted;
    }
}
