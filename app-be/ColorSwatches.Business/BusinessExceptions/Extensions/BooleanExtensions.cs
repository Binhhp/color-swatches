public static class BooleanExtensions
{
    public static void ThenThrow(this bool condition, Exception exception)
    {
        if (condition)
        {
            throw exception;
        }
    }

    public static void ThenThrow(this bool condition, Func<Exception> exceptionFactory)
    {
        if (condition)
        {
            throw exceptionFactory();
        }
    }
}