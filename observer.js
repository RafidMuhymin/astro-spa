export default function (delay, prefetch, root, rootMargin, threshold) {
  return prefetch
    ? `const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            entry.isIntersecting
              ? (prefetchTimeoutIDArray[i] = setTimeout(() => {
                  AstroSpa.prefetch(entry.target.href);
                }, ${delay}))
              : clearTimeout(prefetchTimeoutIDArray[i]);
          });
        },
        {${
          root && rootMargin
            ? `root: document.querySelector("${root}"), rootMargin: "${rootMargin}",`
            : root
            ? `root: document.querySelector("${root}"),`
            : rootMargin
            ? `rootMargin: "${rootMargin}",`
            : ""
        } threshold: ${threshold} }
      );`
    : "";
}
