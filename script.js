import observer from "./observer";
import constructPage from "./constructPage";
import navigate from "./navigate";
import prefetchFunction from "./prefetch";
import scan from "./scan";
import observe from "./observe";

export default function (
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
  secondaryProgressBar,
  SPBColor,
  threshold,
  timeout
) {
  const timeoutString =
    typeof timeout === "number" ? `, { timeout: ${timeout} }` : "";
  return `
  ((w, d, l) => {
    ${
      localLinkDetector
        ? `d.querySelectorAll("[data-active-class]").forEach((element) => {
      element.classList.remove("active");
      element.href === document.URL && element.classList.add(element.getAttribute("data-active-class"));
    });`
        : ""
    }

    const callback = async () => {
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
        observer(delay, prefetch, root, rootMargin, threshold) +
        constructPage(
          cache,
          containerSelector,
          defaultAnimation,
          PPBColor,
          progressBar,
          secondaryProgressBar,
          SPBColor
        )
      }
      w.onpopstate = constructPage;
      ${
        navigate() +
        prefetchFunction(cache, prefetch) +
        scan(ignores, limit) +
        observe(cache, highPriorityPrefetch, prefetch, prefetchUpgradation)
      }
      scan();
    };
    requestIdleCallback${
      forceRequestIdleCallback
        ? `(callback${timeoutString});`
        : `? requestIdleCallback(callback${timeoutString})
      : setTimeout(callback${timeoutString});`
    }
})(this, document, location);`;
}
