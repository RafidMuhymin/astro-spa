import observer from "./observer";
import constructPage from "./constructPage";
import navigate from "./navigate";
import prefetchFunction from "./prefetch";
import scan from "./scan";
import observe from "./observe";

export default function (
  cache,
  delay,
  highPriorityPrefetch,
  ignores,
  limit,
  prefetch,
  prefetchUpgradation,
  root,
  rootMargin,
  threshold,
  timeout
) {
  return `((w, d, l) => {
  requestIdleCallback(
    async () => {
      ${
        cache
          ? `w.cs || caches.delete("spafy");
      w.cs = true;
      const cache = await caches.open("spafy");
      const cachePage = async (href) => {
        return cache.put(href, await fetch(href));
      }`
          : ""
      }

      let internalLinks = [];

      ${
        prefetch
          ? `let prefetchTimeoutIDArray = [];
      const detectDataSaverAndCache = async (href) => {
        return (
          (navigator.connection && navigator.connection.saveData) ${
            cache ? "|| (await cache.match(href))" : ""
          }
        );
      };`
          : ""
      }

      ${
        observer(prefetch, delay, root, rootMargin, threshold) +
        constructPage(cache)
      }
      w.onpopstate = constructPage;
      ${
        navigate() +
        prefetchFunction(prefetch, cache) +
        scan(limit, ignores) +
        observe(prefetch, prefetchUpgradation, highPriorityPrefetch, cache)
      }
      scan();
    },
    { timeout: ${timeout} }
  );
})(this, document, location);`;
}
