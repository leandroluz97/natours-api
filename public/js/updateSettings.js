/*eslint-disable */
import axios from 'axios';

export async function updateSettings(settings) {
  if (!settings) throw new Error('You should provied new settings');

  const response = await axios.patch('http://localhost:3000/me', settings);
  return response;
}
