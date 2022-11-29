/*eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { displayMap } from './mapbox';
import { showAlert } from './alerts';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
if (mapBox) {
  const locations = JSON.parse(mapBox.dataset.locations);
  displayMap(locations);
}

if (loginForm) {
  loginForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const email = document.querySelector('#email').value;
    const password = document.querySelector('#password').value;

    login({ email, password })
      .then(() => {
        showAlert('success', 'Yor are LoggedIn');
        setTimeout(() => {
          location.assign('/');
        }, 1500);
      })
      .catch((error) => showAlert('error', error.response.data.message));
  });
}
