/*eslint-disable */
import '@babel/polyfill';
import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { showAlert } from './alerts';
import { updateSettings } from './updateSettings';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('#loginForm');
const settingsForm = document.querySelector('.form-user-data');
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
      .catch((error) => {
        showAlert('error', error.message);
      });
  });
}

if (settingsForm) {
  settingsForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.querySelector('#name').value;
    const email = document.querySelector('#email').value;

    updateSettings({ email, name })
      .then(() => {
        showAlert('success', 'User settings updated successfully');
      })
      .catch((error) => {
        console.log(error);
        showAlert('error', error.message);
      });
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
