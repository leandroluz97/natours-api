/*eslint-disable */
const form = document.querySelector('.form');

form.addEventListener('submit', (event) => {
  event.preventDefault();
  const email = document.querySelector('#email').value;
  const password = document.querySelector('#password').value;

  login({ email, password })
    .then(() =>
      setTimeout(() => {
        location.assign('/');
      }, 1500)
    )
    .catch((error) => alert(error.response.data.message));
});

async function login({ email, password }) {
  if (!email || !password)
    throw new Error('You should provied a email or password.');
  if (email.trim() === '' || password.trim() === '')
    throw new Error('Your email or password should not be empty.');

  const response = await axios.post(
    'http://localhost:3000/api/v1/users/login',
    {
      email,
      password,
    }
  );
  return response;
}
