/*eslint-disable */
import axios from 'axios';

export async function updateSettings(data, type) {
  if (!data) throw new Error('You should provied new settings');
  const url =
    type === 'password'
      ? 'http://localhost:3000/api/v1/users/new-password'
      : 'http://localhost:3000/api/v1/users/my-account';

  const response = await axios.patch(url, data);
  return response;
}
