public static class Exceptions
{
    public static Exception NotFound(string sub) => new InvalidOperationException($"{sub} not found.");
}