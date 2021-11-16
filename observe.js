export default function (
  cache,
  highPriorityPrefetch,
  prefetch,
  prefetchUpgradation
) {
  return `AstroSpa.observe = async (anchor) => {
    const addEventListener = anchor.addEventListener.bind(anchor);
    const { href } = anchor;
    const navigateCallback = (e) => {
      if (!e.ctrlKey) {
        e.preventDefault();
        AstroSpa.navigate(href);
      }
    };

    addEventListener("click", navigateCallback);
    addEventListener("keyup", (e) => { e.key === "Enter" && navigateCallback(e); });

    ${
      prefetch
        ? `if (!anchor.hasAttribute("data-spa-no-prefetch")) {
          if (!(await detectDataSaverAndCache(href))) {
            ${
              highPriorityPrefetch
                ? cache
                  ? "cachePage(href)"
                  : "fetch(href)"
                : `anchor.hasAttribute("data-spa-high-priority-prefetch")
                ? ${cache ? "cachePage(href)" : "fetch(href)"}
                : observer.observe(anchor)`
            }
          }
        
          const callback = async () => {
            if (!(await detectDataSaverAndCache(href))) {
              ${
                prefetchUpgradation
                  ? `anchor.hasAttribute("data-spa-no-prefetch-upgradation")
                      ? AstroSpa.prefetch(href)
                      : ${cache ? "cachePage(href);" : "fetch(href)"}`
                  : "AstroSpa.prefetch(href)"
              }
            }  
          };

          addEventListener("mouseover", callback);
          addEventListener("touchstart", callback, { passive: true });
        }`
        : ""
    }
  };`;
}
