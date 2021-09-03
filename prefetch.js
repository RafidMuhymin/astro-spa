export default function (highPriorityPrefetch) {
  return `w.prefetch = async (href) => {
    if (
      !d.querySelector('link[href="' + href + '"]') &&
      !(await detectDataSaverAndCache(href))
    ) {
      ${
        highPriorityPrefetch
          ? "cache.put(href, await fetch(href))"
          : `const link = d.createElement("link");
      link.href = href;
      link.rel = "prefetch";
      link.onload = () => {
        cache.add(href);
      };
      d.head.appendChild(link);`
      }
    }
  };`;
}
