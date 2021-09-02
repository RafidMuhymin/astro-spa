export default function () {
  return `w.prefetch = async (href) => {
    if (
      !d.querySelector('link[href="' + href + '"]') &&
      !(await cache.match(href))
    ) {
      const link = d.createElement("link");
      link.href = href;
      link.rel = "prefetch";
      link.onload = () => {
        cache.add(href);
      };
      d.head.appendChild(link);
    }
  };`;
}
