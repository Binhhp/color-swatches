import {
  Box,
  TextContainer,
  Card,
  InlineStack,
  Text,
  Icon,
  Collapsible,
  VideoThumbnail
} from "@shopify/polaris";
import { ChevronDownIcon, ChevronUpIcon } from "@shopify/polaris-icons";
import React from "react";
import tutorial from "@/assets/images/tutorials.png";

import "@fancyapps/ui/dist/fancybox/fancybox.css";
import FancyBox from "../fancybox";

const VideoTutorials = () => {
  const [open, setOpen] = React.useState(true);
  const videos = [
    {
      title: "Video 1",
      thumbnailUrl: tutorial,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoLength: 156
    },
    {
      title: "Video 2",
      thumbnailUrl: tutorial,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoLength: 156
    },
    {
      title: "Video 3",
      thumbnailUrl: tutorial,
      videoUrl: "https://www.youtube.com/watch?v=dQw4w9WgXcQ",
      videoLength: 156
    }
  ];
  return (
    <Card>
      <Box>
        <InlineStack align='space-between'>
          <TextContainer spacing='tight'>
            <Text as='h2' variant='headingMd' fontWeight='bold'>
              Video tutorial
            </Text>
            <Text as='p' variant='bodySm' tone='subdued'>
              Follow tutorial videos to get used to the app quickly
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
        <div className='grid grid-cols-3 gap-4 mt-4'>
          {videos.map((video) => (
            <FancyBox key={video.title + "video"} src={video.videoUrl}>
              <VideoThumbnail
                key={video.title}
                videoLength={video.videoLength}
                thumbnailUrl={video.thumbnailUrl}
                onClick={() => {}}
              />
            </FancyBox>
          ))}
        </div>
      </Collapsible>
    </Card>
  );
};

export default VideoTutorials;
