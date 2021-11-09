export default function () {
  return `w.navigate = (href, options) => {
    if (l.href !== href && l.pathname !== href) {
      history[options?.reload ? "replaceState" : "pushState"](options?.state || {}, d.title, href);
      constructPage();
    }
  };`;
}
