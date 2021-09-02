export default function () {
  return `const constructPage = async () => {
    w.onNavigate && onNavigate();

    let pbw = 25;
    let intervalID;
    const progressBar = d.createElement("div");
    (() => {
        progressBar.style =
        "position: fixed; top: 0px; left: 0px; width: 25vw; transition: width 0.5s ease 0s; height: 1.25vh; background-color: #62d3f5;";
        d.body.appendChild(progressBar);

        progressBar.animate({ width: ["0", "25vw"] }, 500);

        intervalID = setInterval(() => {
        pbw += Math.random() * ((99.5 - pbw) / 10);
        progressBar.style.width = pbw + "vw";
        }, 500);
    })();

    const cachedPage = (await cache.match(l.href)) || (await fetch(l.href));
    const html = await cachedPage.text();
    const doc = new DOMParser().parseFromString(html, "text/html");

    clearInterval(intervalID);
    progressBar.animate({ width: [pbw + "vw", "100vw"] }, 100).onfinish =
        () => {
        d.documentElement.replaceWith(doc.documentElement);
        for (const script of d.scripts) {
            const newScript = d.createElement("script");
            newScript.textContent = script.textContent;
            for (const attr of script.attributes) {
            newScript.setAttribute(attr.name, attr.value);
            }
            script.replaceWith(newScript);
        }
        w.onMount && onMount();
        d.documentElement.animate(
            {
            opacity: [0, 1],
            },
            1000
        );
        };
    };`;
}
