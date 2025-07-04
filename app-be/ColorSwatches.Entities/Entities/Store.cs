namespace ColorSwatches.Entities.Entities;

public class Store
{
    public Guid Id { get; set; }
    public string Domain { get; set; }
    public string PublicDomain { get; set; }
    public string Token { get; set; }
    public string Email { get; set; }
    public string ShopId { get; set; }
    public bool Active { get; set; }
    public DateTime InstallDate { get; set; }
    public string Country { get; set; }
    public string ShopifyPlan { get; set; }
    public string Phone { get; set; }
    public string MoneyWithCurrencyFormat { get; set; }
    public string Currency { get; set; }
}
