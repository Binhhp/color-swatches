using ColorSwatches.Business.SettingService;
using ColorSwatches.Business.ShopifyClient;
using ColorSwatches.Business.WebhookService;
using ColorSwatches.Entities.Entities;
using ColorSwatches.Models.Models.Setting;
using ColorSwatches.Models.Models.Webhook;
using ColorSwatches.Shared.Configurations;
using Marten;
using Microsoft.Extensions.Options;

namespace ColorSwatches.Business.HomeService;

public class HomeService(
    IDocumentSession session,
    IShopifyClient shopifyClient,
    IOptions<CoreConfiguration> options,
    IOptions<MetafieldsConfiguration> metafieldsConfiguration,
    IRegisterWebhookService registerWebhookService,
    IUninstallStoreWebhookService uninstallStoreWebhookService,
    ISettingService settingService
) : IHomeService
{
    public async Task<string> Auth(string domain, string code)
    {
        var token = await shopifyClient.FetchShopifyAccessToken(domain, code);
        var shopInfo = await shopifyClient.GetShopInformation(domain, token);

        var storeExist = await session
            .Query<Store>()
            .FirstOrDefaultAsync(s => s.Domain.ToLower() == domain.ToLower());

        if (storeExist is not null)
        {
            await uninstallStoreWebhookService.UninstallStore(storeExist.ShopId);
        }

        var newStore = new Store
        {
            Domain = domain,
            Active = true,
            ShopId = shopInfo.Id.ToString() ?? "",
            Token = token,
            Country = shopInfo.Country ?? string.Empty,
            Email = shopInfo.Email ?? string.Empty,
            Phone = shopInfo.Phone ?? string.Empty,
            InstallDate = DateTime.UtcNow,
            ShopifyPlan = shopInfo.PlanName ?? string.Empty,
            PublicDomain = shopInfo.Domain ?? string.Empty,
            MoneyWithCurrencyFormat = shopInfo.MoneyWithCurrencyFormat ?? string.Empty,
            Currency = shopInfo.Currency ?? string.Empty,
        };

        session.Store(newStore);

        var setting = new Setting { StoreId = newStore.Id, Status = true };
        session.Store(setting);

        var newWebhook = new ShopifyWebhook
        {
            StoreId = newStore.Id,
            UninstallAppWebhookId = null,
        };

        session.Store(newWebhook);

        await settingService.UpsertAppStatusMetafield(
            new UpsertAppStatusModel(
                metafieldsConfiguration.Value.AppStatus,
                metafieldsConfiguration.Value.Namespace,
                true,
                newStore.ShopId,
                newStore.Domain,
                newStore.Token
            )
        );

        await session.SaveChangesAsync();

        var registerWebhookModel = new RegisterWebhookModel(
            newStore.Id,
            newStore.Domain,
            newStore.Token
        );
        await registerWebhookService.RegisterUninstallWebhook(registerWebhookModel);

        return $"https://{domain}/admin/apps/{options.Value.ShopifyAppHandle}";
    }
}
