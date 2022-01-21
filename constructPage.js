import buildPage from "./buildPage";
import buildProgressBar from "./progressBar";

export default function (
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
) {
  const builtPage = buildPage(
    containerSelector,
    scrollIntoView,
    scrollIntoViewOptions,
    localLinkDetector,
    scanOnMount,
    analytics,
    defaultAnimation
  );

  return `const constructPage = async () => {
    window.dispatchEvent(new Event("navigate"));
    window.onNavigate && window.onNavigate();

    ${buildProgressBar(progressBar, progressBarOptions)}

    const cachedPage = ${
      cache
        ? `(await cache.match(location.href)) ||
            (await (cachePage(location.href))) ||
            (await cache.match(location.href));`
        : "(await fetch(location.href));"
    }

    const html = await cachedPage.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    ${
      progressBar
        ? progressBarOptions?.secondary
          ? `clearInterval(intervalID);
      ${containerSelector ? "progressBar.remove();bgProgressBar.remove();" : ""}
      ${builtPage}`
          : `clearInterval(intervalID);
      progressBar.animate({ width: [pbw + "vw", "100vw"] }, 100).onfinish =
      () => {
          ${containerSelector ? "progressBar.remove();" : ""}
          ${builtPage}
      };`
        : builtPage
    }

    document.getElementById("astro-spa-live-region").textContent = document.title;
    };`;
}
