namespace Asisya.Application.Interfaces;

public interface IProductBulkImporter
{
    Task<long> ImportBatchAsync(
        IReadOnlyList<ProductImportRow> rows,
        CancellationToken ct
    );
}

public sealed record ProductImportRow(
    string Name,
    string Sku,
    decimal Price,
    Guid CategoryId
);
