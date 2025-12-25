using Asisya.Application.DTOs.Categories;
using Asisya.Infrastructure.Database;
using Asisya.Infrastructure.Repositories;
using Asisya.IntegrationTests.Fixtures;

namespace Asisya.IntegrationTests.Repositories;

public sealed class CategoryRepositoryTests : IClassFixture<PostgresFixture>
{
    private readonly PostgresFixture _fx;

    public CategoryRepositoryTests(PostgresFixture fx)
    {
        _fx = fx;
    }

    [Fact]
    public async Task CreateAsync_Inserts_And_Returns_Category()
    {
        // arrange
        IDbConnectionFactory db = new NpgsqlConnectionFactory(_fx.ConnectionString);
        var repo = new CategoryRepository(db);

        var req = new CreateCategoryRequest(
            "TEST-" + Guid.NewGuid().ToString("N"),
            "https://example.com/test.png"
        );

        // act
        var created = await repo.CreateAsync(req, CancellationToken.None);

        // assert
        Assert.NotEqual(Guid.Empty, created.Id);
        Assert.Equal(req.Name, created.Name);
        Assert.Equal(req.PhotoUrl, created.PhotoUrl);
    }

    [Fact]
    public async Task GetPagedAsync_Returns_Items_After_Insert()
    {
        IDbConnectionFactory db = new NpgsqlConnectionFactory(_fx.ConnectionString);
        var repo = new CategoryRepository(db);

        var req = new CreateCategoryRequest(
            "TEST-" + Guid.NewGuid().ToString("N"),
            "https://example.com/test.png"
        );

        _ = await repo.CreateAsync(req, CancellationToken.None);

        var (items, total) = await repo.GetPagedAsync(page: 1, pageSize: 10, search: "TEST-", ct: CancellationToken.None);

        Assert.True(total >= 1);
        Assert.Contains(items, x => x.Name.StartsWith("TEST-", StringComparison.OrdinalIgnoreCase));
    }
}