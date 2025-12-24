using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Database;
using Dapper;

namespace Asisya.Infrastructure.Repositories;

public sealed class ProductRepository : IProductRepository
{
    private readonly IDbConnectionFactory _db;

    public ProductRepository(IDbConnectionFactory db)
    {
        _db = db;
    }

    public async Task<int> GenerateAsync(int count, Guid[] categoryIds, int batchSize, CancellationToken ct)
    {
        const string sql = "SELECT sp_generate_products(@Count, @CategoryIds::uuid[], @BatchSize);";

        using var conn = _db.CreateConnection();

        return await conn.ExecuteScalarAsync<int>(
            new CommandDefinition(
                sql,
                new
                {
                    Count = count,
                    CategoryIds = categoryIds,
                    BatchSize = batchSize
                },
                cancellationToken: ct
            )
        );
    }
}
