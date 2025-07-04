using ColorSwatches.Entities.Entities;
using ColorSwatches.Models.Models.Webhook;
using ColorSwatches.Shared.Configurations;
using Marten;
using Marten.Patching;
using Microsoft.Extensions.Options;
using ShopifySharp;

namespace ColorSwatches.Business.WebhookService;

public class RegisterWebhookService(
    IOptions<CoreConfiguration> setting,
    IDocumentSession session
) : IRegisterWebhookService
{
    public async Task RegisterUninstallWebhook(RegisterWebhookModel store)
    {
        var serviceWebhook = new ShopifySharp.WebhookService(store.Domain, store.Token);
        var newWebhook = new Webhook
        {
            Address =
                $"https://{setting.Value.ShopifyAppUrl}/{setting.Value.UninstallWebhookCallbackUrl}",
            CreatedAt = DateTime.Now,
            Format = "json",
            Topic = "app/uninstalled",
        };
        var uninstallEvent = await serviceWebhook.CreateAsync(newWebhook);

        if (uninstallEvent is null)
            return;

        session
            .Patch<ShopifyWebhook>(s => s.StoreId == store.Id)
            .Set(s => s.UninstallAppWebhookId, uninstallEvent.Id);
        await session.SaveChangesAsync();
    }
}
