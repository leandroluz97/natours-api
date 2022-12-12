/*eslint-disable */
import '@babel/polyfill';

import { login } from './login';
import { logout } from './logout';
import { displayMap } from './mapbox';
import { showAlert } from './alerts';
import { updateSettings } from './updateSettings';
import { bookTour } from './stripe';

const mapBox = document.getElementById('map');
const loginForm = document.querySelector('#loginForm');
const settingsForm = document.querySelector('.form-user-data');
const PasswordForm = document.querySelector('.form-user-settings');
const logoutButton = document.querySelector('.nav__el--logout');
const booktBtn = document.querySelector('#book-tour');

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
  settingsForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    const form = new FormData();
    form.append('name', document.querySelector('#name').value);
    form.append('email', document.querySelector('#email').value);
    form.append('photo', document.querySelector('#photo').files[0]);

    try {
      await updateSettings(form, 'data');
      showAlert('success', 'User settings updated successfully');
    } catch (error) {
      showAlert('error', error.response.data.message);
    }
  });
}

if (PasswordForm) {
  PasswordForm.addEventListener('submit', async (event) => {
    event.preventDefault();
    document.querySelector('.btn--save--password').textContent = 'Updating...';
    const password = document.querySelector('#password-current').value;
    const newPassword = document.querySelector('#password').value;
    const confirmPassword = document.querySelector('#password-confirm').value;
    try {
      await updateSettings(
        { password, newPassword, confirmPassword },
        'password'
      );
      showAlert('success', 'User settings updated successfully');
      document.querySelector('.btn--save--password').textContent =
        'Save Password';
      document.querySelector('#password-current').value = '';
      document.querySelector('#password').value = '';
      document.querySelector('#password-confirm').value = '';
    } catch (error) {
      showAlert('error', error.response.data.message);
    }
  });
}

if (logoutButton) {
  logoutButton.addEventListener('click', async (event) => {
    try {
      await logout();
      setTimeout(() => {
        location.assign('/');
      }, 1500);
    } catch (error) {
      console.log(err);
    }
  });
}

if (booktBtn) {
  booktBtn.addEventListener('click', async (event) => {
    try {
      event.target.textContent = 'Processing...';
      const tourId = booktBtn.getAttribute('data-tour-id');
      const session = await bookTour(tourId);
      event.target.textContent = 'Book Tour Now!';
      window.location = session.data.session.url;
    } catch (error) {
      showAlert('error', error.response.data.message);
    }
  });
}
