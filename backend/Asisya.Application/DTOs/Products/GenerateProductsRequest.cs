namespace Asisya.Application.DTOs.Products;

public sealed class GenerateProductsRequest
{
    public int Count { get; set; }
    public int BatchSize { get; set; } = 5000;
    public Guid[] CategoryIds { get; set; } = Array.Empty<Guid>();
}
