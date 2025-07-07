using ColorSwatches.Business.Dtos.Request.Setting;
using ColorSwatches.Business.SettingService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ColorSwatches.Controllers;

[Authorize]
[ApiController]
[Route("setting")]
public class SettingController(ISettingService settingService) : CoreControllerBase
{
    [HttpGet]
    [Route("app-status")]
    public async Task<IActionResult> GetAppStatus()
    {
        var response = await settingService.GetAppStatus(GetStoreId());
        return SuccessResponse(response);
    }

    [HttpPut]
    [Route("app-status")]
    public async Task<IActionResult> UpdateAppStatus(UpdateAppStatusRequest request)
    {
        var response = await settingService.UpdateAppStatus(GetStoreId(), request);
        return SuccessResponse(response);
    }

    [HttpGet]
    [Route("options")]
    public async Task<IActionResult> GetOptionSetting()
    {
        var response = await settingService.GetOptionSetting(GetStoreId());
        return SuccessResponse(response);
    }

    [HttpPost]
    [Route("options")]
    public async Task<IActionResult> UpsertOptionSetting([FromBody] UpsertOptionSettingRequest request)
    {
        var response = await settingService.UpsertOptionSetting(GetStoreId(), request);
        return SuccessResponse(response);
    }
}
