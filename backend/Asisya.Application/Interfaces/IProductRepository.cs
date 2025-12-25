using Asisya.Application.DTOs.Products;

namespace Asisya.Application.Interfaces;

public interface IProductRepository
{
    Task<int> GenerateAsync(int count, Guid[] categoryIds, int batchSize, CancellationToken ct);

    Task<(IReadOnlyList<ProductListItemDto> Items, long Total)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct
    );

    Task<ProductDetailDto?> GetByIdAsync(Guid id, CancellationToken ct);

    Task<Guid> CreateAsync(CreateProductRequest req, CancellationToken ct);

    Task<bool> UpdateAsync(Guid id, string name, decimal price, Guid categoryId, CancellationToken ct);
    Task<bool> DeleteAsync(Guid id, CancellationToken ct);
}
