export default function (ignores, limit) {
  return `AstroSpa.scan = () => {
    const allInternalLinks = Array.from(document.links).filter(
      (link) =>
        link.host === location.host &&
        !link.hash &&
        !link.hasAttribute("download") &&
        !link.hasAttribute("data-spa-ignore") &&
        link.target !== "_blank" ${
          ignores.length > 0
            ? "&& ignores.includes(link.href) && ignores.includes(link.pathname)"
            : ""
        }
    );
  
    const newInternalLinks = allInternalLinks.filter(
      (link) => !internalLinks.includes(link)
    );
  
    ${
      limit > 0
        ? `newInternalLinks.splice(${limit} - internalLinks.length)`
        : ""
    }

    newInternalLinks.forEach((link) => {
      AstroSpa.observe(link);
    })
  
    internalLinks.push(...newInternalLinks);
  };`;
}
