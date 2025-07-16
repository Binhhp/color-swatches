import rootStore from "@/stores/root";
import { appBlock } from "@/utils/config";
import { Banner } from "@shopify/polaris";

export default function EnableApp({ onDismiss }: { onDismiss: () => void }) {
  const { shop } = rootStore();

  return (
    <Banner
      title='Enable app'
      action={{
        content: "Enable app",
        onAction: () => {
          if (!shop?.domain) return;
          window.open(
            appBlock.autoEnableAppEmbed.format(shop?.domain, appBlock.appBlockId),
            "_blank"
          );
        }
      }}
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
