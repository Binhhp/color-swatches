using ColorSwatches.Infrastructure.Lifetimes;

namespace ColorSwatches.Business.WebhookService;

public interface IUninstallStoreWebhookService : IScopedService
{
    Task UninstallStore(string shopifyId);
}
