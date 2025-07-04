namespace ColorSwatches.Configurations;

internal static class Startup
{
    internal static WebApplicationBuilder AddConfigurations(
        this WebApplicationBuilder builder
    )
    {
        const string configurationsDirectory = "Configurations";
        var env = builder.Environment;
        builder
            .Configuration.AddJsonFile(
                $"{configurationsDirectory}/logger.{env.EnvironmentName}.json",
                optional: false,
                reloadOnChange: true
            )
            .AddJsonFile(
                $"{configurationsDirectory}/token.{env.EnvironmentName}.json",
                optional: false,
                reloadOnChange: true
            )
            .AddEnvironmentVariables();

        return builder;
    }
}
