export interface AppStatusResponse {
  status: boolean;
}

export interface UpdateAppStatusRequest {
  status: boolean;
}

export interface OptionValue {
  value: string;
  color: string;
  image: string;
  style: string;
}

export interface OptionSettingAppearance {
  height?: string;
  width?: string;
  borderRadius?: string;
  spacing?: string;
  defaultColor?: string;
  selectedColor?: string;
  hoverColor?: string;
}

export interface OptionSettingAnimation {
  hoverAnimation?: string;
  outOfStock?: string;
  strikeColor?: string;
}

export interface OptionSetting {
  id: string;
  productOptionId?: string;
  productId: string;
  isActive: boolean;
  storeId: string;
  template: string;
  style: string;
  position: string[];
  appearance?: OptionSettingAppearance;
  animation?: OptionSettingAnimation;
  values: OptionValue[];
  dateCreated: string;
  dateModified: string;
}

export interface UpsertOptionSettingRequest {
  optionSettings: OptionSetting[];
}
