import analyticsFunction from "./analytics";
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
  limit,
  localLinkDetector,
  PPBColor,
  prefetch,
  prefetchUpgradation,
  progressBar,
  root,
  rootMargin,
  scanOnMount,
  scrollIntoView,
  scrollIntoViewOptions,
  secondaryProgressBar,
  SPBColor,
  threshold,
  timeout
) {
  const timeoutString =
    typeof timeout === "number" ? `, { timeout: ${timeout} }` : "";
  return `
  ((w, d, l) => {
    const AstroSpa = w.spa ||= {};
    ${
      localLinkDetector
        ? `const styleLocalLink = () => {
            d.querySelectorAll("[data-active-class]").forEach((element) => {
              element.classList.remove("active");
              element.href === document.URL && element.classList.add(element.getAttribute("data-active-class"));
            });
          };
          styleLocalLink();`
        : ""
    }

    const callback = async () => {
      ${
        cache
          ? `AstroSpa.cs || caches.delete("spafy");
      AstroSpa.cs = true;
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
          navigator.connection?.saveData ${
            cache ? "|| (await cache.match(href))" : ""
          }
        );
      };`
          : ""
      }

      ${
        observer(delay, prefetch, root, rootMargin, threshold) +
        constructPage(
          analytics,
          cache,
          containerSelector,
          defaultAnimation,
          localLinkDetector,
          PPBColor,
          progressBar,
          scanOnMount,
          scrollIntoView,
          scrollIntoViewOptions,
          secondaryProgressBar,
          SPBColor
        )
      }

      w.addEventListener("popstate", () => { l.hash || constructPage(); });

      ${
        navigate() +
        prefetchFunction(cache, prefetch) +
        scan(ignores, limit) +
        observe(cache, highPriorityPrefetch, prefetch, prefetchUpgradation)
      }
      AstroSpa.scan();
      ${analyticsFunction(analytics)}
    };
    requestIdleCallback${
      forceRequestIdleCallback
        ? `(callback${timeoutString});`
        : `? requestIdleCallback(callback${timeoutString})
      : setTimeout(callback${timeoutString});`
    }
  })(this, document, location);`;
}
