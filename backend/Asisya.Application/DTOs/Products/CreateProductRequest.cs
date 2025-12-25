namespace Asisya.Application.DTOs.Products;

public sealed record CreateProductRequest(
    string Name,
    string Sku,
    decimal Price,
    Guid CategoryId
);
