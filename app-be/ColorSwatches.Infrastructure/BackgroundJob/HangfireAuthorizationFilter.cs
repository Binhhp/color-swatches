using System.Net.Http.Headers;
using System.Text;
using Hangfire.Annotations;
using Hangfire.Dashboard;

namespace ColorSwatches.Infrastructure.BackgroundJob;

public class HangfireAuthorizationFilter(string username, string password)
    : IDashboardAuthorizationFilter
{
    public bool Authorize([NotNull] DashboardContext context)
    {
        var httpContext = context.GetHttpContext();

        if (!httpContext.Request.Headers.ContainsKey("Authorization"))
        {
            httpContext.Response.Headers["WWW-Authenticate"] =
                "Basic realm=\"Hangfire Dashboard\"";
            httpContext.Response.StatusCode = 401;
            return false;
        }

        var authHeader = AuthenticationHeaderValue.Parse(
            httpContext.Request.Headers["Authorization"]
        );

        if (authHeader.Scheme.Equals("Basic", StringComparison.OrdinalIgnoreCase))
        {
            var credentials = Encoding
                .UTF8.GetString(Convert.FromBase64String(authHeader.Parameter))
                .Split(':');
            var username1 = credentials[0];
            var password1 = credentials[1];

            if (username1 == username && password1 == password)
            {
                return true;
            }
        }

        httpContext.Response.Headers["WWW-Authenticate"] =
            "Basic realm=\"Hangfire Dashboard\"";
        httpContext.Response.StatusCode = 401;
        return false;
    }
}
