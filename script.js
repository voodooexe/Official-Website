(() => {
  "use strict";

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const panels = document.querySelectorAll(".playful-panel");
  const links = document.querySelectorAll(".social-links a");
  const heading = document.querySelector("#page-title");

  if (reduceMotion || !("IntersectionObserver" in window)) {
    panels.forEach((panel) => panel.classList.add("is-visible"));
    links.forEach((link) => link.classList.add("is-visible"));
  } else {
    document.body.classList.add("motion-ready");
    const observer = new IntersectionObserver((entries, activeObserver) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        activeObserver.unobserve(entry.target);
      });
    }, { threshold: 0.08 });

    [...panels, ...links].forEach((element) => observer.observe(element));
  }

  if (heading && !reduceMotion) {
    const label = heading.textContent.trim();
    heading.replaceChildren();
    [...label].forEach((character, index) => {
      const letter = document.createElement("span");
      letter.className = character === " " ? "letter space" : "letter";
      letter.textContent = character === " " ? "\u00a0" : character;
      letter.setAttribute("aria-hidden", "true");
      letter.style.setProperty("--letter-delay", `${120 + index * 35}ms`);
      heading.append(letter);
    });
  }

  const lightbox = document.querySelector(".artwork-lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const closeButton = document.querySelector(".lightbox-close");
  if (!lightbox || !lightboxImage || !closeButton) return;

  document.querySelectorAll(".artwork-thumb").forEach((thumbnail) => {
    thumbnail.addEventListener("click", () => {
      const image = thumbnail.querySelector("img");
      if (!image) return;
      lightboxImage.src = thumbnail.dataset.full || image.src;
      lightboxImage.alt = image.alt;
      if (typeof lightbox.showModal === "function") lightbox.showModal();
      else lightbox.setAttribute("open", "");
    });
  });

  const closeLightbox = () => {
    if (typeof lightbox.close === "function") lightbox.close();
    else lightbox.removeAttribute("open");
  };

  closeButton.addEventListener("click", closeLightbox);
  lightbox.addEventListener("click", (event) => {
    if (event.target === lightbox) closeLightbox();
  });
})();
