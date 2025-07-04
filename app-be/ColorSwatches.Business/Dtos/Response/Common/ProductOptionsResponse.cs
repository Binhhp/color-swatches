namespace ColorSwatches.Business.Dtos.Response.Common;

public class ProductOptionsResponse
{
    public ProductData? Data { get; set; }
}

public class ProductData
{
    public ProductConnection? Products { get; set; }
}

public class ProductConnection
{
    public List<ProductEdge>? Edges { get; set; }
    public PageInfo? PageInfo { get; set; }
}

public class ProductEdge
{
    public ProductNode? Node { get; set; }
}

public class ProductNode
{
    public string? Id { get; set; }
    public string? Title { get; set; }
    public string? Handle { get; set; }
    public List<ProductOption>? Options { get; set; }
}

public class ProductOption
{
    public string? Id { get; set; }
    public string? Name { get; set; }
    public List<string>? Values { get; set; }
}

public class PageInfo
{
    public bool HasNextPage { get; set; }
    public string? EndCursor { get; set; }
} 