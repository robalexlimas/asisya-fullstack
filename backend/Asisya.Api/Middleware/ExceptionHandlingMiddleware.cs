using System.Net;
using System.Text.Json;
using Asisya.Api.Errors;
using Npgsql;

namespace Asisya.Api.Middleware;

public sealed class ExceptionHandlingMiddleware : IMiddleware
{
    private readonly IHostEnvironment _env;
    private readonly ILogger<ExceptionHandlingMiddleware> _logger;

    public ExceptionHandlingMiddleware(IHostEnvironment env, ILogger<ExceptionHandlingMiddleware> logger)
    {
        _env = env;
        _logger = logger;
    }

    public async Task InvokeAsync(HttpContext context, RequestDelegate next)
    {
        try
        {
            await next(context);
        }
        catch (PostgresException ex)
        {
            _logger.LogError(ex, "Postgres error. SqlState={SqlState}", ex.SqlState);

            // Mapeo de errores comunes
            var (status, code, message) = ex.SqlState switch
            {
                PostgresErrorCodes.UniqueViolation =>
                    (HttpStatusCode.Conflict, "unique_violation", "The resource already exists."),

                PostgresErrorCodes.ForeignKeyViolation =>
                    (HttpStatusCode.BadRequest, "foreign_key_violation", "Invalid reference to a related resource."),

                PostgresErrorCodes.NotNullViolation =>
                    (HttpStatusCode.BadRequest, "not_null_violation", "A required field is missing."),

                _ =>
                    (HttpStatusCode.InternalServerError, "db_error", "A database error occurred.")
            };

            await WriteError(context, status, code, message, _env.IsDevelopment() ? ex.MessageText : null);
        }
        catch (ArgumentException ex)
        {
            _logger.LogWarning(ex, "Validation error");
            await WriteError(context, HttpStatusCode.BadRequest, "validation_error", ex.Message, null);
        }
        catch (Exception ex)
        {
            _logger.LogError(ex, "Unhandled error");
            await WriteError(context, HttpStatusCode.InternalServerError, "server_error", "Unexpected server error.", _env.IsDevelopment() ? ex.Message : null);
        }
    }

    private static async Task WriteError(HttpContext context, HttpStatusCode status, string code, string message, string? detail)
    {
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        var traceId = context.TraceIdentifier;

        var payload = new ApiErrorResponse(
            Code: code,
            Message: message,
            Detail: detail,
            TraceId: traceId
        );

        await context.Response.WriteAsync(JsonSerializer.Serialize(payload));
    }
}
