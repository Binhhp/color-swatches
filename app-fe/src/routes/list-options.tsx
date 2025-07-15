import { createFileRoute, useNavigate } from "@tanstack/react-router";
import OptionSettingsTable from "@/components/option-settings";
import { Page } from "@shopify/polaris";
import { UriProvider } from "@/utils/uri-provider";
import settingStore from "@/stores/setting";

export const Route = createFileRoute("/list-options")({
  component: RouteComponent
});

function RouteComponent() {
  const navigate = useNavigate();
  const { optionSettings } = settingStore();
  return (
    <Page
      backAction={{
        content: "Back to Home",
        onAction: () => {
          if (!optionSettings.some((x) => !x.animation?.hoverAnimation)) {
            window.step = 1;
          }
          navigate({ to: UriProvider.KeepParameters("/") });
        }
      }}
    >
      <OptionSettingsTable isBackList />
    </Page>
  );
}
