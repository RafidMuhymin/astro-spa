export default function (
  containerSelector,
  scrollIntoView,
  scrollIntoViewOptions,
  localLinkDetector,
  scanOnMount,
  analytics,
  defaultAnimation
) {
  return `${
    containerSelector
      ? `const newContent = doc.querySelector("${containerSelector}");
        const container = document.querySelector("${containerSelector}");
        container.replaceWith(newContent);
        ${
          scrollIntoView
            ? `newContent.scrollIntoView(${JSON.stringify(scrollIntoViewOptions)});`
            : ""
        }
        document.head.replaceWith(doc.head);
        ${localLinkDetector ? "styleLocalLink();" : ""}`
      : `document.documentElement.replaceWith(doc.documentElement);` +
        (scrollIntoView
          ? `document.documentElement.scrollIntoView(${JSON.stringify(
              scrollIntoViewOptions
            )});`
          : "")
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
}
