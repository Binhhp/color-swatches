namespace ColorSwatches.Infrastructure.Auth;

public class TokenSetting
{
    public string? JwtSecretKey { get; set; }
    public int TokenExpirationInMinutes { get; set; }
    public string? JwtIssuer { get; set; }
    public string? JwtAudience { get; set; }
}
