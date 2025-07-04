using System.Net;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.Mvc.Filters;
using Microsoft.AspNetCore.Mvc.ModelBinding;

namespace ColorSwatches.Infrastructure.Filters;

public class ModelValidationFilter : IActionFilter
{
    public void OnActionExecuting(ActionExecutingContext context)
    {
        if (context.ModelState.IsValid)
            return;
        var messages = context
            .ModelState.Values.Where(x =>
                x.ValidationState == ModelValidationState.Invalid
            )
            .SelectMany(x => x.Errors)
            .Select(x => x.ErrorMessage)
            .ToList();

        context.Result = new BadRequestObjectResult(
            new
            {
                status = false,
                statusCode = HttpStatusCode.BadRequest,
                messages,
            }
        );
    }

    public void OnActionExecuted(ActionExecutedContext context) { }
}
