namespace ColorSwatches.Infrastructure.Logging;

public class LoggerSetting
{
    public string AppName { get; set; } = "Orichi.Core.WebApi";
    public bool WriteToFile { get; set; } = true;
    public bool StructuredConsoleLogging { get; set; } = true;
    public string MinimumLogLevel { get; set; } = "Information";
    public string Path { get; set; } = "Logs/logs.json";
}
