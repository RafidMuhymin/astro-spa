export default function () {
  return `w.scan = () => {
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
  };`;
}
