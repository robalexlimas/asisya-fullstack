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
}
