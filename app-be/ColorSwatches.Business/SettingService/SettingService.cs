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
using Serilog;

namespace ColorSwatches.Business.SettingService;

public class SettingService(
    IDocumentSession session,
    IShopifyClient shopifyClient,
    IOptions<MetafieldsConfiguration> metafieldsConfiguration,
    ILogger logger
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
            if (productOptions != null && productOptions.Data?.Products?.Edges?.Any() == true)
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
                    if (settings.Any(s => option.Id.Contains(s.ProductOptionId)))
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
                Height = "50",
                Width = "50",
                Spacing = "5",
                BorderRadius = "5",
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

        var optionSettings = session.Query<OptionSetting>().Where(s => s.StoreId == storeId).ToList();

        if (optionSettings.Any())
        {
            foreach(var item in optionSettings)
            {
                session.Delete(item);
            }
            await session.SaveChangesAsync();
        }
        
        foreach (var item in request.OptionSettings)
        {
            var existingItem = optionSettings.FirstOrDefault(s => s.ProductOptionId == item.ProductOptionId);
            if (existingItem != null)
            {
                item.DateCreated = existingItem.DateCreated;
                item.DateModified = DateTime.UtcNow;
                item.Id = existingItem.Id;
                optionSettings.Add(item);
                continue;
            }

            item.DateCreated = DateTime.UtcNow;
            item.DateModified = DateTime.UtcNow;
            optionSettings.Add(item);
        }

        session.Store(optionSettings.ToArray());
        await session.SaveChangesAsync();

        var metafieldValue = JsonConvert.SerializeObject(
            optionSettings,
            new JsonSerializerSettings
            {
                StringEscapeHandling = StringEscapeHandling.Default,
                ContractResolver = new CamelCasePropertyNamesContractResolver(),
                Formatting = Formatting.None,
            }
        );

        var optionSettingMetafield = new Dictionary<string, string>
        {
            { "key", "option_setting" },
            { "namespace", metafieldsConfiguration.Value.Namespace },
            { "value", metafieldValue },
            { "type", "json" },
            { "ownerId", $"gid://shopify/Shop/{store.ShopId}" },
        };

        var requestBody = new
        {
            query = Metafields.MetafieldsSetMutation,
            variables = new { metafields = new List<dynamic> { optionSettingMetafield } },
        };

        try
        {
            await shopifyClient.RequestToShopify(store.Domain, store.Token, requestBody);
        }
        catch(Exception ex)
        {
            logger.Error(ex, $"Could not save setting to shopify metafields for store {store}");
        }

        return request.OptionSettings;
    }

    public async Task<List<OptionSetting>> DeleteOptionSetting(Guid storeId, List<Guid> optionSettingIds)
    {
        var store = await session
            .Query<Store>()
            .Where(s => s.Id == storeId)
            .SingleOrDefaultAsync();

        store.ThenThrowIfNull(Exceptions.NotFound(storeId.ToString()));

        var optionSettings = session.Query<OptionSetting>().Where(s => s.StoreId == storeId).ToList();

        if (!optionSettings.Any())
        {
            return optionSettings;
        }

        var optionNeedToDelete = optionSettings.Where(x => optionSettingIds.Contains(x.Id)).ToList();
        
        if (!optionNeedToDelete.Any())
        {
            return optionSettings;
        }

        foreach (var optionSetting in optionNeedToDelete)
        {
            session.Delete(optionSetting);
            optionSettings.Remove(optionSetting);
        }

        await session.SaveChangesAsync();

        if (!optionSettings.Any())
        {
            await DeleteMetafieldsShop();
            return optionSettings;
        }

        await UpdateMetafieldsShop();

        async Task DeleteMetafieldsShop()
        {
            await shopifyClient.RemoveMetaDataFieldAsync(new List<MetadataFieldDelete>
            {
                new MetadataFieldDelete(
                    metafieldsConfiguration.Value.Namespace,
                    "option_setting"
                    )
            }, 
            store.Domain, 
            store.Token, 
            Convert.ToInt64(store.ShopId));
        }

        async Task UpdateMetafieldsShop()
        {
            var metafieldValue = JsonConvert.SerializeObject(
                optionSettings,
                new JsonSerializerSettings
                {
                    StringEscapeHandling = StringEscapeHandling.Default,
                    ContractResolver = new CamelCasePropertyNamesContractResolver(),
                    Formatting = Formatting.None,
                }
            );

            var optionSettingMetafield = new Dictionary<string, string>
            {
                { "key", "option_setting" },
                { "namespace", metafieldsConfiguration.Value.Namespace },
                { "value", metafieldValue },
                { "type", "json" },
                { "ownerId", $"gid://shopify/Shop/{store.ShopId}" },
            };

            var requestBody = new
            {
                query = Metafields.MetafieldsSetMutation,
                variables = new { metafields = new List<dynamic> { optionSettingMetafield } },
            };

            try
            {
                await shopifyClient.RequestToShopify(store.Domain, store.Token, requestBody);
            }
            catch (Exception ex)
            {
                logger.Error(ex, $"Could not save setting to shopify metafields for store {store}");
            }
        }

        return optionSettings;
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
