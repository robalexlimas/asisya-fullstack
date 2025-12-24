namespace Asisya.Application.DTOs.Categories;

public sealed record CategoryDto(
    Guid Id,
    string Name,
    string? PhotoUrl,
    DateTimeOffset CreatedAt
);
