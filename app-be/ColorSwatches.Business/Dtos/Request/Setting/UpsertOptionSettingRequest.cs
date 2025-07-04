using ColorSwatches.Entities.Entities;

namespace ColorSwatches.Business.Dtos.Request.Setting;

public class UpsertOptionSettingRequest
{
    public List<OptionSetting> OptionSettings { get; set; }
}