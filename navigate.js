export default function () {
  return `AstroSpa.navigate = (href, options) => {
    if (l.href !== href && l.pathname !== href) {
      history[options?.reload ? "replaceState" : "pushState"](options?.state || {}, d.title, href);
      constructPage();
    }
  };`;
}
