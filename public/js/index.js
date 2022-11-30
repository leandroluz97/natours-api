/*eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { showAlert } from './alerts';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('.form');
const logoutButton = document.querySelector('.nav__el--logout');
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

if (logoutButton) {
  logoutButton.addEventListener('click', (event) => {
    logout()
      .then(() => {
        setTimeout(() => {
          location.reload(true);
        }, 1500);
      })
      .catch((err) => console.log(err));
  });
}
