using ColorSwatches.Entities.Entities;
using JasperFx.CodeGeneration;
using Marten;
using Marten.Schema.Identity;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Newtonsoft.Json;
using Weasel.Core;
using Weasel.Postgresql;

namespace ColorSwatches.Entities;

public static class Extensions
{
    public static void RegisterDatabase(
        this IServiceCollection services,
        IConfiguration configuration
    )
    {
        services
            .AddMarten(options =>
            {
                options.Connection(
                    configuration.GetConnectionString("Default") ?? string.Empty
                );
                options.Policies.ForAllDocuments(doc =>
                {
                    if (doc.IdType == typeof(Guid))
                    {
                        doc.IdStrategy = new CombGuidIdGeneration();
                    }
                });
                options.NameDataLength = 100;
                options
                    .Schema.For<Store>()
                    .Identity(store => store.Id)
                    .Index(store => store.Domain);
                options
                    .Schema.For<ShopifyWebhook>()
                    .ForeignKey<Store>(
                        sw => sw.StoreId,
                        fkd => fkd.OnDelete = CascadeAction.Cascade
                    )
                    .Identity(sw => sw.StoreId)
                    .DocumentAlias("shopify_webhook");
                options
                    .Schema.For<Setting>()
                    .ForeignKey<Store>(
                        s => s.StoreId,
                        fkd => fkd.OnDelete = CascadeAction.Cascade
                    )
                    .Identity(s => s.StoreId);
                options
                    .Schema.For<OptionSetting>()
                    .ForeignKey<Store>(
                        s => s.StoreId,
                        fkd => fkd.OnDelete = CascadeAction.Cascade
                    )
                    .Identity(s => s.StoreId);

                options.UseNewtonsoftForSerialization(
                    casing: Casing.SnakeCase,
                    enumStorage: EnumStorage.AsString,
                    collectionStorage: CollectionStorage.AsArray,
                    configure: settings =>
                    {
                        settings.DateTimeZoneHandling =
                            DateTimeZoneHandling.RoundtripKind;
                        settings.MissingMemberHandling = MissingMemberHandling.Ignore;
                        settings.FloatParseHandling = FloatParseHandling.Decimal;
                        settings.DateParseHandling = DateParseHandling.DateTime;
                    }
                );
                options.AutoCreateSchemaObjects = AutoCreate.CreateOrUpdate;
                options.GeneratedCodeMode = TypeLoadMode.Auto;
                options.DisableNpgsqlLogging = true;
            })
            .UseLightweightSessions();
    }
}
