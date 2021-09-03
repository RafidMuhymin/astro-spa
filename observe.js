export default function () {
  return `w.observe = async (anchor) => {
    const { href } = anchor;
    anchor.addEventListener("click", (e) => {
      if (!e.ctrlKey) {
        e.preventDefault();
        navigate(href);
      }
    });
  
    (await detectDataSaverAndCache(href)) || observer.observe(anchor);

    const callback = async () => {
      (await detectDataSaverAndCache(href)) || cache.put(href, await fetch(href));
    };

    anchor.onmouseover = callback;
    anchor.ontouchstart = callback;
  };`;
}
