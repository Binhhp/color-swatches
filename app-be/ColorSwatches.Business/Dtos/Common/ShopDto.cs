using System.Text.Json.Serialization;

namespace ColorSwatches.Models.Dtos.Common;

public class ShopDto
{
    [JsonPropertyName("id")]
    public Guid Id { get; set; }

    [JsonPropertyName("domain")]
    public string Domain { get; set; }

    [JsonPropertyName("active")]
    public bool Active { get; set; }

    [JsonPropertyName("currency")]
    public string Currency { get; set; }

    [JsonPropertyName("isSettingOption")]
    public bool IsSettingOption { get; set; }
}
