using Asisya.Application.DTOs.Jobs;

namespace Asisya.Application.Interfaces;

public interface IImportJobRepository
{
    Task CreateAsync(Guid jobId, string type, string filename, CancellationToken ct);
    Task MarkProcessingAsync(Guid jobId, CancellationToken ct);
    Task UpdateProgressAsync(Guid jobId, long processed, long inserted, long failed, long total, CancellationToken ct);
    Task MarkCompletedAsync(Guid jobId, CancellationToken ct);
    Task MarkFailedAsync(Guid jobId, string error, CancellationToken ct);
    Task<ImportJobDto?> GetAsync(Guid jobId, CancellationToken ct);
    Task<(IReadOnlyList<ImportJobDto> Items, long Total)> GetPagedAsync(
        int page,
        int pageSize,
        CancellationToken ct
    );
}
