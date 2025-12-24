using Asisya.Application.DTOs.Categories;

namespace Asisya.Application.Interfaces;

public interface ICategoryRepository
{
    Task<CategoryDto> CreateAsync(CreateCategoryRequest req, CancellationToken ct);
}
