import buildAnalytics from "./analytics";
import constructPage from "./constructPage";
import observe from "./observe";
import observer from "./observer";
import navigate from "./navigate";
import prefetchFunction from "./prefetch";
import scan from "./scan";

export default function (
  analytics,
  cache,
  containerSelector,
  defaultAnimation,
  delay,
  forceRequestIdleCallback,
  highPriorityPrefetch,
  ignores,
  intersectionObserverOptions,
  limit,
  localLinkDetector,
  prefetch,
  prefetchUpgradation,
  progressBar,
  progressBarOptions,
  scanOnMount,
  scrollIntoView,
  scrollIntoViewOptions,
  timeout
) {
  const timeoutString =
    typeof timeout === "number" ? `, { timeout: ${timeout} }` : "";
  return `
  ((window, document, location) => {
    const AstroSpa = window.spa ||= {};
    ${
      localLinkDetector
        ? `const styleLocalLink = () => {
            document.querySelectorAll("[data-active-class]").forEach((element) => {
              element.classList.remove("active");
              element.href === document.URL && element.classList.add(element.getAttribute("data-active-class"));
            });
          };
          styleLocalLink();`
        : ""
    }

    document.documentElement.insertAdjacentHTML(
      "beforeend",
      '<div role="region" style="display: none;" aria-live="polite" aria-atomic="true" id="astro-spa-live-region"></div>'
    );

    const callback = async () => {
      ${
        cache
          ? `AstroSpa.cs || caches.delete("astro-spa");
      AstroSpa.cs = true;
      const cache = await caches.open("astro-spa");
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
          navigator.connection?.saveData ${
            cache ? "|| (await cache.match(href))" : ""
          }
        );
      };`
          : ""
      }

      ${
        observer(delay, intersectionObserverOptions, prefetch) +
        constructPage(
          analytics,
          cache,
          containerSelector,
          defaultAnimation,
          localLinkDetector,
          progressBar,
          progressBarOptions,
          scanOnMount,
          scrollIntoView,
          scrollIntoViewOptions
        )
      }

      window.addEventListener("popstate", () => { location.hash || constructPage(); });

      ${
        navigate() +
        prefetchFunction(cache, prefetch) +
        scan(ignores, limit) +
        observe(cache, highPriorityPrefetch, prefetch, prefetchUpgradation)
      }
      AstroSpa.scan();
      ${buildAnalytics(analytics)}
    };
    requestIdleCallback${
      forceRequestIdleCallback
        ? `(callback${timeoutString});`
        : `? requestIdleCallback(callback${timeoutString})
      : setTimeout(callback${timeoutString});`
    }
  })(this, document, location);`;
}
