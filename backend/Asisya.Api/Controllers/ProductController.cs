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

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        [FromQuery] Guid? categoryId = null,
        CancellationToken ct = default
    )
    {
        var (items, total) = await _service.GetPagedAsync(page, pageSize, search, categoryId, ct);

        return Ok(new { page, pageSize, total, items });
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id, CancellationToken ct)
    {
        var product = await _service.GetByIdAsync(id, ct);
        if (product is null) return NotFound();
        return Ok(product);
    }

    [Authorize]
    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(
    Guid id,
    [FromBody] UpdateProductRequest req,
    CancellationToken ct
)
    {
        var updated = await _service.UpdateAsync(id, req, ct);
        if (!updated) return NotFound();
        return NoContent();
    }

    [Authorize]
    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id, CancellationToken ct)
    {
        var deleted = await _service.DeleteAsync(id, ct);
        if (!deleted) return NotFound();
        return NoContent();
    }
}