using System.Text.Json.Serialization;

namespace ColorSwatches.Models.Dtos.Common;

public record ShopIdentity(
    [property: JsonPropertyName("domain")] string Domain,
    [property: JsonPropertyName("token")] string Token
);
