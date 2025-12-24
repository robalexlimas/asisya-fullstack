using Asisya.Application.DTOs.Products;
using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Database;
using Dapper;

namespace Asisya.Infrastructure.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly IDbConnectionFactory _db;

    public ProductRepository(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<int> GenerateAsync(int count, Guid[] categoryIds, int batchSize, CancellationToken ct)
    {
        const string sql = "SELECT sp_generate_products(@Count, @CategoryIds::uuid[], @BatchSize);";

        using var conn = _db.CreateConnection();

        return await conn.ExecuteScalarAsync<int>(
            new CommandDefinition(
                sql,
                new
                {
                    Count = count,
                    CategoryIds = categoryIds,
                    BatchSize = batchSize
                },
                cancellationToken: ct
            )
        );
    }

    public async Task<(IReadOnlyList<ProductListItemDto> Items, int Total)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct
    )
    {
        const string sql = """
        SELECT * FROM sp_get_products(@Page, @PageSize, @Search, @CategoryId);
        """;

        using var conn = _db.CreateConnection();

        using var multi = await conn.QueryMultipleAsync(
            new CommandDefinition(
                sql,
                new
                {
                    Page = page,
                    PageSize = pageSize,
                    Search = search,
                    CategoryId = categoryId
                },
                cancellationToken: ct
            )
        );

        var items = (await multi.ReadAsync<ProductListItemDto>()).ToList();
        var total = await multi.ReadSingleAsync<int>();

        return (items, total);
    }

    public async Task<ProductDetailDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        const string sql = """
        SELECT
          id AS "Id",
          name AS "Name",
          sku AS "Sku",
          price AS "Price",
          category_name AS "CategoryName",
          category_photo_url AS "CategoryPhotoUrl"
        FROM sp_get_product_detail(@Id);
        """;

        using var conn = _db.CreateConnection();

        return await conn.QuerySingleOrDefaultAsync<ProductDetailDto>(
            new CommandDefinition(
                sql,
                new { Id = id },
                cancellationToken: ct
            )
        );
    }
}
