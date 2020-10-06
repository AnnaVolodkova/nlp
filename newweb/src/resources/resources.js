import axios from 'axios';

export const getResult = () => {
  return axios.get(`http://localhost:3000/result`);
};
