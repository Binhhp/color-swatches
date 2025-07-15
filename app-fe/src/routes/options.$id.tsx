import { OptionSettingsDetail } from "@/components/option-settings/detail";
import { templateOptions } from "@/components/option-settings/detail/template";
import type { OptionSetting } from "@/models/common/setting.model";
import { ResponseModel } from "@/models/api/response.model";
import settingStore from "@/stores/setting";
import { UriProvider } from "@/utils/uri-provider";
import { Toast } from "@shopify/polaris";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useState } from "react";

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

  const [active, setActive] = useState(false);

  const [messageToShow, setMessageToShow] = useState<ResponseModel<OptionSetting[]> | undefined>();

  const toggleActive = () => {
    setActive((active) => !active);
    setMessageToShow(undefined);
  };

  const handleSave = async () => {
    if (!optionState) return;

    const resp = await upsertOptionSetting(optionState);

    if (resp.status) {
      setMessageToShow(resp);
      toggleActive();
      if (window.location.search.includes("lst=true")) {
        navigate({ to: UriProvider.KeepParameters("/list-options") });
      } else {
        navigate({ to: UriProvider.KeepParameters("/") });
      }
      return;
    }

    setMessageToShow(resp);
    toggleActive();
  };

  const toastMarkup = active ? (
    <Toast
      tone={"magic"}
      error={!messageToShow?.status}
      content={messageToShow?.message ?? "Failed to save option!"}
      onDismiss={toggleActive}
    />
  ) : null;

  return (
    <>
      {toastMarkup}
      <OptionSettingsDetail
        option={optionState}
        setOption={handleSetOption}
        onSave={handleSave}
        isSaving={isOptionSettingsLoading}
      />
    </>
  );
}
