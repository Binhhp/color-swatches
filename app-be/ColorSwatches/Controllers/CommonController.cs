using ColorSwatches.Business.CommonService;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace ColorSwatches.Controllers;

[Authorize]
[ApiController]
[Route("common")]
public class CommonController(ICommonService commonService) : CoreControllerBase
{
    [HttpGet("shop-info")]
    [AllowAnonymous]
    public async Task<IActionResult> ShopInformation(string domain)
    {
        var response = await commonService.GetShopData(domain);
        return SuccessResponse(response);
    }

    [HttpGet("theme-enabled")]
    public async Task<IActionResult> CheckThemeEnabled()
    {
        var response = await commonService.CheckThemeByStore(GetStoreId());
        return SuccessResponse(response);
    }
}
