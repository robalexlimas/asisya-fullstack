using Asisya.Application.DTOs.Products;
using Asisya.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("product")]
public class ProductController : ControllerBase
{
    private readonly ProductService _service;

    public ProductController(ProductService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpPost]
    public async Task<IActionResult> Generate([FromBody] GenerateProductsRequest req, CancellationToken ct)
    {
        var inserted = await _service.GenerateAsync(req, ct);
        return Ok(new { inserted });
    }
}
