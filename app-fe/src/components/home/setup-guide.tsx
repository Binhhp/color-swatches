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
  Collapsible
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";

const SetupGuide: React.FC = () => {
  const [completedSteps, setCompletedSteps] = React.useState(0);
  const [open, setOpen] = React.useState(true);

  const steps = [
    {
      title: "Active app embed in the theme",
      description: "Enable the app embed to activate the app on your storefront.",
      action: (
        <Button
          size='slim'
          variant='primary'
          onClick={() => {
            console.log("Enable app");
            setCompletedSteps(1);
          }}
        >
          Enable app
        </Button>
      ),
      active: true
    },
    {
      title: "Configure the options",
      description: "",
      action: null,
      active: false
    },
    {
      title: "Customize swatches",
      description: "",
      action: null,
      active: false
    }
  ];

  const progressPercent = (completedSteps / steps.length) * 100;

  return (
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
        transition={{ duration: "500ms", timingFunction: "ease-in-out" }}
        expandOnPrint
      >
        <Box paddingBlockEnd='400'>
          <ProgressBar progress={progressPercent} size='small' tone='success' />
        </Box>
        <div className='mt-5 flex flex-col gap-4'>
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
                    <g clip-path='url(#clip0_8_613)'>
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
                {completedSteps < idx && step.action && (
                  <Box paddingBlockStart='200'>{step.action}</Box>
                )}
              </Box>
            </div>
          ))}
        </div>
      </Collapsible>
    </Card>
  );
};

export default SetupGuide;
