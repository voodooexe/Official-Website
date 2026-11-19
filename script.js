const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

// Split the heading into individually animated letters.
const heading = document.querySelector(".card h1");

if (heading && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  const text = heading.textContent;
  heading.textContent = "";

  [...text].forEach((character, index) => {
    const letter = document.createElement("span");
    letter.className = character === " " ? "letter space" : "letter";
    letter.style.setProperty("--i", index);
    letter.setAttribute("aria-hidden", "true");
    letter.textContent = character === " " ? "\u00A0" : character;
    heading.appendChild(letter);
  });
}

const button = document.querySelector("#test-button");
const message = document.querySelector("#message");

if (button && message) {
  button.addEventListener("click", () => {
    message.textContent = "Success! JavaScript is running on your hosted site.";
    button.innerHTML = 'Test passed <span aria-hidden="true">✓</span>';
  });
}
