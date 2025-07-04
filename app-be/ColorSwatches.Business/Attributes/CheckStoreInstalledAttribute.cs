using ColorSwatches.Entities.Entities;
using ColorSwatches.Shared.Configurations;
using Marten;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Options;
using ShopifySharp;
using ILogger = Serilog.ILogger;

namespace ColorSwatches.Business.Attributes;

public class CheckStoreInstalledAttribute : ActionFilterAttribute
{
    public override async Task OnActionExecutionAsync(
        ActionExecutingContext context,
        ActionExecutionDelegate next
    )
    {
        var shopDomain = context.ActionArguments["shop"] as string;

        var dbContext =
            context.HttpContext.RequestServices.GetService<IDocumentSession>();
        var options = context.HttpContext.RequestServices.GetService<
            IOptions<CoreConfiguration>
        >();

        if (dbContext == null || options?.Value.ShopifyAppHandle == null)
        {
            await base.OnActionExecutionAsync(context, next);
            return;
        }

        if (string.IsNullOrEmpty(shopDomain))
        {
            await base.OnActionExecutionAsync(context, next);
            return;
        }

        var exists = await dbContext
            .Query<Store>()
            .SingleOrDefaultAsync(s => s.Domain == shopDomain);

        if (exists is null)
        {
            await base.OnActionExecutionAsync(context, next);
            return;
        }

        // Check token valid
        var service = new AccessScopeService(exists.Domain, exists.Token);

        try
        {
            await service.ListAsync();
            context.Result = new RedirectResult(
                $"https://{shopDomain}/admin/apps/{options.Value.ShopifyAppHandle}"
            );
        }
        catch (ShopifyException e)
        {
            if (e.Message.Contains("Invalid API key or access token"))
            {
                var logger = context.HttpContext.RequestServices.GetService<ILogger>();
                logger?.Information(
                    $"Invalid/Outdated access token for shop: {shopDomain}"
                );

                await base.OnActionExecutionAsync(context, next);
            }
        }
    }
}
