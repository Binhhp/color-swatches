using Hangfire.Common;
using Hangfire.States;
using Hangfire.Storage;

namespace ColorSwatches.Infrastructure.BackgroundJob;

public class ExpirationTimeFilter(TimeSpan expirationTimeout)
    : JobFilterAttribute,
        IApplyStateFilter
{
    public void OnStateApplied(
        ApplyStateContext context,
        IWriteOnlyTransaction transaction
    )
    {
        if (context.NewState is SucceededState)
        {
            context.JobExpirationTimeout = expirationTimeout;
        }
    }

    public void OnStateUnapplied(
        ApplyStateContext context,
        IWriteOnlyTransaction transaction
    ) { }
}
