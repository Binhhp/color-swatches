namespace ColorSwatches.Models.Models.Setting;

public record UpsertAppStatusModel(
    string Key,
    string Namespace,
    bool Status,
    string ShopId,
    string Domain,
    string Token
);
