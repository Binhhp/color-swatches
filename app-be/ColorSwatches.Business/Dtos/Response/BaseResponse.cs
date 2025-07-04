using System.Net;

namespace ColorSwatches.Business.Dtos.Response;

public class BaseResponse<T>
{
    public bool Status => (int)StatusCode >= 200 && (int)StatusCode < 300;
    public HttpStatusCode StatusCode { get; set; }
    public T? Result { get; set; }
    public string? Message { get; set; }
}
