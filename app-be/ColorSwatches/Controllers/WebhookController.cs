using System.Text.Json;
using ColorSwatches.Business.WebhookService;
using Microsoft.AspNetCore.Mvc;

namespace ColorSwatches.Controllers;

[ApiController]
[Route("webhook")]
public class WebhookController(IUninstallStoreWebhookService uninstallStoreWebhookService)
    : CoreControllerBase
{
    [HttpPost("uninstall")]
    public async Task<IActionResult> UninstallStore(JsonElement request)
    {
        var shopifyId = request.GetProperty("id").GetInt64().ToString();
        await uninstallStoreWebhookService.UninstallStore(shopifyId);
        return SuccessResponse(true);
    }
}
