using ColorSwatches.Infrastructure.Lifetimes;
using ColorSwatches.Models.Models.Webhook;

namespace ColorSwatches.Business.WebhookService;

public interface IRegisterWebhookService : IScopedService
{
    Task RegisterUninstallWebhook(RegisterWebhookModel store);
}
