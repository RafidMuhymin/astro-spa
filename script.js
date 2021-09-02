import observer from "./observer";
import constructPage from "./constructPage";
import navigate from "./navigate";
import prefetch from "./prefetch";
import scan from "./scan";
import observe from "./observe";

export default function (
  limit,
  origins,
  external,
  ignores,
  isHighPriority,
  root,
  rootMargin,
  threshold,
  timeout,
  delay
) {
  return `((w, d, l) => {
  requestIdleCallback(
    async () => {
      w.cs || caches.delete("spafy");
      w.cs = true;
      const cache = await caches.open("spafy");
      
      let prefetchTimeoutIDArray = [];
      let internalLinks = [];

      ${observer(delay, root, rootMargin, threshold) + constructPage()}
      w.onpopstate = constructPage;
      ${navigate() + prefetch() + scan() + observe()}
      scan();
    },
    { timeout: ${timeout} }
  );
})(this, document, location);`;
}
