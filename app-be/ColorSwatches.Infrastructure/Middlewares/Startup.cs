using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;

namespace ColorSwatches.Infrastructure.Middlewares;

internal static class Startup
{
    internal static IServiceCollection AddExceptionMiddleware(
        this IServiceCollection services
    ) => services.AddScoped<GlobalExceptionMiddleware>();

    internal static IApplicationBuilder UseExceptionMiddleware(
        this IApplicationBuilder app
    ) => app.UseMiddleware<GlobalExceptionMiddleware>();
}
