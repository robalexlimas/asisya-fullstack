using Asisya.Application.DTOs.Categories;
using Asisya.Application.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("category")]
public class CategoryController : ControllerBase
{
    private readonly CategoryService _service;

    public CategoryController(CategoryService service)
    {
        _service = service;
    }

    [Authorize]
    [HttpPost]
    public async Task<ActionResult<CategoryDto>> Create(
        [FromBody] CreateCategoryRequest req,
        CancellationToken ct
    )
    {
        var created = await _service.CreateAsync(req, ct);
        return Ok(created);
    }

    [Authorize]
    [HttpGet]
    public async Task<IActionResult> GetPaged(
        [FromQuery] int page = 1,
        [FromQuery] int pageSize = 20,
        [FromQuery] string? search = null,
        CancellationToken ct = default
    )
    {
        var (items, total) = await _service.GetPagedAsync(page, pageSize, search, ct);
        return Ok(new { page, pageSize, total, items });
    }
}
