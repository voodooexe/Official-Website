(() => {
  "use strict";

  const year = document.querySelector("#year");
  if (year) year.textContent = String(new Date().getFullYear());

  const reduceMotionQuery = window.matchMedia
    ? window.matchMedia("(prefers-reduced-motion: reduce)")
    : null;
  const reduceMotion = Boolean(reduceMotionQuery && reduceMotionQuery.matches);

  const pick = (items) => items[Math.floor(Math.random() * items.length)];

  const quips = [
    "A personal corner of the internet. Come say hello.",
    "Somewhere between a portfolio and a strange little planet.",
    "A little corner of the web with its own weird rhythm.",
    "Good to see you. Have a look around."
  ];

  const shuffleLines = [
    "The internet is weird. Be a little weird.",
    "Thanks for stopping by.",
    "Stay curious. Hydrate occasionally.",
    "A small website with big main-character energy."
  ];

  const intro = document.querySelector("#intro-line");
  const shuffleLine = document.querySelector("#shuffle-line");
  if (intro) intro.textContent = pick(quips);
  if (shuffleLine) shuffleLine.textContent = pick(shuffleLines);

  const heading = document.querySelector("#page-title");
  const links = Array.from(document.querySelectorAll(".social-links a"));
  const panels = Array.from(document.querySelectorAll(".playful-panel"));

  // Reveal content even if motion is disabled or IntersectionObserver is unavailable.
  if (reduceMotion) {
    panels.forEach((panel) => panel.classList.add("is-visible"));
    links.forEach((link) => link.classList.add("is-visible"));
  } else {
    panels.forEach((panel) => {
      panel.style.setProperty("--panel-tilt", `${(Math.random() * 1.1 - 0.55).toFixed(2)}deg`);
      panel.style.setProperty("--panel-delay", `${Math.floor(Math.random() * 100)}ms`);
    });

    if (heading) {
      const title = heading.textContent.trim();
      heading.textContent = "";
      Array.from(title).forEach((character, index) => {
        const letter = document.createElement("span");
        letter.className = character === " " ? "letter space" : "letter";
        letter.style.setProperty("--letter-delay", `${180 + index * (22 + Math.random() * 12)}ms`);
        letter.style.setProperty("--letter-tilt", `${(Math.random() * 10 - 5).toFixed(1)}deg`);
        letter.textContent = character === " " ? "\u00A0" : character;
        letter.setAttribute("aria-hidden", "true");
        heading.appendChild(letter);
      });
    }

    links.forEach((link) => {
      link.style.setProperty("--rest-tilt", `${(Math.random() * 0.7 - 0.35).toFixed(2)}deg`);
      link.style.setProperty("--hover-tilt", `${(Math.random() * 2.4 - 1.2).toFixed(2)}deg`);
      link.style.setProperty("--icon-tilt", `${(Math.random() * 24 - 12).toFixed(1)}deg`);
      link.style.setProperty("--arrival", `${Math.floor(20 + Math.random() * 110)}ms`);
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
      }, { threshold: 0.08 });
      revealItems.forEach((item) => observer.observe(item));
    } else {
      revealItems.forEach((item) => item.classList.add("is-visible"));
    }
  }

  if (shuffleLine) {
    shuffleLine.setAttribute("role", "button");
    shuffleLine.setAttribute("tabindex", "0");
    shuffleLine.setAttribute("aria-label", "Show another little message");

    const shuffle = () => {
      shuffleLine.textContent = pick(shuffleLines.filter((line) => line !== shuffleLine.textContent));
      if (reduceMotion) return;
      shuffleLine.classList.remove("boing");
      void shuffleLine.offsetWidth;
      shuffleLine.classList.add("boing");
    };

    shuffleLine.addEventListener("click", shuffle);
    shuffleLine.addEventListener("keydown", (event) => {
      if (event.key === "Enter" || event.key === " ") {
        event.preventDefault();
        shuffle();
      }
    });
  }
})();
