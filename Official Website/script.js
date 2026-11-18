const button = document.querySelector('#test-button');
const message = document.querySelector('#message');
const year = document.querySelector('#year');

year.textContent = new Date().getFullYear();

button.addEventListener('click', () => {
  message.textContent = 'Success! JavaScript is running on your hosted site.';
  button.innerHTML = 'Test passed <span aria-hidden="true">✓</span>';
});
