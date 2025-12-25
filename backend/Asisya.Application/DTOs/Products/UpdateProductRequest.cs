namespace Asisya.Application.DTOs.Products;

public sealed class UpdateProductRequest
{
    public string Name { get; set; } = default!;
    public decimal Price { get; set; }
    public Guid CategoryId { get; set; }
}
