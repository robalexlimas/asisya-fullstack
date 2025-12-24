using Microsoft.OpenApi.Models;
using Asisya.Api.Auth;
using Asisya.Infrastructure.Database;


var builder = WebApplication.CreateBuilder(args);

// JWT Authentication
var jwtOpt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()
            ?? throw new InvalidOperationException("Missing Jwt config");
builder.Services.AddSingleton(jwtOpt);
builder.Services.AddSingleton<JwtTokenService>();

// MVC Controllers
builder.Services.AddControllers();

// Swagger
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen(c =>
{
    c.SwaggerDoc("v1", new OpenApiInfo { Title = "Asisya API", Version = "v1" });
});

var cs = builder.Configuration.GetConnectionString("Default")
         ?? throw new InvalidOperationException("Missing ConnectionStrings:Default");

builder.Services.AddSingleton<IDbConnectionFactory>(
    _ => new NpgsqlConnectionFactory(cs)
);

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.MapControllers();

app.Run();
