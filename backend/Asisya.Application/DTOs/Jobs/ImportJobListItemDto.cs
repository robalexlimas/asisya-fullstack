namespace Asisya.Application.DTOs.Jobs;

public sealed class ImportJobListItemDto
{
    public Guid JobId { get; init; }
    public string Status { get; init; } = default!;
    public long TotalRows { get; init; }
    public long ProcessedRows { get; init; }
    public long InsertedRows { get; init; }
    public long FailedRows { get; init; }
    public string? Error { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
}
