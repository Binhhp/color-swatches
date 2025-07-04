using System.Text.Json;
using ColorSwatches.Business.WebhookService;
using Hangfire;
using Microsoft.AspNetCore.Mvc;

namespace ColorSwatches.Controllers;

[ApiController]
[Route("webhook")]
public class WebhookController(IUninstallStoreWebhookService uninstallStoreWebhookService)
    : CoreControllerBase
{
    [HttpPost("uninstall")]
    public IActionResult UninstallStore(JsonElement request)
    {
        var shopifyId = request.GetProperty("id").GetInt64().ToString();
        BackgroundJob.Enqueue(
            () => uninstallStoreWebhookService.UninstallStore(shopifyId)
        );
        return SuccessResponse(true);
    }
}
