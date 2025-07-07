import { Banner } from "@shopify/polaris";

export default function EnableApp({ onDismiss }: { onDismiss: () => void }) {
  return (
    <Banner
      title='Enable app'
      action={{ content: "Enable app" }}
      tone='warning'
      onDismiss={onDismiss}
    >
      <p>
        To ensure SwatchPilot works correctly on your store, Shopify now requires you to enable the
        theme editor. This update will help improve app performance and compatibility.
      </p>
    </Banner>
  );
}
