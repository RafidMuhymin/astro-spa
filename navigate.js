export default function () {
  return `AstroSpa.navigate = (href, options) => {
    if (location.href !== href && location.pathname !== href) {
      history[options?.reload ? "replaceState" : "pushState"](options?.state || {}, document.title, href);
      constructPage();
    }
  };`;
}
