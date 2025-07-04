public static class ObjectExtensions
{
    public static T ThenThrowIfNull<T>(this T? obj, Func<Exception> exceptionFactory) where T : class
    {
        if (obj == null || string.IsNullOrEmpty(obj as string))
        {
            throw exceptionFactory();
        }

        return obj;
    }
    public static T ThenThrowIfNull<T>(this T? obj, Exception exception) where T : class
    {
        if (obj == null || (typeof(string) == obj.GetType() && string.IsNullOrEmpty(obj as string)))
        {
            throw exception;
        }

        return obj;
    }

    public static T ThenThrowIf<T>(this T obj, Func<T, bool> predicate, Func<Exception> exceptionFactory)
    {
        if (predicate(obj))
        {
            throw exceptionFactory();
        }

        return obj;
    }
    public static T ThenThrowIf<T>(this T obj, Func<T, bool> predicate, Exception exception)
    {
        if (predicate(obj))
        {
            throw exception;
        }

        return obj;
    }
}