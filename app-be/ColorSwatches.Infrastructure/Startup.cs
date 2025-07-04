using ColorSwatches.Infrastructure.Auth;
using ColorSwatches.Infrastructure.Lifetimes;
using ColorSwatches.Infrastructure.Middlewares;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace ColorSwatches.Infrastructure;

public static class Startup
{
    public static IServiceCollection AddInfrastructure(
        this IServiceCollection services,
        IConfiguration config
    )
    {
        return services.AddJwtAuth().AddExceptionMiddleware().AddServices();
    }

    public static IApplicationBuilder UseInfrastructure(
        this IApplicationBuilder builder,
        IConfiguration config
    ) => builder.UseExceptionMiddleware();
}
