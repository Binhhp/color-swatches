using ColorSwatches.Business.Dtos.Response.Common;
using ColorSwatches.Entities.Entities;
using ColorSwatches.Infrastructure.Auth;
using ColorSwatches.Models.Dtos.Common;
using ColorSwatches.Shared.Configurations;
using Marten;
using Microsoft.Extensions.Options;
using Newtonsoft.Json.Linq;
using ShopifySharp;

namespace ColorSwatches.Business.CommonService;

public class CommonService(
    IDocumentSession session,
    ITokenService tokenService,
    IOptions<CoreConfiguration> options
) : ICommonService
{
    public async Task<ShopInfoResponse> GetShopData(string domain)
    {
        var shop = await session
            .Query<Store>()
            .Where(s => s.Domain == domain)
            .Select(s => new ShopDto
            {
                Domain = s.Domain,
                Active = s.Active,
                Currency = s.Currency,
                Id = s.Id,
            })
            .SingleOrDefaultAsync();

        shop.ThenThrowIfNull(Exceptions.NotFound(domain));

        var token = tokenService.GenerateJwt(domain, shop.Id);

        shop.IsSettingOption = session
            .Query<OptionSetting>()
            .Any();

        return new ShopInfoResponse(shop, token);
    }

    public async Task<bool> CheckThemeByStore(Guid storeId)
    {
        try
        {
            var store = await session
                .Query<Store>()
                .Where(s => s.Id == storeId)
                .Select(s => new { s.Domain, s.Token })
                .SingleAsync();

            var themeService = new ThemeService(store.Domain, store.Token);
            var theme = await themeService.ListAsync();
            var activeTheme = theme.FirstOrDefault(p => p.Role == "main");

            if (activeTheme is null)
                return false;

            var assetService = new AssetService(store.Domain, store.Token);
            var settingAsset = await assetService.GetAsync(
                activeTheme.Id!.Value,
                "config/settings_data.json"
            );

            var data = JObject.Parse(settingAsset.Value);
            var block = data.SelectToken("current.blocks." + options.Value.AppBlockId);

            return block is not null && block["disabled"]!.ToString() == "False";
        }
        catch (Exception)
        {
            return true;
        }
    }
}
