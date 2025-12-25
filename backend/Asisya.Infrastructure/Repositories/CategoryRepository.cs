using Asisya.Application.DTOs.Categories;
using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Database;
using Dapper;

namespace Asisya.Infrastructure.Repositories;

public sealed class CategoryRepository : ICategoryRepository
{
    private readonly IDbConnectionFactory _db;

    public CategoryRepository(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<CategoryDto> CreateAsync(
        CreateCategoryRequest req,
        CancellationToken ct
    )
    {
        const string sql = """
        SELECT
            id          AS "Id",
            name        AS "Name",
            photo_url   AS "PhotoUrl",
            created_at  AS "CreatedAt"
        FROM sp_create_category(@Name, @PhotoUrl);
        """;

        using var conn = _db.CreateConnection();

        var category = await conn.QuerySingleAsync<CategoryDto>(
            new CommandDefinition(
                sql,
                new
                {
                    Name = req.Name,
                    PhotoUrl = req.PhotoUrl
                },
                cancellationToken: ct
            )
        );

        return category;
    }

    public async Task<(IReadOnlyList<CategoryListItemDto> Items, long Total)> GetPagedAsync(
    int page,
    int pageSize,
    string? search,
    CancellationToken ct
)
    {
        const string sql = """
    SELECT
      id         AS "Id",
      name       AS "Name",
      photo_url  AS "PhotoUrl",
      total_count AS "TotalCount"
    FROM sp_get_categories(@Page, @PageSize, @Search);
    """;

        using var conn = _db.CreateConnection();

        var rows = (await conn.QueryAsync<CategoryListRow>(
            new CommandDefinition(
                sql,
                new { Page = page, PageSize = pageSize, Search = search },
                cancellationToken: ct
            )
        )).ToList();

        var total = rows.Count > 0 ? rows[0].TotalCount : 0L;

        var items = rows.Select(r => new CategoryListItemDto
        {
            Id = r.Id,
            Name = r.Name,
            PhotoUrl = r.PhotoUrl
        }).ToList();

        return (items, total);
    }

    private sealed class CategoryListRow
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = default!;
        public string? PhotoUrl { get; set; }
        public long TotalCount { get; set; }
    }
}
