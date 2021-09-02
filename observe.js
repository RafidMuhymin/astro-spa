export default function () {
  return `w.observe = async (anchor) => {
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
      (await detectDataSaverAndCache()) || cache.put(href, await fetch(href));
    };
    anchor.onmouseover = callback;
    anchor.ontouchstart = callback;
  };`;
}
