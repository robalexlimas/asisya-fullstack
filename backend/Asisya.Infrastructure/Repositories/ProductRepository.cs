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

    public async Task<(IReadOnlyList<ProductListItemDto> Items, long Total)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct
    )
    {
        // Firma real en tu DB:
        // sp_get_products(p_page int, p_page_size int, p_category_id uuid, p_search text)
        const string sql = """
        SELECT
          id            AS "Id",
          name          AS "Name",
          sku           AS "Sku",
          price         AS "Price",
          category_name AS "CategoryName",
          total_count   AS "TotalCount"
        FROM sp_get_products(@Page, @PageSize, @CategoryId, @Search);
        """;

        using var conn = _db.CreateConnection();

        var rows = (await conn.QueryAsync<ProductListRow>(
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
        )).ToList();

        var total = rows.Count > 0 ? rows[0].TotalCount : 0L;

        var items = rows.Select(r => new ProductListItemDto
        {
            Id = r.Id,
            Name = r.Name,
            Sku = r.Sku,
            Price = r.Price,
            CategoryName = r.CategoryName
        }).ToList();

        return (items, total);
    }

    private sealed class ProductListRow
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string Sku { get; set; } = default!;
        public decimal Price { get; set; }
        public string CategoryName { get; set; } = default!;
        public long TotalCount { get; set; } // bigint -> long
    }

    public async Task<ProductDetailDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        const string sql = """
        SELECT
          id                AS "Id",
          name              AS "Name",
          sku               AS "Sku",
          price             AS "Price",
          category_id       AS "CategoryId",
          category_name     AS "CategoryName",
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
