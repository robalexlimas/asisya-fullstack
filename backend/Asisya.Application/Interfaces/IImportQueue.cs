namespace Asisya.Application.Interfaces;

public sealed record ImportJobMessage(Guid JobId, string FilePath);

public interface IImportQueue
{
    ValueTask EnqueueAsync(ImportJobMessage msg, CancellationToken ct);
    ValueTask<ImportJobMessage> DequeueAsync(CancellationToken ct);
}
