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
  const buildPage = `${
    containerSelector
      ? `const newContent = doc.querySelector("${containerSelector}");
      ${
        scrollIntoView
          ? `const container = document.querySelector("${containerSelector}");
      container.replaceWith(newContent);
      newContent.scrollIntoView(${JSON.stringify(scrollIntoViewOptions)});`
          : ""
      }
      document.head.replaceWith(doc.head);
      ${localLinkDetector ? "styleLocalLink();" : ""}`
      : "document.documentElement.replaceWith(doc.documentElement);"
  }
    [
      ...document.${
        containerSelector
          ? `querySelectorAll("head script, ${containerSelector} script")`
          : "scripts"
      }
    ].forEach((script) => {
      const newScript = document.createElement("script");
      newScript.text = script.text;
      for (const attr of script.attributes) {
        newScript.setAttribute(attr.name, attr.value);
      }
      script.replaceWith(newScript);
    });

    ${scanOnMount ? "AstroSpa.scan();" : ""}
    ${analytics ? "AstroSpa.track();" : ""}
    window.dispatchEvent(new Event("mount"));
    window.onMount && window.onMount();

    ${
      defaultAnimation
        ? `${
            containerSelector ? "newContent" : "document.documentElement"
          }.animate(
        {
        opacity: [0, 1],
        },
        1000
    );`
        : ""
    }`;

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
      ${buildPage}`
          : `clearInterval(intervalID);
      progressBar.animate({ width: [pbw + "vw", "100vw"] }, 100).onfinish =
      () => {
          ${containerSelector ? "progressBar.remove();" : ""}
          ${buildPage}
      };`
        : ""
    }
    };`;
}
