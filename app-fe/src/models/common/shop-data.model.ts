export interface ShopDataResponse {
  id: string;
  domain: string;
  shopifyPlan: string;
  active: boolean;
  currency: string;
}

export interface ShopInfoDto {
  shop?: ShopDataResponse;
  token: string;
}
