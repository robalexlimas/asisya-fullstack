namespace Asisya.Application.DTOs.Categories;

public sealed class CategoryListItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? PhotoUrl { get; set; }
}
