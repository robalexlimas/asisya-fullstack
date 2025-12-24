namespace Asisya.Api.Auth;

public sealed class JwtOptions
{
    public string Issuer { get; set; } = default!;
    public string Audience { get; set; } = default!;
    public string SigningKey { get; set; } = default!;
    public int ExpiresMinutes { get; set; }
    public string User { get; set; } = default!;
    public string Password { get; set; } = default!;
}
