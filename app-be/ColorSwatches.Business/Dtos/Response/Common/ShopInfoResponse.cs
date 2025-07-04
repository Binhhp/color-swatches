using ColorSwatches.Models.Dtos.Common;

namespace ColorSwatches.Business.Dtos.Response.Common;

public record ShopInfoResponse(ShopDto Shop, string Token);
