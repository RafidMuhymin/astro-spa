export default function ({
  trackingID,
  anonymizeIP,
  colorDepth,
  characterSet,
  screenSize,
  language,
} = {}) {
  if (trackingID) {
    anonymizeIP = anonymizeIP || true;
    colorDepth = colorDepth || true;
    characterSet = characterSet || true;
    screenSize = screenSize || true;
    language = language || true;
    return `const cid = await crypto.subtle.digest(
      "SHA-256",
      new TextEncoder().encode(
        (await (await fetch("https://api64.ipify.org")).text()) +
          navigator.userAgent
      )
    );
    const serialize = (obj) => {
      var str = [];
      for (var p in obj) {
        if (obj.hasOwnProperty(p)) {
          if (obj[p] !== undefined) {
            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
          }
        }
      }
      return str.join("&");
    };
    const track = AstroSpa.track ||= async (
      type,
      eventCategory,
      eventAction,
      eventLabel,
      eventValue,
      exceptionDescription,
      exceptionFatal
    ) => {
      const url = "https://www.google-analytics.com/collect";
      const data = serialize({
        v: "1",
        ds: "web",
        ${anonymizeIP ? "aip: 1," : ""}
        tid: "${trackingID}",
        cid,
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
      });
      navigator.sendBeacon(url, data);
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
