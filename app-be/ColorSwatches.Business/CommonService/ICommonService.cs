using ColorSwatches.Business.Dtos.Response.Common;
using ColorSwatches.Infrastructure.Lifetimes;

namespace ColorSwatches.Business.CommonService;

public interface ICommonService : IScopedService
{
    Task<ShopInfoResponse> GetShopData(string domain);
    Task<bool> CheckThemeByStore(Guid storeId);
}
