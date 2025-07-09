using ColorSwatches.Business.Dtos.Request.Setting;
using ColorSwatches.Business.Dtos.Response.Common;
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

        var productOptionList = new List<ProductNode?>();

        var directory = Path.Combine(Directory.GetCurrentDirectory(), "JsonData", "ProductOptions", store.Domain + ".json");
        if (File.Exists(directory))
        {
            var productJsonData = await File.ReadAllTextAsync(directory);
            productOptionList = JsonConvert.DeserializeObject<List<ProductNode?>>(productJsonData);
        }
        else
        {
            var productOptions = await shopifyClient.GetAllProductOptionsTyped(store.Domain, store.Token);
            if(productOptions != null && productOptions.Data?.Products?.Edges?.Any() == true)
            {
                productOptionList = productOptions.Data?.Products?.Edges?.Select(e => e.Node).Where(x => x != null).ToList();

                if (!Directory.Exists(Path.Combine(Directory.GetCurrentDirectory(), "JsonData", "ProductOptions")))
                {
                    Directory.CreateDirectory(Path.Combine(Directory.GetCurrentDirectory(), "JsonData", "ProductOptions"));
                }

                await File.WriteAllTextAsync(directory, JsonConvert.SerializeObject(productOptionList));
            }
        }

        if (productOptionList != null && productOptionList.Any())
        {
            foreach (var product in productOptionList)
            {
                if (product == null || product.Options == null || !product.Options.Any()) continue;
                foreach (var option in product.Options)
                {
                    if (settings.Any(s => s.ProductOptionId == option.Id))
                    {
                        continue;
                    }
                    var setting = MapProductOptionToOptionSetting(storeId, product, option);
                    settings.Add(setting);
                }
            }
        }
                    
        return settings.ToList();
    }

    private OptionSetting MapProductOptionToOptionSetting(Guid storeId, ProductNode product, ProductOption option)
    {
        return new OptionSetting
        {
            Name = option.Name,
            ProductOptionId = option.Id.Replace("gid://shopify/ProductOption/", ""),
            ProductId = product.Id,
            StoreId = storeId,
            IsActive = false,
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
            Position = new string[] { },
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
        };
    }

    public async Task<List<OptionSetting>> UpsertOptionSetting(Guid storeId, UpsertOptionSettingRequest request)
    {
        var store = await session
            .Query<Store>()
            .Where(s => s.Id == storeId)
            .SingleOrDefaultAsync();

        store.ThenThrowIfNull(Exceptions.NotFound(storeId.ToString()));

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

        var jsonOptions = new JsonSerializerSettings
        {
            StringEscapeHandling = StringEscapeHandling.Default,
            ContractResolver = new CamelCasePropertyNamesContractResolver(),
            Formatting = Formatting.None,
        };

        var metafieldValue = JsonConvert.SerializeObject(
            request.OptionSettings,
            jsonOptions
        );

        var statusMetafield = new Dictionary<string, string>
        {
            { "key", "option_setting" },
            { "namespace", metafieldsConfiguration.Value.Namespace },
            { "value", metafieldValue },
            { "type", "json" },
            { "ownerId", $"gid://shopify/Shop/{storeId}" },
        };

        var requestBody = new
        {
            query = Metafields.MetafieldsSetMutation,
            variables = new { metafields = new List<dynamic> { statusMetafield } },
        };

        await shopifyClient.RequestToShopify(store.Domain, store.Token, requestBody);

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
