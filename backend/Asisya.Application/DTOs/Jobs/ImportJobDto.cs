namespace Asisya.Application.DTOs.Jobs;

public sealed class ImportJobDto
{
    public Guid JobId { get; set; }
    public string Status { get; set; } = default!;
    public long TotalRows { get; set; }
    public long ProcessedRows { get; set; }
    public long InsertedRows { get; set; }
    public long FailedRows { get; set; }
    public DateTime? StartedAt { get; set; }
    public DateTime? FinishedAt { get; set; }
    public string? Error { get; set; }
}
