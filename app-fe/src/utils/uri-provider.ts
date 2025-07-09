export class UriProvider {
  static GetUrlExtension(url: string): string {
    const urlParts = url.split(/[#?]/);
    let extension = urlParts[0]?.split(".").pop() ?? "";
    if (extension.includes("/")) extension = extension.split("/").pop() ?? "";
    return extension.trim();
  }

  static InsertParameters(key: string, value: string | number) {
    key = encodeURIComponent(key);
    value = encodeURIComponent(value);

    const kvp: any = document.location.search.substr(1).split("&");
    let i = 0;

    for (; i < kvp.length; i++) {
      if (kvp[i].startsWith(key + "=")) {
        const pair = kvp[i].split("=");
        pair[1] = value;
        kvp[i] = pair.join("=");
        break;
      }
    }

    if (i >= kvp.length) {
      kvp[kvp.length] = [key, value].join("=");
    }

    // can return this or...
    const params = kvp.join("&");

    // reload page with new params
    document.location.search = params;
  }
  static RemoveURLParameter = (url: string, parameter: string) => {
    //prefer to use l.search if you have a location/link object
    const urlparts: any = url.split("?");
    if (urlparts.length >= 2) {
      const prefix = encodeURIComponent(parameter) + "=";
      const pars = urlparts[1].split(/[&;]/g);

      //reverse iteration as may be destructive
      for (let i = pars.length; i-- > 0; ) {
        //idiom for string.startsWith
        if (pars[i]?.lastIndexOf(prefix, 0) !== -1) {
          pars.splice(i, 1);
        }
      }

      return urlparts[0] + (pars.length > 0 ? "?" + pars.join("&") : "");
    }
    return url;
  };
  static KeepParameters(url: string, removeParam?: string[]) {
    const queryString = window.location.search;
    const urlOutput = new URL(`${window.location.origin}${url}`);
    const paramUrlOutput = urlOutput.searchParams;
    if (queryString) {
      const kvp: any = queryString.substr(1).split("&");
      let i = 0;

      for (; i < kvp.length; i++) {
        if (kvp[i] === "source" || kvp[i] === "value") continue;
        const pair = kvp[i].split("=");
        const key: any = pair[0];
        if (removeParam?.includes(key) || key === "isSubscriptionCompleted") continue;
        const val = pair[1];
        if (!paramUrlOutput.has(key)) {
          urlOutput.searchParams.append(key, decodeURIComponent(val));
        }
      }
      return `${urlOutput.pathname}${urlOutput.search}`;
    }
    return url;
  }

  static FormatURLImage(
    url?: string,
    corsProxy?: string,
    isEncodeURI?: boolean,
    disableCorsProxy?: boolean
  ) {
    if (disableCorsProxy) return url ?? "";
    if (url) {
      return url.startsWith("http")
        ? url.startsWith("https://cdn.shopify.com")
          ? url
          : corsProxy
            ? `${corsProxy}${isEncodeURI ? encodeURIComponent(url) : url}`
            : url
        : `data:image/png;base64,${url}`;
    }
    return "";
  }
}
