import type { OptionSetting } from "@/models/common/setting.model";
import { type FC, useState } from "react";
import {
  Page,
  Text,
  Button,
  Select,
  Checkbox,
  BlockStack,
  SkeletonBodyText,
  AccountConnection,
  Divider
} from "@shopify/polaris";
import { UriProvider } from "@/utils/uri-provider";
import { useNavigate } from "@tanstack/react-router";
import { OptionValue } from "./option-value";
import CustomizeModal from "./customize-modal";
import { positionMap, templateOptions } from "./template";

export const OptionSettingsDetail: FC<{
  option: OptionSetting | undefined;
  setOption: (option: Partial<OptionSetting>) => void;
  onSave: () => Promise<void>;
  isSaving: boolean;
}> = ({ option, setOption, onSave, isSaving }) => {
  // For position
  const allPositions = ["product-page", "collection-page", "home-page"];
  const handleAction = () => {
    if (!option) return;
    setOption({ ...option, isActive: !option?.isActive });
  };

  const navigate = useNavigate();

  const handleBack = () => {
    navigate({ to: UriProvider.KeepParameters("/list-options") });
  };

  const styleOptions = templateOptions.find((t) => t.value === option?.template)?.options ?? [];

  const handleTemplateChange = (value: string) => {
    setOption({ ...option, template: value as string, style: styleOptions[0]?.value });
  };

  const handleStyleChange = (value: string) => {
    setOption({ ...option, style: value as string });
  };

  const handlePositionChange = (pos: string, checked: boolean) => {
    if (!option) return;
    setOption({
      ...option,
      position: checked ? [...option.position, pos] : option.position.filter((p) => p !== pos)
    });
  };

  const [openCustomize, setOpenCustomize] = useState(false);

  return (
    <Page
      primaryAction={{
        content: "Save",
        loading: isSaving,
        disabled: isSaving,
        onAction: onSave
      }}
      backAction={{
        content: option?.name || "Option",
        onAction: handleBack
      }}
      title={option?.name || "Option"}
      subtitle={`${option?.values?.length ?? 0} value`}
    >
      <CustomizeModal
        setOption={setOption}
        open={openCustomize}
        onClose={() => setOpenCustomize(false)}
        option={option}
      />

      {!option && <SkeletonBodyText lines={8} />}

      {option && (
        <BlockStack gap='400'>
          {/* Active widget */}
          <div className='flex items-center justify-between mt-1.5'>
            <BlockStack gap='200'>
              <Text variant='headingMd' as='h3'>
                Active widget to display your swatches
              </Text>
              <Text variant='bodyMd' as='span' tone='subdued'>
                Allow widget to display on the page you want
              </Text>
            </BlockStack>
            <div className='option-active'>
              <AccountConnection
                title='Active widget'
                action={{
                  content: !option.isActive ? "Active" : "Inactive",
                  onAction: handleAction
                }}
                details='Allow widget to display on the page you want'
              />
            </div>
          </div>

          <div className='mt-8 mb-8'>
            <Divider borderColor='border' />
          </div>
          {/* Setting */}
          <div className='flex items-center justify-between'>
            <BlockStack gap='200'>
              <Text variant='headingMd' as='h3'>
                Setting
              </Text>
              <Text variant='bodyMd' as='span' tone='subdued'>
                Setting layout, active template and choose page to display
              </Text>
            </BlockStack>
            <div className='flex flex-col gap-4'>
              <div className='flex flex-row gap-5 justify-between items-end option-setting-template'>
                <Select
                  label='Template'
                  options={templateOptions.map((x) => ({
                    label: x.label,
                    value: x.value
                  }))}
                  value={option.template}
                  onChange={handleTemplateChange}
                />
                <Select
                  label='Style'
                  options={styleOptions}
                  value={option.style}
                  onChange={handleStyleChange}
                />
                <Button size='medium' onClick={() => setOpenCustomize(true)}>
                  Customize
                </Button>
              </div>
              <div className='flex flex-col gap-3.5'>
                <Text variant='bodyMd' as='span' tone='subdued'>
                  Position
                </Text>
                <div className='flex flex-row gap-10'>
                  {allPositions.map((pos) => (
                    <Checkbox
                      key={pos}
                      label={positionMap[pos]}
                      checked={option.position.includes(pos)}
                      onChange={(checked) => handlePositionChange(pos, checked)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className='mt-8 mb-8'>
            <Divider borderColor='border' />
          </div>
          {/* Table value/preview */}
          <OptionValue option={option} setOption={setOption} />
        </BlockStack>
      )}
    </Page>
  );
};
