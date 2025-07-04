using ColorSwatches.Infrastructure.Lifetimes;

namespace ColorSwatches.Business.HomeService;

public interface IHomeService : IScopedService
{
    Task<string> Auth(string domain, string code);
}
