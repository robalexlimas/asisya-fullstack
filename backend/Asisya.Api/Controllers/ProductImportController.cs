using Asisya.Application.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Asisya.Api.Controllers;

[ApiController]
[Route("products/import")]
public sealed class ProductImportController : ControllerBase
{
    private readonly IImportJobRepository _jobs;
    private readonly IImportQueue _queue;

    public ProductImportController(IImportJobRepository jobs, IImportQueue queue)
    {
        _jobs = jobs;
        _queue = queue;
    }

    [Authorize]
    [HttpPost]
    [RequestSizeLimit(200_000_000)] // 200MB (ajusta si quieres)
    public async Task<IActionResult> CreateJob([FromForm] IFormFile file, CancellationToken ct)
    {
        if (file is null || file.Length == 0)
            return BadRequest(new { message = "File is required." });

        var jobId = Guid.NewGuid();

        Directory.CreateDirectory("storage/imports");
        var safeName = Path.GetFileName(file.FileName);
        var path = Path.Combine("storage/imports", $"{jobId}__{safeName}");

        await using (var fs = System.IO.File.Create(path))
        {
            await file.CopyToAsync(fs, ct);
        }

        await _jobs.CreateAsync(jobId, type: "products_csv", filename: safeName, ct);
        await _queue.EnqueueAsync(new ImportJobMessage(jobId, path), ct);

        return Accepted(new { jobId, status = "Queued" });
    }
}
