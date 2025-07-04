using System.Text.Json;
using ColorSwatches.Business.Dtos.Response.Common;
using ColorSwatches.Infrastructure.Lifetimes;
using ShopifySharp;

namespace ColorSwatches.Business.ShopifyClient;

public interface IShopifyClient : IScopedService
{
    Task<string> FetchShopifyAccessToken(string domain, string code);
    Task<Shop> GetShopInformation(string domain, string token);
    Task<JsonElement> RequestToShopify(
        string shopDomain,
        string accessToken,
        dynamic payload
    );
    Task<ProductOptionsResponse?> GetAllProductOptionsTyped(string shopDomain, string accessToken, int first = 250);
}
