export default function () {
  return `w.navigate = (href) => {
    if (l.href !== href && l.pathname !== href) {
      history.pushState({}, d.title, href);
      constructPage();
    }
  };`;
}
