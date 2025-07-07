import EnableApp from "@/components/home/enable-app";
import SetupGuide from "@/components/home/setup-guide";
import { Page } from "@shopify/polaris";
import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";

export const Route = createFileRoute("/")({
  component: Index
});

function Index() {
  const [isEnableApp, setIsEnableApp] = useState(false);
  const handleDismiss = () => {
    setIsEnableApp(true);
  };
  return (
    <Page
      title='Welcome to SwatchPilot 🎉'
      subtitle='Effortlessly manage and display product variants to drive more sales.'
    >
      {!isEnableApp && <EnableApp onDismiss={handleDismiss} />}
      <div className='mt-5'>
        <SetupGuide />
      </div>
    </Page>
  );
}
