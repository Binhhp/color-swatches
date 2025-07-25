import CommonApi from "@/apis/common.api";
import EnableApp from "@/components/home/enable-app";
import SetupGuide from "@/components/home/setup-guide";
import RecommendedApp from "@/components/recommended-app";
import VideoTutorials from "@/components/video-tutorials";
import rootStore from "@/stores/root";
import { Page } from "@shopify/polaris";
import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

export const Route = createFileRoute("/")({
  component: Index,
  loader: async () => {
    const isEnabled = await CommonApi.CheckThemeEnabled();
    return { isEnabled };
  }
});

function Index() {
  const { isEnabled } = Route.useLoaderData();
  const { shop } = rootStore();
  const [isEnableApp, setIsEnableApp] = useState<boolean | undefined>(undefined);
  const handleDismiss = () => {
    setIsEnableApp(true);
  };

  useEffect(() => {
    setIsEnableApp(isEnabled ?? false);
  }, []);

  return (
    <Page
      title='Welcome to SwatchPilot 🎉'
      subtitle='Effortlessly manage and display product variants to drive more sales.'
    >
      {isEnableApp !== undefined && !isEnableApp && (
        <div className='mb-5'>
          <EnableApp onDismiss={handleDismiss} />
        </div>
      )}

      {!shop?.isSettingOption && (
        <div className='mb-5'>
          <SetupGuide />
        </div>
      )}

      <div className='mb-5'>
        <VideoTutorials />
      </div>
      <div className='mb-5'>
        <RecommendedApp />
      </div>
    </Page>
  );
}
