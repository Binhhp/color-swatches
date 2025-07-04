using ColorSwatches.Entities.Entities;
using Marten;

namespace ColorSwatches.Business.WebhookService;

public class UninstallStoreWebhookService(IDocumentSession session)
    : IUninstallStoreWebhookService
{
    public async Task UninstallStore(string shopifyId)
    {
        var store = await session
            .Query<Store>()
            .Where(s => s.ShopId == shopifyId)
            .SingleOrDefaultAsync();

        if (store is null)
            return;

        session.Delete(store);
        await session.SaveChangesAsync();
    }
}
