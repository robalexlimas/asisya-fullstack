namespace Asisya.Application.DTOs.Products;

public sealed class ProductListItemDto
{
    public Guid Id { get; set; }
    public string Name { get; set; } = default!;
    public string Sku { get; set; } = default!;
    public decimal Price { get; set; }
    public string CategoryName { get; set; } = default!;
}
