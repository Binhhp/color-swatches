namespace ColorSwatches.Entities.Entities;

public class ShopifyWebhook
{
    public Guid StoreId { get; set; }
    public long? UninstallAppWebhookId { get; set; } = null;
}
