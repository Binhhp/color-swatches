using System.Net;
using System.Security.Claims;
using ColorSwatches.Business.Dtos.Response;
using Microsoft.AspNetCore.Mvc;

namespace ColorSwatches.Controllers;

public class CoreControllerBase : ControllerBase
{
    protected Guid GetStoreId()
    {
        var nameIdentifier = HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.Parse(nameIdentifier!);
    }

    protected string GetDomain()
    {
        return HttpContext.User.FindFirstValue(ClaimTypes.Name)!;
    }

    protected static JsonResult SuccessResponse<T>(T result)
    {
        return new JsonResult(
            new BaseResponse<T> { StatusCode = HttpStatusCode.OK, Result = result }
        );
    }

    protected static JsonResult SuccessResponse<T>(HttpStatusCode statusCode, T result)
    {
        return new JsonResult(
            new BaseResponse<T> { StatusCode = statusCode, Result = result }
        );
    }
}
