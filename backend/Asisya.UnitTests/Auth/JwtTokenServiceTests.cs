using Asisya.Api.Auth;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Xunit;

namespace Asisya.UnitTests.Auth;

public sealed class JwtTokenServiceTests
{
    [Fact]
    public void GenerateToken_Returns_Valid_Jwt_With_Expected_Claims()
    {
        var opt = new JwtOptions
        {
            Issuer = "Asisya",
            Audience = "AsisyaClients",
            SigningKey = "super-secret-signing-key-1234567890",
            ExpiresMinutes = 60,
            User = "admin",
            Password = "admin123"
        };

        var svc = new JwtTokenService(opt);

        var (token, exp) = svc.CreateToken("admin");
        Assert.False(string.IsNullOrWhiteSpace(token));

        var handler = new JwtSecurityTokenHandler();

        var principal = handler.ValidateToken(token, new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = opt.Issuer,
            ValidAudience = opt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(opt.SigningKey)),
            ClockSkew = TimeSpan.FromSeconds(5)
        }, out _);

        Assert.Equal("admin", principal.FindFirstValue(ClaimTypes.Name));
        Assert.Equal("admin", principal.FindFirstValue(ClaimTypes.Role));
    }
}
