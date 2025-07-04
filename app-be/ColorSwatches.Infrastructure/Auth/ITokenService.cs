using ColorSwatches.Infrastructure.Lifetimes;

namespace ColorSwatches.Infrastructure.Auth;

public interface ITokenService : IScopedService
{
    string GenerateJwt(string domain, Guid id);
}
