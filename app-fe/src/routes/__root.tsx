import { ReactQueryDevtools } from "@tanstack/react-query-devtools";
import { createRootRouteWithContext, Outlet, redirect } from "@tanstack/react-router";
import { TanStackRouterDevtools } from "@tanstack/react-router-devtools";

import { checkShopParam } from "@/middleware/shopCheck";
import rootStore from "@/stores/root";
import type { QueryClient } from "@tanstack/react-query";
import { Frame } from "@shopify/polaris";

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient;
}>()({
  beforeLoad: async (ctx) => {
    const { shop, admin, host } = checkShopParam(ctx.search, ctx.location.pathname);
    ctx.context.queryClient.setQueryData(["shopify-api-key"], {
      shop,
      admin,
      host
    });

    if (shop) {
      try {
        await ctx.context.queryClient.fetchQuery({
          queryKey: ["shop", shop],
          queryFn: () => rootStore.getState().getShop(shop)
        });
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
      } catch (error: any) {
        throw redirect({
          to: "/error",
          search: {
            message: error?.message || "Failed to load shop data. Please try again."
          }
        });
      }
    }
  },
  component: () => (
    <Frame>
      <Outlet />
      <TanStackRouterDevtools position='bottom-right' />
      <ReactQueryDevtools buttonPosition='bottom-left' />
    </Frame>
  )
});
