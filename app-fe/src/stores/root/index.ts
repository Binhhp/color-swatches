/* eslint-disable @typescript-eslint/no-explicit-any */
import axios, { type AxiosInstance } from "axios";
import { create } from "zustand";

import CommonApi from "@/apis/common.api";
import type { ShopDataResponse, ShopInfoDto } from "@/models/common/shop-data.model";
import type { OptionSetting } from "@/models/common/setting.model";

type State = {
  authAxios: AxiosInstance;
  shop: ShopDataResponse | null;
  isAdmin: boolean;
  isLoading: boolean;
  isEnableTheme: boolean;
  options: OptionSetting[];
};

type Action = {
  addInterceptorAxios: (token: string) => void;
  getShop: (shopDomain: string) => Promise<ShopInfoDto["shop"] | undefined>;
  setIsAdmin: (isAdmin: boolean) => void;
  setIsEnableTheme: (isEnableTheme: boolean) => void;
  getOptions: () => Promise<void>;
};

const rootStore = create<State & Action>((set, get) => ({
  isLoading: false,
  authAxios: axios.create({
    baseURL: import.meta.env.VITE_BACKEND_END_POINT,
    timeout: 30 * 3600
  }),
  shop: null,
  isAdmin: false,
  isEnableTheme: true,
  options: [],

  addInterceptorAxios: (jwt: string) => {
    const instance = get().authAxios;
    instance.interceptors.request.use((config: any) => {
      // add token to request headers
      config.headers.Authorization = `Bearer ${jwt}`;
      return config;
    });

    instance.interceptors.response.use(
      (response: any) => {
        return response;
      },
      (error: any) => {
        return Promise.reject(error);
      }
    );
    set({ authAxios: instance });
  },

  getOptions: async () => {
    const response = await CommonApi.GetOptionSetting();
    if (response?.length) {
      set({ options: response });
    }
  },

  getShop: async (domain: string) => {
    set({ isLoading: true });
    const response = await CommonApi.GetShop(domain);
    set({
      isLoading: false,
      shop: response?.shop
    });
    if (response) get().addInterceptorAxios(response.token);
    return response?.shop;
  },

  setIsAdmin: (isAdmin: boolean) => {
    set({ isAdmin: isAdmin });
  },
  setIsEnableTheme: (isEnableTheme: boolean) => {
    set({ isEnableTheme: isEnableTheme });
  }
}));

export default rootStore;
