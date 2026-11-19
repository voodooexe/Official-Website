const year = document.querySelector("#year");

if (year) {
  year.textContent = new Date().getFullYear();
}

const button = document.querySelector("#test-button");
const message = document.querySelector("#message");

if (button && message) {
  button.addEventListener("click", () => {
    message.textContent = "Success! JavaScript is running on your hosted site.";
    button.innerHTML = 'Test passed <span aria-hidden="true">✓</span>';
  });
}
