import { createFileRoute } from "@tanstack/react-router";
import OptionSettingsTable from "@/components/option-settings";
import { Page } from "@shopify/polaris";

export const Route = createFileRoute("/list-options")({
  component: RouteComponent
});

function RouteComponent() {
  return (
    <Page>
      <OptionSettingsTable />
    </Page>
  );
}
