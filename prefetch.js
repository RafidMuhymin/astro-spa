export default function (cache, prefetch) {
  return prefetch
    ? `AstroSpa.prefetch = async (href) => {
    if (
      !document.querySelector('link[href="' + href + '"]') &&
      !(await detectDataSaverAndCache(href))
    ) {
      const link = document.createElement("link");
      link.href = href;
      link.rel = "prefetch";
      ${
        cache
          ? `link.onload = () => {
              cache.add(href);
            };`
          : ""
      }
      document.head.appendChild(link);
    }
  };`
    : "";
}
