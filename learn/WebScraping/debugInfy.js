import { fetchStatic } from "./fetchers/staticFetcher.js";
import { fetchDynamic } from "./fetchers/dynamicFetcher.js";

(async () => {
  try {
    console.log('fetchStatic...');
    const s = await fetchStatic('https://www.infywebify.com');
    console.log('static length:', s.length);
    console.log('contains <script>:', /<script\b[^>]*>/.test(s));
  } catch (err) {
    console.error('fetchStatic failed ->', err?.message || err);
  }

  try {
    console.log('fetchDynamic...');
    const d = await fetchDynamic('https://www.infywebify.com');
    console.log('dynamic length:', d.length);
  } catch (err) {
    console.error('fetchDynamic failed ->', err?.message || err);
  } finally {
    try { await (await import('./fetchers/dynamicFetcher.js')).closeBrowser(); } catch {}
  }
})();