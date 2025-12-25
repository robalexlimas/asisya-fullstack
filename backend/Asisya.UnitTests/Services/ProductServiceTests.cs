using Asisya.Application.DTOs.Products;
using Asisya.Application.Interfaces;
using Asisya.Application.Services;
using Moq;
using Xunit;

namespace Asisya.UnitTests.Services;

public sealed class ProductServiceTests
{
    private readonly Mock<IProductRepository> _repo = new(MockBehavior.Strict);
    private readonly ProductService _sut;

    public ProductServiceTests()
    {
        _sut = new ProductService(_repo.Object);
    }

    [Fact]
    public async Task GenerateAsync_Throws_When_Count_Is_Invalid()
    {
        var req = new GenerateProductsRequest { Count = 0, BatchSize = 10, CategoryIds = new[] { Guid.NewGuid() } };
        await Assert.ThrowsAsync<ArgumentException>(() => _sut.GenerateAsync(req, CancellationToken.None));
    }

    [Fact]
    public async Task GenerateAsync_Throws_When_BatchSize_Is_Invalid()
    {
        var req = new GenerateProductsRequest { Count = 10, BatchSize = 0, CategoryIds = new[] { Guid.NewGuid() } };
        await Assert.ThrowsAsync<ArgumentException>(() => _sut.GenerateAsync(req, CancellationToken.None));
    }

    [Fact]
    public async Task GenerateAsync_Throws_When_CategoryIds_Is_Empty()
    {
        var req = new GenerateProductsRequest { Count = 10, BatchSize = 10, CategoryIds = Array.Empty<Guid>() };
        await Assert.ThrowsAsync<ArgumentException>(() => _sut.GenerateAsync(req, CancellationToken.None));
    }

    [Fact]
    public async Task GenerateAsync_Calls_Repo_When_Valid()
    {
        var cats = new[] { Guid.NewGuid(), Guid.NewGuid() };
        var req = new GenerateProductsRequest { Count = 10, BatchSize = 5, CategoryIds = cats };

        _repo.Setup(r => r.GenerateAsync(req.Count, cats, req.BatchSize, It.IsAny<CancellationToken>()))
            .ReturnsAsync(10);

        var result = await _sut.GenerateAsync(req, CancellationToken.None);

        Assert.Equal(10, result);
        _repo.VerifyAll();
    }

    [Fact]
    public async Task GetPagedAsync_Normalizes_Page_And_PageSize()
    {
        _repo.Setup(r => r.GetPagedAsync(
                1, 20, "abc", null, It.IsAny<CancellationToken>()))
            .ReturnsAsync((Array.Empty<ProductListItemDto>(), 0));

        var (items, total) = await _sut.GetPagedAsync(0, 0, "abc", null, CancellationToken.None);

        Assert.Empty(items);
        Assert.Equal(0, total);
        _repo.VerifyAll();
    }
}
