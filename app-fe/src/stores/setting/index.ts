import { create } from "zustand";
import CommonApi from "@/apis/common.api";
import type {
  UpdateAppStatusRequest,
  OptionSetting,
  UpsertOptionSettingRequest
} from "@/models/common/setting.model";

type SettingState = {
  // App Status
  appStatus: boolean | null;
  isAppStatusLoading: boolean;

  // Option Settings
  optionSettings: OptionSetting[];
  isOptionSettingsLoading: boolean;

  // General loading state
  isLoading: boolean;
};

type SettingAction = {
  // App Status Actions
  getAppStatus: () => Promise<boolean | undefined>;
  updateAppStatus: (status: boolean) => Promise<boolean | undefined>;

  // Option Settings Actions
  getOptionSettings: () => Promise<OptionSetting[] | undefined>;
  getOptionById: (id: string) => OptionSetting | undefined;

  upsertOptionSettings: (
    request: UpsertOptionSettingRequest
  ) => Promise<OptionSetting[] | undefined>;

  // Utility Actions
  setAppStatus: (status: boolean) => void;
  setOptionSettings: (settings: OptionSetting[]) => void;
  resetSettingState: () => void;
};

const initialState: SettingState = {
  appStatus: null,
  isAppStatusLoading: false,
  optionSettings: [],
  isOptionSettingsLoading: false,
  isLoading: false
};

const settingStore = create<SettingState & SettingAction>((set, get) => ({
  ...initialState,

  // App Status Actions
  getAppStatus: async () => {
    set({ isAppStatusLoading: true, isLoading: true });
    try {
      const response = await CommonApi.GetAppStatus();
      set({
        appStatus: response?.status ?? null,
        isAppStatusLoading: false,
        isLoading: false
      });
      return response?.status;
    } catch (error) {
      console.error("Error fetching app status:", error);
      set({
        isAppStatusLoading: false,
        isLoading: false
      });
      return undefined;
    }
  },

  updateAppStatus: async (status: boolean) => {
    set({ isAppStatusLoading: true, isLoading: true });
    try {
      const request: UpdateAppStatusRequest = { status };
      const response = await CommonApi.UpdateAppStatus(request);
      if (response) {
        set({
          appStatus: status,
          isAppStatusLoading: false,
          isLoading: false
        });
      }
      return response;
    } catch (error) {
      console.error("Error updating app status:", error);
      set({
        isAppStatusLoading: false,
        isLoading: false
      });
      return undefined;
    }
  },

  // Option Settings Actions
  getOptionSettings: async () => {
    set({ isOptionSettingsLoading: true, isLoading: true });
    try {
      const response = await CommonApi.GetOptionSetting();
      set({
        optionSettings: response ?? [],
        isOptionSettingsLoading: false,
        isLoading: false
      });
      return response;
    } catch (error) {
      console.error("Error fetching option settings:", error);
      set({
        isOptionSettingsLoading: false,
        isLoading: false
      });
      return undefined;
    }
  },

  getOptionById: (id: string) => {
    const { optionSettings } = get();
    const option = optionSettings.find((option) => option.productOptionId === id);
    return option;
  },

  upsertOptionSettings: async (request: UpsertOptionSettingRequest) => {
    set({ isOptionSettingsLoading: true, isLoading: true });
    try {
      const response = await CommonApi.UpsertOptionSetting(request);
      if (response) {
        set({
          optionSettings: response,
          isOptionSettingsLoading: false,
          isLoading: false
        });
      }
      return response;
    } catch (error) {
      console.error("Error upserting option settings:", error);
      set({
        isOptionSettingsLoading: false,
        isLoading: false
      });
      return undefined;
    }
  },

  // Utility Actions
  setAppStatus: (status: boolean) => {
    set({ appStatus: status });
  },

  setOptionSettings: (settings: OptionSetting[]) => {
    set({ optionSettings: settings });
  },

  resetSettingState: () => {
    set(initialState);
  }
}));

export default settingStore;
