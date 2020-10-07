import axios from 'axios';

export const getResult = () => {
  return axios.get(`http://localhost:3000/result`);
};

export const getTexts = () => {
  return axios.get(`http://localhost:3000/texts`);
};
