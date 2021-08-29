((w, d, l) => {
  requestIdleCallback(
    async () => {
      w.cs || caches.delete("spafy");
      w.cs = true;
      const cache = await caches.open("spafy");
      let prefetchTimeoutIDArray = [];

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            entry.isIntersecting
              ? (prefetchTimeoutIDArray[i] = setTimeout(() => {
                  prefetch(entry.target.href);
                }, 500))
              : clearTimeout(prefetchTimeoutIDArray[i]);
          });
        },
        { threshold: 0.25 }
      );

      Array.from(d.links)
        .filter(
          (link) =>
            link.host === l.host &&
            !link.hash &&
            !link.hasAttribute("download") &&
            link.target !== "_blank"
        )
        .forEach(async (anchor) => {
          const { href } = anchor;
          anchor.addEventListener("click", (e) => {
            if (!e.ctrlKey) {
              e.preventDefault();
              navigate(href);
            }
          });

          const detectDataSaverAndCache = async () => {
            return (
              (navigator.connection && navigator.connection.saveData) ||
              (await cache.match(href))
            );
          };

          (await detectDataSaverAndCache()) || observer.observe(anchor);

          const callback = async () => {
            (await detectDataSaverAndCache()) ||
              cache.put(href, await fetch(href));
          };
          anchor.onmouseover = callback;
          anchor.ontouchstart = callback;
        });

      const constructPage = async () => {
        w.onNavigate && onNavigate();
        const cachedPage = (await cache.match(l.href)) || (await fetch(l.href));
        const html = await cachedPage.text();
        const doc = new DOMParser().parseFromString(html, "text/html");
        d.documentElement.replaceWith(doc.documentElement);
        for (const script of d.scripts) {
          const newScript = d.createElement("script");
          newScript.textContent = script.textContent;
          for (const attr of script.attributes) {
            newScript.setAttribute(attr.name, attr.value);
          }
          script.replaceWith(newScript);
        }
        w.onMount && onMount();
        d.documentElement.animate(
          {
            opacity: [0, 1],
          },
          1000
        );
      };

      w.addEventListener("popstate", constructPage, { once: true });

      w.navigate = (href) => {
        if (l.href !== href && l.pathname !== href) {
          history.pushState({}, d.title, href);
          constructPage();
        }
      };

      w.prefetch = async (href) => {
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
      };
    },
    { timeout: 2000 }
  );
})(this, document, location);
