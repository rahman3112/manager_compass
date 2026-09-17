using System.Text.Json.Serialization;
using ManagerCompass.Api.Services;
using Microsoft.Extensions.FileProviders;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddControllers()
    .AddJsonOptions(options => options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter()));
// Learn more about configuring OpenAPI at https://aka.ms/aspnet/openapi
builder.Services.AddOpenApi();

builder.Services.AddSingleton<SituationService>();
builder.Services.AddSingleton<GuardrailService>();

// Comma-separated list of production frontend origins, e.g. https://manager-compass.vercel.app
var allowedOrigins = (builder.Configuration["AllowedOrigins"] ?? "")
    .Split(',', StringSplitOptions.RemoveEmptyEntries | StringSplitOptions.TrimEntries);

const string FrontendCorsPolicy = "FrontendCorsPolicy";
builder.Services.AddCors(options =>
{
    options.AddPolicy(FrontendCorsPolicy, policy =>
    {
        policy.SetIsOriginAllowed(origin =>
              {
                  // Vite picks a different port whenever 5173 is taken, so allow any local dev origin.
                  if (Uri.TryCreate(origin, UriKind.Absolute, out var uri) && uri.IsLoopback)
                  {
                      return true;
                  }

                  return allowedOrigins.Any(allowed => string.Equals(origin, allowed, StringComparison.OrdinalIgnoreCase));
              })
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

// Serves the real policy/process documents that Documentation links point at
// (e.g. /assets/raw/payroll/FA-POL-07.docx), matching document paths in situations.json.
var rawAssetsPath = Path.Combine(app.Environment.ContentRootPath, "Assets", "raw");
if (Directory.Exists(rawAssetsPath))
{
    app.UseStaticFiles(new StaticFileOptions
    {
        FileProvider = new PhysicalFileProvider(rawAssetsPath),
        RequestPath = "/assets/raw",
    });
}

app.UseCors(FrontendCorsPolicy);

app.UseAuthorization();

app.MapControllers();

app.Run();
