namespace ColorSwatches.Business.ShopifyClient.Mutations;

public static class Metafields
{
    public const string MetafieldsDeleteMutation =
        @"mutation metafieldsDelete($metafields: [MetafieldIdentifierInput!]!) {metafieldsDelete(metafields: $metafields){ deletedMetafields { key namespace ownerId } userErrors{field message}}}";

    public const string MetafieldsSetMutation = """
        mutation MetafieldsSet($metafields: [MetafieldsSetInput!]!) {
          metafieldsSet(metafields: $metafields) {
            metafields {
              key
              namespace
              value
              createdAt
              updatedAt
            }
            userErrors {
              field
              message
              code
            }
          }
        }
        """;

    public const string GetAllProductOptionsMutation = @"
                query GetAllProductOptions($first: Int!) {
                    products(first: $first) {
                        edges {
                            node {
                                id
                                title
                                handle
                                options {
                                    id
                                    name
                                    values
                                }
                            }
                        }
                        pageInfo {
                            hasNextPage
                            endCursor
                        }
                    }
                }";
}
