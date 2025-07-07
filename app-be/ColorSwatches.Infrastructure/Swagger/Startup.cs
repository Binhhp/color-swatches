using Microsoft.Extensions.DependencyInjection;
using Microsoft.OpenApi.Models;

namespace ColorSwatches.Infrastructure.Swagger;

public static class Startup
{
    public static IServiceCollection AddSwagger(this IServiceCollection services)
    {
        return services.AddSwaggerGen(option =>
        {
            option.SwaggerDoc(
                "v1",
                new OpenApiInfo
                {
                    Title = "Color Swatches API",
                    Version = "v1",
                    Description = "An ASP.NET Core Web API for managing color swatches",
                    Contact = new OpenApiContact
                    {
                        Name = "Orichi eCommerce",
                        Url = new Uri("https://orichi.info/"),
                    },
                }
            );
            option.AddSecurityDefinition(
                "Bearer",
                new OpenApiSecurityScheme
                {
                    In = ParameterLocation.Header,
                    Description = "Please enter a valid token",
                    Name = "Authorization",
                    Type = SecuritySchemeType.Http,
                    BearerFormat = "JWT",
                    Scheme = "Bearer",
                }
            );
            option.AddSecurityRequirement(
                new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer",
                            },
                        },
                        Array.Empty<string>()
                    },
                }
            );
        });
    }
}
