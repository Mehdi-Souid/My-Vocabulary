import axios from 'axios';
const API_URL = 'http://localhost:3000/api';

const authService = {
  signUp: async (username, password) => {
    const response = await axios.post(`${API_URL}/users`, { username, password });
    return response.data;
  },

  signIn: async (username, password) => {
    const response = await axios.post(`${API_URL}/signin`, { username, password }); 
    return response.data;
  },
};

export default authService;
