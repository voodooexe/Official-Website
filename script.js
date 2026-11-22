(() => {
  "use strict";

  const year = document.querySelector("#year");
  if (year) year.textContent = new Date().getFullYear();

  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const panels = [...document.querySelectorAll(".playful-panel")];
  const links = [...document.querySelectorAll(".social-links a")];
  const cards = [...document.querySelectorAll(".portfolio-card")];
  const thumbnails = [...document.querySelectorAll(".artwork-thumb")];
  const heading = document.querySelector("#page-title");

  // Controlled randomness: each visit gets a slightly different motion rhythm.
  // A small seeded generator keeps the stagger values stable during this page load.
  const seed = Math.floor(Math.random() * 1_000_000);
  let randomState = seed || 1;
  const random = () => {
    randomState = (randomState * 16807) % 2147483647;
    return (randomState - 1) / 2147483646;
  };
  const randomBetween = (min, max) => min + random() * (max - min);

  if (reduceMotion || !("IntersectionObserver" in window)) {
    [...panels, ...links, ...cards, ...thumbnails].forEach((el) => el.classList.add("is-visible"));
  } else {
    document.body.classList.add("motion-ready");

    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    }, { threshold: 0.12, rootMargin: "0px 0px -35px 0px" });

    panels.forEach((el, index) => {
      el.style.setProperty("--reveal-delay", `${index * 90 + randomBetween(0, 130)}ms`);
      el.style.setProperty("--reveal-y", `${randomBetween(34, 58).toFixed(1)}px`);
      revealObserver.observe(el);
    });

    links.forEach((el, index) => {
      el.style.setProperty("--item-delay", `${index * 65 + randomBetween(0, 110)}ms`);
      el.style.setProperty("--item-shift", `${randomBetween(-22, 22).toFixed(1)}px`);
      revealObserver.observe(el);
    });

    cards.forEach((el, index) => {
      el.style.setProperty("--item-delay", `${index * 145 + randomBetween(0, 160)}ms`);
      el.style.setProperty("--item-scale", randomBetween(0.94, 0.98).toFixed(3));
      el.style.setProperty("--item-angle", `${randomBetween(-1.2, 1.2).toFixed(2)}deg`);
      revealObserver.observe(el);
    });

    thumbnails.forEach((el, index) => {
      el.style.setProperty("--thumb-delay", `${(index % 6) * 75 + randomBetween(0, 100)}ms`);
      el.style.setProperty("--thumb-origin", `${randomBetween(42, 58).toFixed(1)}% ${randomBetween(42, 58).toFixed(1)}%`);
      revealObserver.observe(el);
    });
  }

  if (heading && !reduceMotion) {
    const label = heading.textContent.trim();
    heading.replaceChildren();
    [...label].forEach((character, index) => {
      const letter = document.createElement("span");
      letter.className = character === " " ? "letter space" : "letter";
      letter.textContent = character === " " ? "\u00a0" : character;
      letter.setAttribute("aria-hidden", "true");
      letter.style.setProperty("--letter-delay", `${70 + index * 48 + randomBetween(0, 75)}ms`);
      letter.style.setProperty("--letter-drift", `${randomBetween(-5, 5).toFixed(2)}deg`);
      heading.append(letter);
    });
  }

  const lightbox = document.querySelector(".artwork-lightbox");
  const lightboxImage = document.querySelector(".lightbox-image");
  const closeButton = document.querySelector(".lightbox-close");
  const previousButton = document.querySelector(".lightbox-prev");
  const nextButton = document.querySelector(".lightbox-next");
  const lightboxCaption = document.querySelector(".lightbox-caption");
  const artworkItems = [...document.querySelectorAll(".artwork-thumb")];
  let activeArtworkIndex = -1;
  let touchStartX = null;

  if (lightbox && lightboxImage && closeButton && artworkItems.length) {
    const showArtwork = (index) => {
      activeArtworkIndex = (index + artworkItems.length) % artworkItems.length;
      const thumbnail = artworkItems[activeArtworkIndex];
      const image = thumbnail.querySelector("img");
      if (!image) return;

      lightboxImage.src = thumbnail.dataset.full || image.src;
      lightboxImage.alt = image.alt || thumbnail.getAttribute("aria-label") || "Portfolio artwork";
      if (lightboxCaption) {
        lightboxCaption.textContent = `${activeArtworkIndex + 1} / ${artworkItems.length}`;
      }

      if (!reduceMotion) {
        lightboxImage.classList.remove("is-changing");
        void lightboxImage.offsetWidth;
        lightboxImage.classList.add("is-changing");
      }
    };

    artworkItems.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        showArtwork(index);
        if (typeof lightbox.showModal === "function") lightbox.showModal();
        else lightbox.setAttribute("open", "");

        if (!reduceMotion) {
          lightbox.classList.remove("is-opening");
          void lightbox.offsetWidth;
          lightbox.classList.add("is-opening");
        }
      });
    });

    const moveArtwork = (direction) => showArtwork(activeArtworkIndex + direction);
    const closeLightbox = () => {
      if (typeof lightbox.close === "function") lightbox.close();
      else lightbox.removeAttribute("open");
    };

    previousButton?.addEventListener("click", () => moveArtwork(-1));
    nextButton?.addEventListener("click", () => moveArtwork(1));
    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("click", (event) => {
      if (event.target === lightbox) closeLightbox();
    });

    // Arrow keys move between pieces; Escape keeps the native close behavior.
    lightbox.addEventListener("keydown", (event) => {
      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveArtwork(-1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveArtwork(1);
      }
    });

    // Touch users can swipe left/right to browse without closing the preview.
    lightbox.addEventListener("touchstart", (event) => {
      touchStartX = event.changedTouches[0]?.clientX ?? null;
    }, { passive: true });

    lightbox.addEventListener("touchend", (event) => {
      if (touchStartX === null) return;
      const deltaX = (event.changedTouches[0]?.clientX ?? touchStartX) - touchStartX;
      if (Math.abs(deltaX) > 45) moveArtwork(deltaX < 0 ? 1 : -1);
      touchStartX = null;
    }, { passive: true });
  }

  if (!reduceMotion) {
    cards.forEach((card) => {
      card.style.setProperty("--ambient-duration", `${randomBetween(7.5, 11.5).toFixed(2)}s`);
      card.style.setProperty("--ambient-delay", `${randomBetween(-8, 0).toFixed(2)}s`);
      card.style.setProperty("--ambient-distance", `${randomBetween(2, 4).toFixed(1)}px`);
    });
  }

  // A slim scroll indicator gives the page a quiet sense of progression.
  if (!reduceMotion) {
    let ticking = false;
    const updateScrollProgress = () => {
      const scrollable = document.documentElement.scrollHeight - window.innerHeight;
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0;
      document.documentElement.style.setProperty("--scroll-progress", `${progress * 100}%`);
      ticking = false;
    };

    window.addEventListener("scroll", () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(updateScrollProgress);
    }, { passive: true });
    updateScrollProgress();
  }
})();
