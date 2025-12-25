using Testcontainers.PostgreSql;
using Npgsql;
using System.Text;

namespace Asisya.IntegrationTests.Fixtures;

public sealed class PostgresFixture : IAsyncLifetime
{
    private readonly PostgreSqlContainer _container;

    public string ConnectionString => _container.GetConnectionString();

    public PostgresFixture()
    {
        _container = new PostgreSqlBuilder()
            .WithImage("postgres:16")
            .WithDatabase("asisya_test")
            .WithUsername("asisya")
            .WithPassword("asisya")
            .Build();
    }

    public async Task InitializeAsync()
    {
        await _container.StartAsync();
        await ApplySqlScriptsAsync();
    }

    public async Task DisposeAsync()
    {
        await _container.DisposeAsync();
    }

    private async Task ApplySqlScriptsAsync()
    {
        var dbDir = FindDbDirectory();
        var files = Directory.GetFiles(dbDir, "*.sql")
            .OrderBy(f => Path.GetFileName(f), StringComparer.OrdinalIgnoreCase)
            .ToList();

        await using var conn = new NpgsqlConnection(ConnectionString);
        await conn.OpenAsync();

        foreach (var file in files)
        {
            var sql = await File.ReadAllTextAsync(file, Encoding.UTF8);
            if (string.IsNullOrWhiteSpace(sql)) continue;

            await using var cmd = new NpgsqlCommand(sql, conn);
            await cmd.ExecuteNonQueryAsync();
        }
    }

    private static string FindDbDirectory()
    {
        var dir = new DirectoryInfo(AppContext.BaseDirectory);

        while (dir is not null)
        {
            var candidate = Path.Combine(dir.FullName, "db");
            if (Directory.Exists(candidate))
                return candidate;

            dir = dir.Parent;
        }

        throw new DirectoryNotFoundException("Could not find 'db' directory at repo root.");
    }
}
