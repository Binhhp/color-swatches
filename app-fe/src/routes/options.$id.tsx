import { OptionSettingsDetail } from "@/components/option-settings/detail";
import { templateOptions } from "@/components/option-settings/detail/template";
import type { OptionSetting } from "@/models/common/setting.model";
import settingStore from "@/stores/setting";
import { UriProvider } from "@/utils/uri-provider";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useAppBridge } from "@shopify/app-bridge-react";

export const Route = createFileRoute(`/options/$id`)({
  component: Index
});

function Index() {
  const { id } = Route.useParams();

  const [optionState, setOptionState] = useState<OptionSetting | undefined>(undefined);
  const { getOptionById, getOptionSettings, upsertOptionSetting, isOptionSettingsLoading } =
    settingStore();

  useEffect(() => {
    const fetchOption = async () => {
      const fetchOptionDetail = async () => {
        const option = getOptionById(id);
        if (!option) return null;
        if (!option?.template) {
          const template = templateOptions[0];
          if (template) {
            option.template = template.value;
            option.style = template.options[0]?.value ?? "Color";
          }
        }

        setOptionState(option);
        return option;
      };

      const option = await fetchOptionDetail();
      if (option) return;
      await getOptionSettings();
      await fetchOptionDetail();
    };

    fetchOption();
  }, [id, getOptionById, getOptionSettings]);

  const handleSetOption = (option: Partial<OptionSetting>) => {
    if (!optionState) return;
    setOptionState({ ...optionState, ...option });
  };

  const navigate = useNavigate();

  const shopify = useAppBridge();

  const handleSave = async () => {
    if (!optionState) return;

    const requestOption = { ...optionState };

    if (requestOption.values?.length) {
      requestOption.values?.forEach((v) => {
        if (!optionState.style?.includes("Image") && v.image) {
          v.image = "";
        }

        if (optionState.style?.includes("Image") && v.style) {
          v.style = "";
        }
      });
    }

    const resp = await upsertOptionSetting(requestOption);

    if (resp.status) {
      shopify.toast.show("Option saved successfully");
      navigate({ to: UriProvider.KeepParameters("/list-options") });
      return;
    }

    shopify.toast.show("Failed to save option!", {
      isError: true
    });
  };

  return (
    <OptionSettingsDetail
      option={optionState}
      setOption={handleSetOption}
      onSave={handleSave}
      isSaving={isOptionSettingsLoading}
    />
  );
}
