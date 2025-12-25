using Asisya.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("jobs")]
public sealed class JobsController : ControllerBase
{
    private readonly IImportJobRepository _jobs;

    public JobsController(IImportJobRepository jobs)
    {
        _jobs = jobs;
    }

    [Authorize]
    [HttpGet("{id:guid}")]
    public async Task<IActionResult> Get(Guid id, CancellationToken ct)
    {
        var job = await _jobs.GetAsync(id, ct);
        if (job is null) return NotFound();
        return Ok(job);
    }
}
