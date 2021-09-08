export default function (
  PPBColor,
  progressBar,
  secondaryProgressBar,
  SPBColor
) {
  return progressBar
    ? `let pbw = 25;
    let intervalID;
    const progressBar = d.createElement("div");

    progressBar.style =
    "position: fixed; top: 0px; left: 0px; width: 25vw; transition: width 0.5s ease; height: 1.25vh; background-color: ${PPBColor};";
    d.body.appendChild(progressBar);

    progressBar.animate({ width: ["0", "25vw"] }, 500);

    intervalID = setInterval(() => {
    pbw += Math.random() * ((99.5 - pbw) / 10);
    progressBar.style.width = pbw + "vw";
    }, 500);`
    : secondaryProgressBar
    ? `const bgProgressBar = d.createElement("div");
    const progressBar = d.createElement("div");
    
    bgProgressBar.style =
      "position: fixed; top: 0px; left: 0px; width: 100vw; height: 1vh; background-color: ${SPBColor}; z-index: -1;";
    progressBar.style =
      "position: fixed; top: 0px; left: 0px; width: 100vw; height: 1vh; background-color: ${PPBColor};";

    d.body.appendChild(bgProgressBar);
    d.body.appendChild(progressBar);
    
    const animateProgressBar = () => {
      progressBar.animate({ left: ["-100vw", "100vw"] }, 1250);
    }

    animateProgressBar();

    intervalID = setInterval(() => {
      animateProgressBar();
    }, 1250);`
    : "";
}
