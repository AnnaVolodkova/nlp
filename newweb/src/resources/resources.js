import axios from 'axios';

const PORT = 3012;

export const getResult = () => {
  return axios.get(`http://localhost:${PORT}/result`);
};

export const getTexts = () => {
  return axios.get(`http://localhost:${PORT}/texts`);
};

export const getTaggedTexts = () => {
  return axios.get(`http://localhost:${PORT}/taggedTexts`);
};
