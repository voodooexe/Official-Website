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
      el.style.setProperty("--reveal-delay", `${index * 65 + randomBetween(0, 80)}ms`);
      el.style.setProperty("--reveal-y", `${randomBetween(34, 58).toFixed(1)}px`);
      el.style.setProperty("--panel-tilt", `${randomBetween(-1.1, 1.1).toFixed(2)}deg`);
      revealObserver.observe(el);
    });

    links.forEach((el, index) => {
      el.style.setProperty("--item-delay", `${index * 45 + randomBetween(0, 70)}ms`);
      el.style.setProperty("--item-shift", `${randomBetween(-22, 22).toFixed(1)}px`);
      el.style.setProperty("--link-shift", `${randomBetween(-18, 18).toFixed(1)}px`);
      el.style.setProperty("--link-tilt", `${randomBetween(-1, 1).toFixed(2)}deg`);
      revealObserver.observe(el);
    });

    cards.forEach((el, index) => {
      el.style.setProperty("--item-delay", `${index * 95 + randomBetween(0, 100)}ms`);
      el.style.setProperty("--item-scale", randomBetween(0.94, 0.98).toFixed(3));
      el.style.setProperty("--item-angle", `${randomBetween(-1.2, 1.2).toFixed(2)}deg`);
      el.style.setProperty("--card-tilt", `${randomBetween(-1.4, 1.4).toFixed(2)}deg`);
      revealObserver.observe(el);
    });

    thumbnails.forEach((el, index) => {
      el.style.setProperty("--thumb-delay", `${(index % 6) * 50 + randomBetween(0, 70)}ms`);
      el.style.setProperty("--thumb-origin", `${randomBetween(42, 58).toFixed(1)}% ${randomBetween(42, 58).toFixed(1)}%`);
      el.style.setProperty("--thumb-tilt", `${randomBetween(-1.8, 1.8).toFixed(2)}deg`);
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
  let artworkChangeTimer = null;
  let artworkChangeToken = 0;

  if (lightbox && lightboxImage && closeButton && artworkItems.length) {
    const showArtwork = (index, direction = 0, animate = false) => {
      const nextIndex = (index + artworkItems.length) % artworkItems.length;
      const thumbnail = artworkItems[nextIndex];
      const image = thumbnail.querySelector("img");
      if (!image) return;

      const nextSrc = thumbnail.dataset.full || image.src;
      const nextAlt = image.alt || thumbnail.getAttribute("aria-label") || "Portfolio artwork";
      const token = ++artworkChangeToken;

      window.clearTimeout(artworkChangeTimer);
      lightboxImage.classList.remove("is-exiting", "is-entering", "slide-next", "slide-previous");

      const commitArtwork = () => {
        if (token !== artworkChangeToken) return;
        activeArtworkIndex = nextIndex;
        lightboxImage.src = nextSrc;
        lightboxImage.alt = nextAlt;
        if (lightboxCaption) {
          lightboxCaption.textContent = `${activeArtworkIndex + 1} / ${artworkItems.length}`;
        }

        if (animate && !reduceMotion) {
          lightboxImage.classList.add("is-entering", direction < 0 ? "slide-previous" : "slide-next");
          requestAnimationFrame(() => requestAnimationFrame(() => lightboxImage.classList.remove("is-entering")));
        }
      };

      // Preload first so a slow image never leaves the preview blank mid-transition.
      if (!animate || reduceMotion || activeArtworkIndex < 0) {
        commitArtwork();
        return;
      }

      const preloader = new Image();
      preloader.onload = () => {
        if (token !== artworkChangeToken) return;
        lightboxImage.classList.add("is-exiting", direction < 0 ? "slide-previous" : "slide-next");
        artworkChangeTimer = window.setTimeout(() => {
          commitArtwork();
          lightboxImage.classList.remove("is-exiting", "slide-next", "slide-previous");
        }, 100);
      };
      preloader.onerror = () => {
        if (token !== artworkChangeToken) return;
        commitArtwork();
      };
      preloader.src = nextSrc;
    };

    artworkItems.forEach((thumbnail, index) => {
      thumbnail.addEventListener("click", () => {
        window.clearTimeout(closeAnimationTimer);
        lightbox.classList.remove("is-closing");
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

    const moveArtwork = (direction) => showArtwork(activeArtworkIndex + direction, direction, true);
    let closeAnimationTimer = null;
    const closeLightbox = () => {
      if (!lightbox.open && !lightbox.hasAttribute("open")) return;
      window.clearTimeout(closeAnimationTimer);

      if (reduceMotion) {
        if (typeof lightbox.close === "function") lightbox.close();
        else lightbox.removeAttribute("open");
        return;
      }

      lightbox.classList.remove("is-closing");
      // Force the class removal to take effect before starting the exit animation.
      void lightbox.offsetWidth;
      lightbox.classList.add("is-closing");
      closeAnimationTimer = window.setTimeout(() => {
        lightbox.classList.remove("is-closing");
        if (typeof lightbox.close === "function") lightbox.close();
        else lightbox.removeAttribute("open");
      }, 190);
    };

    previousButton?.addEventListener("click", () => moveArtwork(-1));
    nextButton?.addEventListener("click", () => moveArtwork(1));
    closeButton.addEventListener("click", closeLightbox);

    lightbox.addEventListener("cancel", (event) => {
      event.preventDefault();
      closeLightbox();
    });

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

})();
