export default function (cache, prefetch) {
  return prefetch
    ? `w.prefetch = async (href) => {
    if (
      !d.querySelector('link[href="' + href + '"]') &&
      !(await detectDataSaverAndCache(href))
    ) {
      const link = d.createElement("link");
      link.href = href;
      link.rel = "prefetch";
      ${
        cache
          ? `link.onload = () => {
              cache.add(href);
            };`
          : ""
      }
      d.head.appendChild(link);
    }
  };`
    : "";
}
