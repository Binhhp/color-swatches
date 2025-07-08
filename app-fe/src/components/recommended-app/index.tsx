import {
  Box,
  InlineStack,
  Text,
  TextContainer,
  Collapsible,
  Icon,
  Card,
  AccountConnection
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import { useState } from "react";
import type { FC } from "react";
import oc from "@/assets/images/order-limit.png";

const RecommendedApp: FC = () => {
  const [open, setOpen] = useState(true);

  const apps = [
    {
      title: "OC Quantity Breaks Order Limit",
      description:
        "Create quantity breaks, volume discounts with upsell, bundle product maximize sales, limit purchase",
      thumbnailUrl: oc,
      link: "https://www.google.com"
    },
    {
      title: "OC Quantity Breaks Order Limit",
      description:
        "Create quantity breaks, volume discounts with upsell, bundle product maximize sales, limit purchase",
      thumbnailUrl: oc,
      link: "https://www.google.com"
    }
  ];
  return (
    <Card>
      <Box>
        <InlineStack align='space-between'>
          <TextContainer spacing='tight'>
            <Text as='h2' variant='headingMd' fontWeight='bold'>
              Recommended Apps
            </Text>
            <Text as='p' variant='bodySm' tone='subdued'>
              Apps that we have carefully selected and recommend to our merchants. We work closely
              with our Partners to offer you the best deals and experience.
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
        <div className='recommended-apps flex flex-col gap-4 mt-4'>
          {apps.map((app, index) => (
            <AccountConnection
              key={index}
              accountName={app.title}
              connected={true}
              title={app.title}
              action={{
                external: true,
                content: "Install app",
                accessibilityLabel: "Install app",
                url: app.link
              }}
              avatarUrl={app.thumbnailUrl}
              details={app.description}
            />
          ))}
        </div>
      </Collapsible>
    </Card>
  );
};

export default RecommendedApp;
