using ColorSwatches.Business.Attributes;
using ColorSwatches.Business.HomeService;
using Microsoft.AspNetCore.Mvc;

namespace ColorSwatches.Controllers;

[ApiController]
[Route("home")]
public class HomeController(IHomeService homeService) : CoreControllerBase
{
    /// <summary>
    /// API create store after install app
    /// </summary>
    [HttpGet("auth")]
    [CheckStoreInstalled]
    public async Task<IActionResult> Auth(string shop, string code)
    {
        var url = await homeService.Auth(shop, code);
        return Redirect(url);
    }
}
