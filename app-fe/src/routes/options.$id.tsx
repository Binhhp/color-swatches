import { OptionSettingsDetail } from "@/components/option-settings/detail";
import type { OptionSetting } from "@/models/common/setting.model";
import settingStore from "@/stores/setting";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute(`/options/$id`)({
  component: Index
});

function Index() {
  const { id } = Route.useParams();

  const [optionState, setOptionState] = useState<OptionSetting | undefined>(undefined);
  const { getOptionById, getOptionSettings } = settingStore();

  useEffect(() => {
    const fetchOption = async () => {
      const option = getOptionById(id);
      if (option) {
        setOptionState(option);
      } else {
        await getOptionSettings();
        const option = getOptionById(id);
        setOptionState(option);
      }
    };
    fetchOption();
  }, [id, getOptionById, getOptionSettings]);

  const handleSetOption = (option: Partial<OptionSetting>) => {
    if (!optionState) return;
    setOptionState({ ...optionState, ...option });
  };

  return <OptionSettingsDetail option={optionState} setOption={handleSetOption} />;
}
