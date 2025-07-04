using ColorSwatches.Business.Dtos.Request.Setting;
using ColorSwatches.Business.Dtos.Response.Setting;
using ColorSwatches.Business.SettingService;
using ColorSwatches.Entities.Entities;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ColorSwatches.Controllers;

[Authorize]
[ApiController]
[Route("setting")]
public class SettingController(ISettingService settingService) : CoreControllerBase
{
    [HttpGet("app-status")]
    public async Task<IActionResult> GetAppStatus()
    {
        var response = await settingService.GetAppStatus(GetStoreId());
        return SuccessResponse(response);
    }

    [HttpPut("app-status")]
    public async Task<IActionResult> UpdateAppStatus(UpdateAppStatusRequest request)
    {
        var response = await settingService.UpdateAppStatus(GetStoreId(), request);
        return SuccessResponse(response);
    }

    [HttpGet("option-setting")]
    public async Task<IActionResult> GetOptionSetting()
    {
        var response = await settingService.GetOptionSetting(GetStoreId());
        return SuccessResponse(response);
    }

    [HttpPut("option-setting")]
    public async Task<IActionResult> UpsertOptionSetting(UpsertOptionSettingRequest request)
    {
        var response = await settingService.UpsertOptionSetting(GetStoreId(), request);
        return SuccessResponse(response);
    }
}
