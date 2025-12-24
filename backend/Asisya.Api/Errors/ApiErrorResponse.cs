namespace Asisya.Api.Errors;

public sealed record ApiErrorResponse(
    string Code,
    string Message,
    string? Detail = null,
    string? TraceId = null
);
