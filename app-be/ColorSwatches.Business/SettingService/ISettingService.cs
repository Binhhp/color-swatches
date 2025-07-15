using ColorSwatches.Business.Dtos.Request.Setting;
using ColorSwatches.Business.Dtos.Response.Setting;
using ColorSwatches.Entities.Entities;
using ColorSwatches.Infrastructure.Lifetimes;
using ColorSwatches.Models.Models.Setting;

namespace ColorSwatches.Business.SettingService;

public interface ISettingService : IScopedService
{
    Task<List<OptionSetting>> GetOptionSetting(Guid storeId);
    Task<List<OptionSetting>> UpsertOptionSetting(Guid storeId, UpsertOptionSettingRequest request);
    Task<List<OptionSetting>> DeleteOptionSetting(Guid storeId, List<Guid> optionSettingIds);
    Task<AppStatusResponse> GetAppStatus(Guid storeId);
    Task<bool> UpdateAppStatus(Guid storeId, UpdateAppStatusRequest request);
    Task<bool> UpsertAppStatusMetafield(UpsertAppStatusModel model);
}
