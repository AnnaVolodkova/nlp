import axios from 'axios';

export const getResult = () => {
  return axios.get(`http://localhost:3012/result`);
};

export const getTexts = () => {
  return axios.get(`http://localhost:3012/texts`);
};
