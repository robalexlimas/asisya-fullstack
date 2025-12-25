using Asisya.Application.DTOs.Categories;
using Asisya.Infrastructure.Database;
using Asisya.Infrastructure.Repositories;
using Asisya.IntegrationTests.Fixtures;

namespace Asisya.IntegrationTests.Repositories;

public sealed class ProductRepositoryTests : IClassFixture<PostgresFixture>
{
    private readonly PostgresFixture _fx;

    public ProductRepositoryTests(PostgresFixture fx)
    {
        _fx = fx;
    }

    [Fact]
    public async Task GenerateAsync_Creates_Products_And_GetPagedAsync_Returns_Them()
    {
        // arrange
        IDbConnectionFactory db = new NpgsqlConnectionFactory(_fx.ConnectionString);

        var catRepo = new CategoryRepository(db);
        var prodRepo = new ProductRepository(db);

        // Crear 2 categorías
        var c1 = await catRepo.CreateAsync(
            new CreateCategoryRequest(
                "CLOUD-" + Guid.NewGuid().ToString("N"),
                "https://example.com/cloud.png"
            ),
            CancellationToken.None
        );

        var c2 = await catRepo.CreateAsync(
            new CreateCategoryRequest(
                "SERVIDORES-" + Guid.NewGuid().ToString("N"),
                "https://example.com/servers.png"
            ),
            CancellationToken.None
        );

        // act: generar productos con SP
        var inserted = await prodRepo.GenerateAsync(
            count: 50,
            categoryIds: new[] { c1.Id, c2.Id },
            batchSize: 25,
            ct: CancellationToken.None
        );

        // assert inserted
        Assert.True(inserted >= 50);

        // act: consultar paginado (debe devolver algo)
        var (items, total) = await prodRepo.GetPagedAsync(
            page: 1,
            pageSize: 20,
            search: "Product",
            categoryId: null,
            ct: CancellationToken.None
        );

        Assert.True(total >= 50);
        Assert.NotEmpty(items);

        // assert: al menos uno trae un categoryName no vacío
        Assert.Contains(items, x => !string.IsNullOrWhiteSpace(x.CategoryName));
    }
}
