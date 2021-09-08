import buildProgressBar from "./progressBar";

export default function (
  cache,
  containerSelector,
  defaultAnimation,
  PPBColor,
  progressBar,
  secondaryProgressBar,
  SPBColor
) {
  const buildPage = `${
    containerSelector
      ? `const newContent = doc.querySelector("${containerSelector}");
      d.querySelector("${containerSelector}").replaceWith(newContent);
      d.head.replaceWith(doc.head);`
      : "d.documentElement.replaceWith(doc.documentElement);"
  }
  [
    ...d.${
      containerSelector
        ? `querySelectorAll("head script, ${containerSelector} script")`
        : "scripts"
    }
  ].forEach((script) => {
    const newScript = d.createElement("script");
    newScript.textContent = script.textContent;
    for (const attr of script.attributes) {
      newScript.setAttribute(attr.name, attr.value);
    }
    script.replaceWith(newScript);
  });
  w.onMount && onMount();
  ${
    defaultAnimation
      ? `${containerSelector ? "newContent" : "d.documentElement"}.animate(
      {
      opacity: [0, 1],
      },
      1000
  );`
      : ""
  }`;
  return `const constructPage = async () => {
    w.onNavigate && onNavigate();

    ${buildProgressBar(PPBColor, progressBar, secondaryProgressBar, SPBColor)}

    const cachedPage = ${
      cache
        ? `(await cache.match(l.href)) ||
            (await (cachePage(l.href))) ||
            (await cache.match(l.href));`
        : "(await fetch(l.href));"
    }

    const html = await cachedPage.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    ${
      progressBar
        ? `clearInterval(intervalID);
        progressBar.animate({ width: [pbw + "vw", "100vw"] }, 100).onfinish =
        () => {
            ${containerSelector ? "progressBar.remove();" : ""}
            ${buildPage}
        };`
        : secondaryProgressBar
        ? `clearInterval(intervalID);
          ${
            containerSelector
              ? "progressBar.remove();bgProgressBar.remove();"
              : ""
          }
          ${buildPage};`
        : buildPage
    }
    };`;
}
