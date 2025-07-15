using System.Text.Json;
using ColorSwatches.Business.Dtos.Response.Common;
using ColorSwatches.Infrastructure.Lifetimes;
using ShopifySharp;

namespace ColorSwatches.Business.ShopifyClient;

public interface IShopifyClient : IScopedService
{
    Task<string> FetchShopifyAccessToken(string domain, string code);
    Task<Shop> GetShopInformation(string domain, string token);
    Task RemoveMetaDataFieldAsync(IEnumerable<MetadataFieldDelete> fields, string domain, string token, long shopId);
    Task<JsonElement> RequestToShopify(
        string shopDomain,
        string accessToken,
        dynamic payload
    );
    Task<ProductOptionsResponse?> GetAllProductOptionsTyped(string shopDomain, string accessToken, int first = 250);
}
public class MetadataFieldDelete
{
    public string Namespace { get; set; }
    public string Key { get; set; }
    public MetadataFieldDelete(string @namespace, string key)
    {
        Namespace = @namespace;
        Key = key;
    }
}
