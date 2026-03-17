import { fetchDynamic } from "./dynamicFetcher.js";
import { fetchStatic } from "./staticFetcher.js";

export async function fetchPage(url) {
  const staticHtml = await fetchStatic(url);

  const needDynamic =
    staticHtml.length < 5000 || /<script\b[^>]*>/.test(staticHtml);

  if (needDynamic) {
    try {
      const dynHtml = await fetchDynamic(url);
      if (dynHtml && dynHtml.length >= staticHtml.length) return dynHtml;
      return staticHtml;
    } catch (err) {
      console.warn("fetchDynamic failed for", url, "-", err?.message || err);
      return staticHtml;
    }
  }

  return staticHtml;
}
