﻿using Microsoft.Extensions.DependencyInjection;

namespace ColorSwatches.Infrastructure.Lifetimes;

internal static class Startup
{
    internal static IServiceCollection AddServices(this IServiceCollection services) =>
        services
            .AddServices(typeof(ITransientService), ServiceLifetime.Transient)
            .AddServices(typeof(ISingletonService), ServiceLifetime.Singleton)
            .AddServices(typeof(IScopedService), ServiceLifetime.Scoped);

    private static IServiceCollection AddServices(
        this IServiceCollection services,
        Type interfaceType,
        ServiceLifetime lifetime
    )
    {
        var interfaceTypes = AppDomain
            .CurrentDomain.GetAssemblies()
            .SelectMany(s => s.GetTypes())
            .Where(t =>
                interfaceType.IsAssignableFrom(t)
                && t is { IsClass: true, IsAbstract: false }
            )
            .Select(t => new
            {
                Service = t.GetInterfaces().FirstOrDefault(),
                Implementation = t,
            })
            .Where(t =>
                t.Service is not null && interfaceType.IsAssignableFrom(t.Service)
            );

        foreach (var type in interfaceTypes)
        {
            services.AddService(type.Service!, type.Implementation, lifetime);
        }

        return services;
    }

    private static IServiceCollection AddService(
        this IServiceCollection services,
        Type serviceType,
        Type implementationType,
        ServiceLifetime lifetime
    ) =>
        lifetime switch
        {
            ServiceLifetime.Transient => services.AddTransient(
                serviceType,
                implementationType
            ),
            ServiceLifetime.Scoped => services.AddScoped(serviceType, implementationType),
            ServiceLifetime.Singleton => services.AddSingleton(
                serviceType,
                implementationType
            ),
            _ => throw new ArgumentException("Invalid lifeTime", nameof(lifetime)),
        };
}
