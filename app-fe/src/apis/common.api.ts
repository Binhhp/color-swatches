import type { ShopInfoDto } from "@/models/common/shop-data.model";
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
}
