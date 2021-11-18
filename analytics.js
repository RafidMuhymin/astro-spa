export default function ({
  trackingID,
  anonymizeIP = true,
  colorDepth = true,
  characterSet = true,
  screenSize = true,
  language = true,
  fingerprinting = true,
  trackingPeriod = "year",
} = {}) {
  if (trackingID) {
    return `
    ${trackingPeriod !== "year" ? `const date = new Date();` : ""}
    AstroSpa.cid ||= new TextDecoder().decode(await crypto.subtle.digest(
      "SHA-256", new TextEncoder().encode(
        ${
          fingerprinting
            ? `(await (await fetch("https://api64.ipify.org")).text()) +
                navigator.userAgent +
                ${
                  trackingPeriod === "year"
                    ? `new Date().getYear()`
                    : trackingPeriod === "month"
                    ? `date.getYear() + date.getMonth()`
                    : trackingPeriod === "day"
                    ? `date.getYear() + date.getMonth() + date.getDate()`
                    : ""
                }
              `
            : `new Date() + Math.random()`
        }
      )
    ));
    const track = AstroSpa.track ||= (
      type,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      exceptionDescription,
      exceptionFatal
    ) => {
      const url = "https://www.google-analytics.com/collect";
      const data = {
        v: "1",
        ds: "web",
        ${anonymizeIP ? "aip: 1," : ""}
        tid: "${trackingID}",
        cid: AstroSpa.cid,
        t: type || "pageview",
        ${colorDepth ? `sd: screen.colorDepth + "-bits",` : ""}
        dr: document.referrer || undefined,
        dt: document.title,
        dl: location.origin + location.pathname + location.search,
        ${language ? `ul: navigator.language.toLowerCase(),` : ""}
        ${characterSet ? `de: document.characterSet,` : ""}
        ${screenSize ? `sr: screen.width + "x" + screen.height,` : ""}
        ${
          screenSize
            ? `vp: visualViewport.width + "x" + visualViewport.height,`
            : ""
        }
        ec: eventCategory || undefined,
        ea: eventAction || undefined,
        el: eventLabel || undefined,
        ev: eventValue || undefined,
        exd: exceptionDescription || undefined,
        exf:
          typeof exceptionFatal !== "undefined" && !!exceptionFatal === false
            ? 0
            : undefined,
      };
      navigator.sendBeacon(
        url,
        new URLSearchParams(
          Object.keys(data).forEach((key) => data[key] || delete data[key])
        ).toString()
      );
    };
    AstroSpa.trackEvent ||= (category, action, label, value) =>
      track("event", category, action, label, value);
    AstroSpa.trackException ||= (description, fatal) =>
      track("exception", null, null, null, null, description, fatal);
    track();`;
  } else {
    return "";
  }
}
