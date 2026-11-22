const year = document.querySelector("#year");
if (year) year.textContent = new Date().getFullYear();

const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const random = (min, max) => Math.random() * (max - min) + min;
const pick = (items) => items[Math.floor(Math.random() * items.length)];

const quips = [
  "A personal corner of the internet. Come say hello.",
  "Somewhere between a portfolio and a strange little planet.",
  "A little corner of the web with its own weird rhythm.",
  "Good to see you. Have a look around."
];
const tinyNotes = [
  "psst... you can click things.",
  "no pressure. just have a look.",
  "hello, internet person.",
  "you made it. nice."
];
const shuffleLines = [
  "The internet is weird. Be a little weird.",
  "Thanks for stopping by.",
  "Stay curious. Hydrate occasionally.",
  "A small website with big main-character energy."
];

const intro = document.querySelector("#intro-line");
const tinyNote = document.querySelector("#tiny-note");
const shuffleLine = document.querySelector("#shuffle-line");
if (intro) intro.textContent = pick(quips);
if (tinyNote) tinyNote.textContent = pick(tinyNotes);
if (shuffleLine) shuffleLine.textContent = pick(shuffleLines);

const heading = document.querySelector("h1");
const links = [...document.querySelectorAll(".social-links a")];
const panels = [...document.querySelectorAll(".playful-panel")];

if (!reduceMotion) {
  panels.forEach((panel) => {
    panel.style.setProperty("--panel-tilt", `${random(-.55, .55).toFixed(2)}deg`);
    panel.style.setProperty("--panel-delay", `${random(0, 100).toFixed(0)}ms`);
  });

  if (heading) {
    const title = heading.textContent;
    heading.textContent = "";
    [...title].forEach((character, index) => {
      const letter = document.createElement("span");
      letter.className = character === " " ? "letter space" : "letter";
      letter.style.setProperty("--letter-delay", `${180 + index * random(22, 34)}ms`);
      letter.style.setProperty("--letter-tilt", `${random(-5, 5).toFixed(1)}deg`);
      letter.textContent = character === " " ? "\u00A0" : character;
      letter.setAttribute("aria-hidden", "true");
      heading.appendChild(letter);
    });
  }

  links.forEach((link) => {
    link.style.setProperty("--rest-tilt", `${random(-.35, .35).toFixed(2)}deg`);
    link.style.setProperty("--hover-tilt", `${random(-1.2, 1.2).toFixed(2)}deg`);
    link.style.setProperty("--icon-tilt", `${random(-12, 12).toFixed(1)}deg`);
    link.style.setProperty("--arrival", `${random(20, 130).toFixed(0)}ms`);
  });

  document.body.classList.add("motion-ready");
  const revealItems = document.querySelectorAll(".playful-panel, .social-links a");
  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.12 });
    revealItems.forEach((item) => observer.observe(item));
  } else {
    revealItems.forEach((item) => item.classList.add("is-visible"));
  }
}

if (shuffleLine) {
  shuffleLine.addEventListener("click", () => {
    shuffleLine.textContent = pick(shuffleLines.filter((line) => line !== shuffleLine.textContent));
    shuffleLine.classList.remove("boing");
    void shuffleLine.offsetWidth;
    shuffleLine.classList.add("boing");
  });
}
