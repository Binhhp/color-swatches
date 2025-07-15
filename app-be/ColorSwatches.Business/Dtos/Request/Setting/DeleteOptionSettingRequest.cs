namespace ColorSwatches.Business.Dtos.Request.Setting;

public class DeleteOptionSettingRequest
{
    public List<Guid> OptionSettingIds { get; set; } = new();
} 