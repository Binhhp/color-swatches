using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;

namespace ColorSwatches.Infrastructure.Auth;

internal static class Startup
{
    internal static IServiceCollection AddJwtAuth(this IServiceCollection services)
    {
        services.AddOptions<TokenSetting>().BindConfiguration(nameof(TokenSetting));

        services.AddSingleton<
            IConfigureOptions<JwtBearerOptions>,
            ConfigureJwtBearerOptions
        >();

        return services
            .AddAuthentication(x =>
            {
                x.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                x.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(JwtBearerDefaults.AuthenticationScheme, null!)
            .Services;
    }
}
