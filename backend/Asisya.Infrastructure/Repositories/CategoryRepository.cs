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
}
