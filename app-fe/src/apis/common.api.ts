import type { ShopInfoDto } from "@/models/common/shop-data.model";
import type {
  AppStatusResponse,
  UpdateAppStatusRequest,
  OptionSetting,
  UpsertOptionSettingRequest
} from "@/models/common/setting.model";
import { ApiHandler } from "@/utils/api-handler";
import { passParams } from "@/utils/pass-params";

export default class CommonApi {
  static async GetShop(domain: string) {
    const response = await ApiHandler<ShopInfoDto>({
      method: "GET",
      url: passParams("/common/shop-info", { domain })
    });
    return response.result;
  }

  static async GetAppStatus() {
    const response = await ApiHandler<AppStatusResponse>({
      method: "GET",
      url: "/setting/app-status"
    });
    return response.result;
  }

  static async UpdateAppStatus(request: UpdateAppStatusRequest) {
    const response = await ApiHandler<boolean>({
      method: "PUT",
      url: "/setting/app-status",
      body: request
    });
    return response.result;
  }

  static async GetOptionSetting() {
    const response = await ApiHandler<OptionSetting[]>({
      method: "GET",
      url: "/setting/options"
    });
    return response.result;
  }

  static async UpsertOptionSetting(request: UpsertOptionSettingRequest) {
    const response = await ApiHandler<OptionSetting[]>({
      method: "POST",
      url: "/setting/options",
      body: request
    });
    return response.result;
  }

  static async CheckThemeEnabled() {
    const response = await ApiHandler<boolean>({
      method: "GET",
      url: "/common/theme-enabled"
    });
    return response.result;
  }
}
