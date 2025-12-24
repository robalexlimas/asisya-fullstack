namespace Asisya.Application.DTOs.Categories;

public sealed class CategoryDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string? PhotoUrl { get; set; }
    public DateTime CreatedAt { get; set; }
}
