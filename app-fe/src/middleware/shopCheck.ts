import { redirect } from "@tanstack/react-router";

/**
 * Middleware to check if the shop parameter is present in the URL
 * This can be imported and used in any route's beforeLoad function
 */
export const checkShopParam = (search: Record<string, any>, pathname?: string) => {
  // Skip the check if we're already on the error page
  if (pathname === "/error") {
    return { shop: undefined, admin: undefined, host: undefined };
  }

  const { shop, admin, host } = search as {
    shop?: string;
    admin?: string;
    host?: string;
  };

  if (!shop) {
    throw redirect({
      to: "/error",
      search: {
        message: "Missing shop parameter"
      }
    });
  }

  return { shop, admin, host };
};
