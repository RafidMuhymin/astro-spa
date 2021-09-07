export default function (delay, prefetch, root, rootMargin, threshold) {
  return prefetch
    ? `const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            entry.isIntersecting
              ? (prefetchTimeoutIDArray[i] = setTimeout(() => {
                  prefetch(entry.target.href);
                }, ${delay}))
              : clearTimeout(prefetchTimeoutIDArray[i]);
          });
        },
        {${
          root && rootMargin
            ? `root: ${root}, rootMargin: ${rootMargin},`
            : root
            ? `root: ${root},`
            : rootMargin
            ? `rootMargin: ${rootMargin},`
            : ""
        } threshold: ${threshold} }
      );`
    : "";
}
