namespace ColorSwatches.Shared.Configurations;

public class CoreConfiguration
{
    public required string ClientId { get; set; }
    public required string ClientSecret { get; set; }
    public required string ShopifyAppHandle { get; set; }
    public required string Scope { get; set; }
    public required string ShopifyAppUrl { get; set; }
    public required string ShopifyApiVersion { get; set; }
    public required string UninstallWebhookCallbackUrl { get; set; }
    public required string AppBlockId { get; set; }
}
