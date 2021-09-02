export default function (delay, threshold, timeout) {
  const scriptContent = `((w, d, l) => {
  requestIdleCallback(
    async () => {
      w.cs || caches.delete("spafy");
      w.cs = true;
      const cache = await caches.open("spafy");
      
      let prefetchTimeoutIDArray = [];
      let internalLinks = [];

      const observer = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry, i) => {
            entry.isIntersecting
              ? (prefetchTimeoutIDArray[i] = setTimeout(() => {
                  prefetch(entry.target.href);
                }, ${delay}))
              : clearTimeout(prefetchTimeoutIDArray[i]);
          });
        },
        { threshold: ${threshold} }
      );

      const constructPage = async () => {
        w.onNavigate && onNavigate();

        let pbw = 25;
        let intervalID;
        const progressBar = d.createElement("div");
        (() => {
          progressBar.style =
            "position: fixed; top: 0px; left: 0px; width: 25vw; transition: width 0.5s ease 0s; height: 1.25vh; background-color: #62d3f5;";
          d.body.appendChild(progressBar);

          progressBar.animate({ width: ["0", "25vw"] }, 500);

          intervalID = setInterval(() => {
            pbw += Math.random() * ((99.5 - pbw) / 10);
            progressBar.style.width = pbw + "vw";
          }, 500);
        })();

        const cachedPage = (await cache.match(l.href)) || (await fetch(l.href));
        const html = await cachedPage.text();
        const doc = new DOMParser().parseFromString(html, "text/html");

        clearInterval(intervalID);
        progressBar.animate({ width: [pbw + "vw", "100vw"] }, 100).onfinish =
          () => {
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
      };

      w.onpopstate = constructPage;

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

      w.scan = () => {
        const allInternalLinks = Array.from(d.links).filter(
          (link) =>
            link.host === l.host &&
            !link.hash &&
            !link.hasAttribute("download") &&
            link.target !== "_blank"
        );

        const newInternalLinks = allInternalLinks.filter(
          (link) => !internalLinks.includes(link)
        );

        newInternalLinks.forEach((link) => {
          observe(link);
        });

        internalLinks.push(newInternalLinks);
      };

      w.observe = async (anchor) => {
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
      };
      scan();
    },
    { timeout: ${timeout} }
  );
})(this, document, location);`;

  return scriptContent;
}