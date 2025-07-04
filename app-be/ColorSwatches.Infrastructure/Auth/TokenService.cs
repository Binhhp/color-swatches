using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;

namespace ColorSwatches.Infrastructure.Auth;

public class TokenService(IOptions<TokenSetting> tokenSetting) : ITokenService
{
    private readonly TokenSetting _tokenSettings = tokenSetting.Value;

    public string GenerateJwt(string domain, Guid id)
    {
        var claims = new List<Claim>
        {
            new(ClaimTypes.Name, domain),
            new(ClaimTypes.Role, "Admin"),
            new(ClaimTypes.NameIdentifier, id.ToString()),
        };

        var signingKey = new SymmetricSecurityKey(
            Encoding.UTF8.GetBytes(_tokenSettings.JwtSecretKey!)
        );
        var signingCredentials = new SigningCredentials(
            signingKey,
            SecurityAlgorithms.HmacSha256
        );

        var token = new JwtSecurityToken(
            claims: claims,
            notBefore: DateTime.UtcNow,
            expires: DateTime.UtcNow.AddMinutes(_tokenSettings.TokenExpirationInMinutes),
            signingCredentials: signingCredentials
        );

        var tokenHandler = new JwtSecurityTokenHandler();
        var jwtToken = tokenHandler.WriteToken(token);

        return jwtToken;
    }
}
