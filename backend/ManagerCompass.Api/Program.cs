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
builder.Services.AddSingleton<PlanService>();
builder.Services.AddSingleton<TaskService>();
builder.Services.AddSingleton<ResourceLibraryService>();

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

// No app.UseHttpsRedirection() here: the container only listens on plain HTTP
// (ASPNETCORE_URLS=http://+:8080 in the Dockerfile) and TLS is terminated by the
// host platform's edge/proxy in front of it, so redirecting to HTTPS inside the
// container has nothing to redirect to and can break platform health checks.

// Serves the built frontend (wwwroot, produced by `npm run build` and copied in
// by the Dockerfile) so the whole app is one deployable unit on one origin.
app.UseDefaultFiles();
app.UseStaticFiles();

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
