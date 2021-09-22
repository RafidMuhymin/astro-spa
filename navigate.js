export default function () {
  return `w.navigate = (href) => {
    if (l.href !== href && l.pathname !== href && !l.hash) {
      history.pushState({}, d.title, href);
      constructPage();
    }
  };`;
}
