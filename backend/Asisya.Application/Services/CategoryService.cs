using Asisya.Application.DTOs.Categories;
using Asisya.Application.Interfaces;

namespace Asisya.Application.Services;

public sealed class CategoryService
{
    private readonly ICategoryRepository _repo;

    public CategoryService(ICategoryRepository repo)
    {
        _repo = repo;
    }

    public Task<CategoryDto> CreateAsync(CreateCategoryRequest req, CancellationToken ct)
    {
        if (string.IsNullOrWhiteSpace(req.Name))
            throw new ArgumentException("Name is required");

        return _repo.CreateAsync(req, ct);
    }

    public Task<(IReadOnlyList<CategoryListItemDto> Items, long Total)> GetPagedAsync(
    int page,
    int pageSize,
    string? search,
    CancellationToken ct
)
    {
        if (page <= 0) page = 1;
        if (pageSize <= 0) pageSize = 20;
        if (pageSize > 100) pageSize = 100;

        search = string.IsNullOrWhiteSpace(search) ? null : search.Trim();

        return _repo.GetPagedAsync(page, pageSize, search, ct);
    }
}
