import { AppProvider, Frame } from "@shopify/polaris";
import translations from "@shopify/polaris/locales/en.json";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider, createRouter } from "@tanstack/react-router";
import ReactDOM from "react-dom/client";

import "@/index.css";
import "@shopify/polaris/build/esm/styles.css";

// Import the generated route tree
import { routeTree } from "./routeTree.gen";
import { Menu } from "./layout/menu";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1 * 60 * 60 * 1000,
      refetchOnWindowFocus: false,
      retry: false
    }
  }
});

// Set up a Router instance
const router = createRouter({
  routeTree,
  context: {
    queryClient
  },
  defaultPreload: "intent",
  // Since we're using React Query, we don't want loader calls to ever be stale
  // This will ensure that the loader is always called when the route is preloaded or visited
  defaultPreloadStaleTime: 0,
  scrollRestoration: true
});

// Register the router instance for type safety
declare module "@tanstack/react-router" {
  interface Register {
    router: typeof router;
  }
}

(String.prototype as any).format = function (...args: any[]) {
  const stringReplace = this.replace(/{(\d+)}/g, function (match: any, number: any) {
    return typeof args[number] != "undefined" ? args[number] : match;
  });
  return stringReplace;
};

// Render the app
const rootElement = document.getElementById("root")!;
if (!rootElement.innerHTML) {
  const root = ReactDOM.createRoot(rootElement);
  root.render(
    <AppProvider i18n={translations}>
      <Menu />
      <Frame>
        <QueryClientProvider client={queryClient}>
          <RouterProvider router={router} />
        </QueryClientProvider>
      </Frame>
    </AppProvider>
  );
}
