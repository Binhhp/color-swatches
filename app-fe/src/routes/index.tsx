import { Page } from "@shopify/polaris";
import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Index
});

function Index() {
  return <Page title='Home'>Home page</Page>;
}
