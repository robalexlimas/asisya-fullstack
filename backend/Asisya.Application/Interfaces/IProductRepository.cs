using Asisya.Application.DTOs.Products;

namespace Asisya.Application.Interfaces;

public interface IProductRepository
{
    Task<int> GenerateAsync(int count, Guid[] categoryIds, int batchSize, CancellationToken ct);

    Task<(IReadOnlyList<ProductListItemDto> Items, int Total)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct
    );

    Task<ProductDetailDto?> GetByIdAsync(Guid id, CancellationToken ct);
}
