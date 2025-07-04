using System.Text.Json.Serialization;
using System.Web;
using ColorSwatches.Configurations;
using ColorSwatches.Entities;
using ColorSwatches.Infrastructure;
using ColorSwatches.Infrastructure.Auth;
using ColorSwatches.Infrastructure.Filters;
using ColorSwatches.Infrastructure.Logging;
using ColorSwatches.Infrastructure.MvcExtensions;
using ColorSwatches.Shared.Configurations;
using ColorSwatches.Validator;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Scalar.AspNetCore;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder
    .Services.AddControllers(options =>
    {
        options.Filters.Add<ModelValidationFilter>();
        options.UseGeneralRoutePrefix("api");
    })
    .AddJsonOptions(x =>
        x.JsonSerializerOptions.ReferenceHandler = ReferenceHandler.IgnoreCycles
    )
    .AddValidatorModel();

builder.Services.Configure<CoreConfiguration>(c =>
    builder.Configuration.GetSection(nameof(CoreConfiguration)).Bind(c)
);

builder.Services.Configure<MetafieldsConfiguration>(c =>
    builder.Configuration.GetSection(nameof(MetafieldsConfiguration)).Bind(c)
);

builder.Services.Configure<ApiBehaviorOptions>(options =>
{
    options.SuppressModelStateInvalidFilter = true;
});

builder.Services.AddEndpointsApiExplorer();
builder.Services.AddHttpClient();
builder.Services.AddInfrastructure(builder.Configuration);
builder.Services.RegisterDatabase(builder.Configuration);
builder.Services.AddOpenApi(
    "v1",
    options =>
    {
        options.AddDocumentTransformer<BearerSecuritySchemeTransformer>();
    }
);

builder.AddConfigurations();

builder.RegisterSerilog();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment() || app.Environment.IsStaging())
{
    app.MapOpenApi();
    app.MapScalarApiReference(option =>
        option
            .WithTitle("Orichi Color Swatches API")
            .WithTheme(ScalarTheme.BluePlanet)
            .WithDownloadButton(true)
            .WithDefaultHttpClient(ScalarTarget.Node, ScalarClient.Axios)
            .WithLayout(ScalarLayout.Modern)
    );
}

app.UseCors(policyBuilder =>
    policyBuilder.AllowAnyOrigin().AllowAnyMethod().AllowAnyHeader()
);

app.UseStaticFiles();

app.UseHttpsRedirection();

app.UseAuthentication();

app.UseAuthorization();

app.UseInfrastructure(builder.Configuration);

app.MapControllers();

app.MapGet("/", HandleIndex);

app.MapFallback(HandleIndex);

async Task HandleIndex(HttpContext context, IOptions<CoreConfiguration> options)
{
    var shop = context.Request.Query["shop"].FirstOrDefault();
    var host = context.Request.Query["host"].FirstOrDefault();
    var admin = context.Request.Query["admin"].FirstOrDefault();
    var embedded = context.Request.Query["embedded"].FirstOrDefault();
    if (string.IsNullOrEmpty(shop) || string.IsNullOrEmpty(host))
    {
        context.Response.Redirect("");
        return;
    }

    if (admin == "1" && host == "123")
    {
        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync("wwwroot/index.html");
        return;
    }

    if (embedded == "1")
    {
        context.Response.Headers.Append(
            "Content-Security-Policy",
            $"frame-ancestors https://{HttpUtility.HtmlEncode(shop)} https://admin.shopify.com;"
        );

        context.Response.ContentType = "text/html";
        await context.Response.SendFileAsync("wwwroot/index.html");
        return;
    }

    var url =
        $"https://{shop}/admin/oauth/authorize?client_id={options.Value.ClientId}&scope={options.Value.Scope}&redirect_uri=https://{options.Value.ShopifyAppUrl}/api/home/auth";
    context.Response.Redirect(url);
}

app.Run();
