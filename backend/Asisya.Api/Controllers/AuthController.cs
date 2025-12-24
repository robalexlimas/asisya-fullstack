using Asisya.Api.Auth;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

public sealed record LoginRequest(string Username, string Password);
public sealed record LoginResponse(string Token, int ExpiresIn);

[ApiController]
[Route("auth")]
public class AuthController : ControllerBase
{
    private readonly JwtOptions _opt;
    private readonly JwtTokenService _tokens;

    public AuthController(JwtOptions opt, JwtTokenService tokens)
    {
        _opt = opt;
        _tokens = tokens;
    }

    [HttpPost("login")]
    public IActionResult Login([FromBody] LoginRequest req)
    {
        if (req.Username != _opt.User || req.Password != _opt.Password)
            return Unauthorized(new { message = "Invalid credentials" });

        var (token, exp) = _tokens.CreateToken(req.Username);
        return Ok(new LoginResponse(token, exp));
    }
}
