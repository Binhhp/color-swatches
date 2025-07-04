using Hangfire;
using Hangfire.PostgreSql;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.Configuration;

namespace ColorSwatches.Infrastructure.BackgroundJob;

public static class Extensions
{
    public static void RegisterHangfire(this WebApplicationBuilder builder)
    {
        builder.Services.AddHangfire(config =>
            config
                .UseSimpleAssemblyNameTypeSerializer()
                .UseRecommendedSerializerSettings()
                .UsePostgreSqlStorage(c =>
                    c.UseNpgsqlConnection(
                        builder.Configuration.GetConnectionString("Hangfire")
                            ?? string.Empty
                    )
                )
        );

        builder.Services.AddHangfireServer(options =>
        {
            options.WorkerCount = Environment.ProcessorCount;
            options.Queues = ["critical", "default"];
        });

        GlobalJobFilters.Filters.Add(
            new AutomaticRetryAttribute
            {
                Attempts = 5,
                DelaysInSeconds = [10, 30, 60, 120, 300],
                OnAttemptsExceeded = AttemptsExceededAction.Fail,
            }
        );

        GlobalJobFilters.Filters.Add(new ExpirationTimeFilter(TimeSpan.FromDays(1)));
    }
}
