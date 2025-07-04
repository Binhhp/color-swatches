using ColorSwatches.Business.Dtos.Request.Setting;
using ColorSwatches.Business.Dtos.Response.Setting;
using ColorSwatches.Business.ShopifyClient;
using ColorSwatches.Business.ShopifyClient.Mutations;
using ColorSwatches.Entities.Entities;
using ColorSwatches.Models.Models.Setting;
using ColorSwatches.Shared.Configurations;
using Marten;
using Marten.Patching;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using Newtonsoft.Json.Serialization;

namespace ColorSwatches.Business.SettingService;

public class SettingService(
    IDocumentSession session,
    IShopifyClient shopifyClient,
    IOptions<MetafieldsConfiguration> metafieldsConfiguration
) : ISettingService
{
    public async Task<List<OptionSetting>> GetOptionSetting(Guid storeId)
    {
        var store = await session
            .Query<Store>()
            .Where(s => s.Id == storeId)
            .SingleOrDefaultAsync();

        store.ThenThrowIfNull(Exceptions.NotFound(storeId.ToString()));

        var settings = (await session
            .Query<OptionSetting>()
            .Where(s => s.StoreId == storeId)
            .OrderBy(s => s.DateCreated)
            .ToListAsync()).ToList();

        var productOptions = await shopifyClient.GetAllProductOptionsTyped(store.Domain, store.Token);
        if (productOptions != null)
        {
            var productList = productOptions.Data?.Products?.Edges?.Select(e => e.Node).Where(x => x != null).ToList();
            foreach (var product in productList)
            {
                foreach (var option in product.Options)
                {
                    if (settings.Any(s => s.ProductOptionId == option.Id))
                    {
                        continue;
                    }

                    settings.Add(new OptionSetting
                    {
                        ProductOptionId = option.Id,
                        ProductId = product.Id,
                        StoreId = storeId,
                        IsActive = false,
                        Template = OptionSettingTemplate.Swatch,
                        Style = OptionSettingStyle.Color,
                        Animation = new OptionSettingAnimation
                        {
                            HoverAnimation = OptionSettingHoverAnimation.Label,
                            OutOfStock = OptionSettingOutOfStock.StrikeOut,
                        },
                        Id = Guid.NewGuid(),
                        Values = option.Values.Select(v => new OptionValue
                        {
                            Value = v,
                            Color = "#ffffff",
                            Image = "",
                            Style = OptionSettingStyleValue.Circle,
                        }).ToArray(),
                        Position = new string[] {
                            OptionSettingPosition.Homepage,
                            OptionSettingPosition.ProductPage,
                            OptionSettingPosition.CollectionPage,
                        },
                        Appearance = new OptionSettingAppearance
                        {
                            Height = "30px",
                            Width = "30px",
                            Spacing = "5px",
                            BorderRadius = "5px",
                            DefaultColor = "#000000",
                            SelectedColor = "#000000",
                            HoverColor = "#000000",
                        },
                    });
                }
            }
        }

        return settings.ToList();
    }

    public async Task<List<OptionSetting>> UpsertOptionSetting(Guid storeId, UpsertOptionSettingRequest request)
    {
        var optionSettings = await session.Query<OptionSetting>().Where(s => s.StoreId == storeId).ToListAsync();
        foreach (var item in request.OptionSettings)
        {
            if (optionSettings.Any(s => s.Id == item.Id))
            {
                item.DateCreated = DateTime.UtcNow;
                item.DateModified = DateTime.UtcNow;
                session.Store(item);
                continue;
            }

            item.DateCreated = DateTime.UtcNow;
            item.DateModified = DateTime.UtcNow;
            session.Insert(item);
        }

        await session.SaveChangesAsync();

        return request.OptionSettings;
    }

    public async Task<AppStatusResponse> GetAppStatus(Guid storeId)
    {
        var setting = await session
            .Query<Setting>()
            .SingleAsync(s => s.StoreId == storeId);
        return new AppStatusResponse { Status = setting.Status };
    }

    public async Task<bool> UpdateAppStatus(Guid storeId, UpdateAppStatusRequest request)
    {
        session
            .Patch<Setting>(s => s.StoreId == storeId)
            .Set(s => s.Status, request.Status);
        await session.SaveChangesAsync();

        var store = await session
            .Query<Store>()
            .Where(s => s.Id == storeId)
            .Select(s => new
            {
                s.Domain,
                s.Token,
                s.ShopId,
            })
            .SingleAsync();

        await UpsertAppStatusMetafield(
            new UpsertAppStatusModel(
                metafieldsConfiguration.Value.AppStatus,
                metafieldsConfiguration.Value.Namespace,
                request.Status,
                store.ShopId,
                store.Domain,
                store.Token
            )
        );
        return true;
    }

    public async Task<bool> UpsertAppStatusMetafield(UpsertAppStatusModel model)
    {
        var jsonOptions = new JsonSerializerSettings
        {
            StringEscapeHandling = StringEscapeHandling.Default,
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.None,
        };

        var metafieldValue = JsonConvert.SerializeObject(
            new { model.Status },
            jsonOptions
        );

        var statusMetafield = new Dictionary<string, string>
        {
            { "key", model.Key },
            { "namespace", model.Namespace },
            { "value", metafieldValue },
            { "type", "json" },
            { "ownerId", $"gid://shopify/Shop/{model.ShopId}" },
        };

        var requestBody = new
        {
            query = Metafields.MetafieldsSetMutation,
            variables = new { metafields = new List<dynamic> { statusMetafield } },
        };

        await shopifyClient.RequestToShopify(model.Domain, model.Token, requestBody);

        return true;
    }
}
