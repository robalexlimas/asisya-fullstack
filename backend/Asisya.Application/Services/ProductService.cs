using Asisya.Application.DTOs.Products;
using Asisya.Application.Interfaces;

namespace Asisya.Application.Services;

public sealed class ProductService
{
    private const int MaxPageSize = 100;
    private const int DefaultPageSize = 20;

    private readonly IProductRepository _repo;

    public ProductService(IProductRepository repo)
    {
        _repo = repo;
    }

    public Task<int> GenerateAsync(GenerateProductsRequest req, CancellationToken ct)
    {
        if (req is null) throw new ArgumentException("Request is required.");
        if (req.Count <= 0) throw new ArgumentException("Count must be greater than 0.");
        if (req.BatchSize <= 0) throw new ArgumentException("BatchSize must be greater than 0.");
        if (req.CategoryIds is null || req.CategoryIds.Length == 0)
            throw new ArgumentException("CategoryIds is required.");

        return _repo.GenerateAsync(req.Count, req.CategoryIds, req.BatchSize, ct);
    }

    public async Task<(IReadOnlyList<ProductListItemDto> Items, long Total)> GetPagedAsync(
        int page,
        int pageSize,
        string? search,
        Guid? categoryId,
        CancellationToken ct
    )
    {
        if (page <= 0) page = 1;

        if (pageSize <= 0) pageSize = DefaultPageSize;
        if (pageSize > MaxPageSize) pageSize = MaxPageSize;

        search = string.IsNullOrWhiteSpace(search) ? null : search.Trim();

        var (items, total) = await _repo.GetPagedAsync(page, pageSize, search, categoryId, ct);
        return (items, total);
    }

    public Task<ProductDetailDto?> GetByIdAsync(Guid id, CancellationToken ct)
    {
        if (id == Guid.Empty) throw new ArgumentException("Id is required.");
        return _repo.GetByIdAsync(id, ct);
    }

    public async Task<Guid> CreateAsync(CreateProductRequest req, CancellationToken ct)
    {
        if (req is null) throw new ArgumentException("Request is required.");
        if (string.IsNullOrWhiteSpace(req.Name)) throw new ArgumentException("Name is required.");
        if (string.IsNullOrWhiteSpace(req.Sku)) throw new ArgumentException("Sku is required.");
        if (req.Price <= 0) throw new ArgumentException("Price must be greater than 0.");
        if (req.CategoryId == Guid.Empty) throw new ArgumentException("CategoryId is required.");

        return await _repo.CreateAsync(
            new CreateProductRequest(
                req.Name.Trim(),
                req.Sku.Trim(),
                req.Price,
                req.CategoryId
            ),
            ct
        );
    }

    public async Task<bool> UpdateAsync(Guid id, UpdateProductRequest req, CancellationToken ct)
    {
        if (id == Guid.Empty) throw new ArgumentException("Id is required.");
        if (string.IsNullOrWhiteSpace(req.Name)) throw new ArgumentException("Name is required.");
        if (req.Price <= 0) throw new ArgumentException("Price must be greater than 0.");
        if (req.CategoryId == Guid.Empty) throw new ArgumentException("CategoryId is required.");

        return await _repo.UpdateAsync(id, req.Name.Trim(), req.Price, req.CategoryId, ct);
    }

    public async Task<bool> DeleteAsync(Guid id, CancellationToken ct)
    {
        if (id == Guid.Empty) throw new ArgumentException("Id is required.");
        return await _repo.DeleteAsync(id, ct);
    }
}