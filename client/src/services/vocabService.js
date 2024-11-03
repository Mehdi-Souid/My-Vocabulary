import axios from 'axios';

const API_URL = 'http://localhost:3000/api';

export const addWord = async (wordData) => {
  const response = await axios.post(`${API_URL}/vocab`, wordData);
  return response.data;
};

export const getWords = async (userId) => {
  const response = await axios.get(`${API_URL}/vocab/${userId}`);
  return response.data;
};

export const updateWord = async (id, wordData) => {
  const response = await axios.put(`${API_URL}/vocab/${id}`, wordData);
  return response.data;
};

export const deleteWord = async (id) => {
  const response = await axios.delete(`${API_URL}/vocab/${id}`);
  return response.data;
};
