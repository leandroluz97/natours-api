/*eslint-disable */
import axios from 'axios';

export async function logout() {
  return await axios.get('http://localhost:3000/api/v1/users/logout');
}
