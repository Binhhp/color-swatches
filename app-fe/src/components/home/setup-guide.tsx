import React from "react";
import {
  Card,
  TextContainer,
  Text,
  ProgressBar,
  Button,
  Box,
  InlineStack,
  Icon,
  Collapsible,
  Banner
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { appBlock } from "@/utils/config";
import rootStore from "@/stores/root";

const SetupGuide: React.FC<{ onShowOptionSettings: () => void }> = ({ onShowOptionSettings }) => {
  const { shop } = rootStore();

  const [firstTime, setFirstTime] = React.useState(true);
  const [completedSteps, setCompletedSteps] = React.useState(0);
  const [open, setOpen] = React.useState(true);

  const handleEnableApp = () => {
    if (!shop?.domain) return;
    window.open(appBlock.autoEnableAppEmbed.format(shop?.domain, appBlock.appBlockId), "_blank");
    setCompletedSteps(1);
    setFirstTime(false);
  };

  const handleConfigureOptions = () => {
    if (!shop?.domain) return;
    setCompletedSteps(2);
    onShowOptionSettings();
  };

  const handleCustomizeSwatches = () => {
    if (!shop?.domain) return;
    setCompletedSteps(3);
  };

  const steps = [
    {
      title: "Active app embed in the theme",
      description: "Enable the app embed to activate the app on your storefront.",
      action: (
        <Button size='slim' variant='primary' onClick={handleEnableApp}>
          Enable app
        </Button>
      ),
      active: true
    },
    {
      title: "Configure the options",
      description: "",
      action: (
        <Button size='slim' variant='primary' onClick={handleConfigureOptions}>
          Configure options
        </Button>
      ),
      active: false
    },
    {
      title: "Customize swatches",
      description: "",
      action: (
        <Button size='slim' variant='primary' onClick={handleCustomizeSwatches}>
          Customize
        </Button>
      ),
      active: false
    }
  ];

  const progressPercent = (completedSteps / steps.length) * 100;

  const showBannerSuccess = completedSteps === 3 && (
    <div className='mb-5'>
      <Banner
        title='Your widget is working!'
        tone='success'
        action={{
          content: `Contact us`
        }}
        onDismiss={() => {}}
      >
        <p>
          Please check your store to ensure the widget is running as expected. If you don't see it
          working, don't worry—just contact us.
        </p>
      </Banner>
    </div>
  );

  const renderAction = (idx: number, step: any) => {
    if (!step.action) return <></>;
    if (completedSteps === idx || (firstTime && completedSteps === 0 && idx === 0)) {
      return <Box paddingBlockStart='200'>{step.action}</Box>;
    }
    return <></>;
  };

  return (
    <>
      {showBannerSuccess}
      <Card>
        <Box paddingBlockEnd='400'>
          <InlineStack align='space-between'>
            <TextContainer spacing='tight'>
              <Text as='h2' variant='headingMd' fontWeight='bold'>
                Setup guide
              </Text>
              <Text as='p' variant='bodySm' tone='subdued'>
                Use this personalized guide to get your app up and running.
              </Text>
            </TextContainer>
            <div className='cursor-pointer' onClick={() => setOpen(!open)}>
              <Icon source={open ? (ChevronDownIcon as any) : (ChevronUpIcon as any)} tone='base' />
            </div>
          </InlineStack>
        </Box>
        <Collapsible
          open={open}
          id='setup-guide-collapsible'
          transition={{ duration: "300ms", timingFunction: "ease-in-out" }}
          expandOnPrint
        >
          <Box paddingBlockEnd='400'>
            <ProgressBar progress={progressPercent} size='small' tone='success' />
          </Box>
          <div className='mt-5 flex flex-col gap-4 m-1'>
            {steps.map((step, idx) => (
              <div key={idx} className='flex items-start gap-5'>
                {completedSteps >= idx + 1 ? (
                  <div className='w-5 h-5 rounded-full bg-green-500'>
                    <svg
                      width='20'
                      height='20'
                      viewBox='0 0 20 20'
                      fill='none'
                      xmlns='http://www.w3.org/2000/svg'
                    >
                      <g clipPath='url(#clip0_8_613)'>
                        <rect width='20' height='20' rx='10' fill='#303030' />
                        <path
                          fillRule='evenodd'
                          clipRule='evenodd'
                          d='M14.0303 7.21967C14.3232 7.51256 14.3232 7.98744 14.0303 8.28033L9.53033 12.7803C9.23744 13.0732 8.76256 13.0732 8.46967 12.7803L6.21967 10.5303C5.92678 10.2374 5.92678 9.76256 6.21967 9.46967C6.51256 9.17678 6.98744 9.17678 7.28033 9.46967L9 11.1893L12.9697 7.21967C13.2626 6.92678 13.7374 6.92678 14.0303 7.21967Z'
                          fill='white'
                        />
                      </g>
                      <defs>
                        <clipPath id='clip0_8_613'>
                          <rect width='20' height='20' rx='10' fill='white' />
                        </clipPath>
                      </defs>
                    </svg>
                  </div>
                ) : (
                  <div
                    style={{
                      width: "20px",
                      height: "20px",
                      borderRadius: "50%",
                      border: "1px dashed #000000"
                    }}
                  ></div>
                )}
                <Box>
                  <Text as='span' variant='bodyMd' fontWeight='medium'>
                    {step.title}
                  </Text>
                  {step.description && (
                    <Text as='p' variant='bodySm' tone='subdued'>
                      {step.description}
                    </Text>
                  )}
                  {renderAction(idx, step)}
                </Box>
              </div>
            ))}
          </div>
        </Collapsible>
      </Card>
    </>
  );
};

export default SetupGuide;
