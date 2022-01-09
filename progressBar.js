export default function (progressBar, progressBarOptions = {}) {
  const { height = "1vh", secondary = false, colors = {} } = progressBarOptions;
  const { foreground = "#42b3f5", background = "#4248f5" } = colors;
  if (progressBar) {
    if (secondary) {
      return `const bgProgressBar = document.createElement("div");
        const progressBar = bgProgressBar.cloneNode();

        const style = 'position:fixed;top:0;left:0;width:100vw;height:${height};background:';
        bgProgressBar.style = style + '${background};z-index:-1';
        progressBar.style = style + '${foreground}';

        document.body.appendChild(bgProgressBar);
        document.body.appendChild(progressBar);

        const animateProgressBar = () => {
          progressBar.animate({ left: ["-100vw", "100vw"] }, 1250);
        }

        animateProgressBar();

        let intervalID = setInterval(() => {
          animateProgressBar();
        }, 1250);`;
    }
    return `const progressBar = document.createElement("div");
      progressBar.style =
        "position:fixed;top:0;left:0;width:25vw;transition:width 0.5s;height:${height};background:${foreground}";
      document.body.appendChild(progressBar);
  
      progressBar.animate({ width: ["0", "25vw"] }, 500);
  
      let pbw = 25;
      let intervalID = setInterval(() => {
      pbw += Math.random() * ((99.5 - pbw) / 10);
      progressBar.style.width = pbw + "vw";
      }, 500);`;
  }
  return "";
}
