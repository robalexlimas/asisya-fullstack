namespace Asisya.Application.Interfaces;

public interface IProductRepository
{
    Task<int> GenerateAsync(int count, Guid[] categoryIds, int batchSize, CancellationToken ct);
}
