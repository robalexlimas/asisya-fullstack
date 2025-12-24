using Asisya.Application.DTOs.Products;
using Asisya.Application.Interfaces;

namespace Asisya.Application.Services;

public sealed class ProductService
{
    private readonly IProductRepository _repo;

    public ProductService(IProductRepository repo)
    {
        _repo = repo;
    }

    public Task<int> GenerateAsync(GenerateProductsRequest req, CancellationToken ct)
    {
        if (req.Count <= 0) throw new ArgumentException("Count must be greater than 0.");
        if (req.BatchSize <= 0) throw new ArgumentException("BatchSize must be greater than 0.");
        if (req.CategoryIds is null || req.CategoryIds.Length == 0)
            throw new ArgumentException("CategoryIds is required.");

        return _repo.GenerateAsync(req.Count, req.CategoryIds, req.BatchSize, ct);
    }
}
