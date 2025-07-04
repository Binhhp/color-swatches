using System.Net;
using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;
using ColorSwatches.Business.Dtos.Response.Common;
using ColorSwatches.Business.ShopifyClient.Mutations;
using ColorSwatches.Shared.Configurations;
using Microsoft.Extensions.Options;
using Newtonsoft.Json;
using ShopifySharp;

namespace ColorSwatches.Business.ShopifyClient;

public class ShopifyClient(
    IOptions<CoreConfiguration> options,
    IHttpClientFactory clientFactory,
    Serilog.ILogger logger
) : IShopifyClient
{
    public async Task<string> FetchShopifyAccessToken(string domain, string code)
    {
        var endpointHost = $"https://{domain}/admin/oauth/access_token";
        using var client = new HttpClient();
        client.BaseAddress = new Uri(endpointHost);
        using var request = new HttpRequestMessage(HttpMethod.Post, client.BaseAddress);
        var contentParams = new StringContent(
            $"client_id={options.Value.ClientId}&code={code}&client_secret={options.Value.ClientSecret}",
            Encoding.UTF8,
            "application/x-www-form-urlencoded"
        );

        request.Content = contentParams;

        using var response = await client.SendAsync(request);
        if (response.StatusCode != HttpStatusCode.OK)
            return "";

        var resultJson = await response.Content.ReadAsStringAsync();
        var r = JsonConvert.DeserializeObject<dynamic>(resultJson);

        return r is null ? "" : Convert.ToString(r.access_token);
    }

    public async Task<Shop> GetShopInformation(string domain, string token)
    {
        var shopService = new ShopService(domain, token);
        return await shopService.GetAsync();
    }

    public async Task<JsonElement> RequestToShopify(
        string shopDomain,
        string accessToken,
        dynamic payload
    )
    {
        var client = clientFactory.CreateClient();
        client.DefaultRequestHeaders.Add("X-Shopify-Access-Token", accessToken);
        client.DefaultRequestHeaders.Accept.Add(
            new MediaTypeWithQualityHeaderValue("application/json")
        );
        var value = JsonConvert.SerializeObject(payload);
        var data = new StringContent(value, Encoding.UTF8, "application/json");
        try
        {
            var response = await client.PostAsync(
                new Uri(
                    $"https://{shopDomain}/admin/api/{options.Value.ShopifyApiVersion}/graphql.json"
                ),
                data
            );
            await using var stream = await response.Content.ReadAsStreamAsync();
            using var doc = await JsonDocument.ParseAsync(stream);
            var result = doc.RootElement.Clone();

            if (!result.TryGetProperty("errors", out _))
                return result;
            logger.Error(
                "Error: Call Shopify GraphQL - Shop Domain: {0} - Message Error: {1}",
                shopDomain,
                result
            );
            throw new Exception("Call Shopify GraphQL error");
        }
        catch (Exception e)
        {
            logger.Error(
                "Error: Call Shopify GraphQL - Shop Domain: {0} - Message Error: {1}",
                shopDomain,
                e.Message
            );
            throw new Exception(e.Message);
        }
    }

    public async Task<ProductOptionsResponse?> GetAllProductOptionsTyped(string shopDomain, string accessToken, int first = 250)
    {
        try
        {
            var graphqlQuery = new
            {
                query = Metafields.GetAllProductOptionsMutation,
                variables = new
                {
                    first
                }
            };

            var jsonResult = await RequestToShopify(shopDomain, accessToken, graphqlQuery);
            var jsonString = jsonResult.GetRawText();
            return JsonConvert.DeserializeObject<ProductOptionsResponse>(jsonString);
        }
        catch (Exception e)
        {
            logger.Error(
                "Error: Deserialize product options response - Shop Domain: {0} - Message Error: {1}",
                shopDomain,
                e.Message
            );
            return null;
        }
    }
}
