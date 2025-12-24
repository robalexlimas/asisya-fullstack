using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.OpenApi.Models;
using Microsoft.IdentityModel.Tokens;
using Asisya.Api.Auth;
using Asisya.Api.Middleware;
using Asisya.Application.Interfaces;
using Asisya.Infrastructure.Database;
using Asisya.Infrastructure.Repositories;
using System.Text;


var builder = WebApplication.CreateBuilder(args);

// Middleware
builder.Services.AddTransient<ExceptionHandlingMiddleware>();

// JWT Authentication
var jwtOpt = builder.Configuration.GetSection("Jwt").Get<JwtOptions>()
            ?? throw new InvalidOperationException("Missing Jwt config");
builder.Services.AddSingleton(jwtOpt);
builder.Services.AddSingleton<JwtTokenService>();

builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = jwtOpt.Issuer,
            ValidAudience = jwtOpt.Audience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtOpt.SigningKey))
        };
    });

builder.Services.AddAuthorization();

// MVC Controllers
builder.Services.AddControllers();

// Repositories
builder.Services.AddScoped<ICategoryRepository, CategoryRepository>();

// Swagger
builder.Services.AddEndpointsApiExplorer();

builder.Services.AddSwaggerGen(c =>
{
    c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Name = "Authorization",
        Type = SecuritySchemeType.Http,
        Scheme = "bearer",
        BearerFormat = "JWT",
        In = ParameterLocation.Header,
        Description = "Enter: Bearer {token}"
    });

    c.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                }
            },
            Array.Empty<string>()
        }
    });
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

app.UseMiddleware<ExceptionHandlingMiddleware>();

app.MapControllers();

app.UseAuthentication();
app.UseAuthorization();

app.Run();
