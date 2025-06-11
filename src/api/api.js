import axios from 'axios';

const API = axios.create({
  baseURL: 'https://chat-backend-7lwx.onrender.com/api',
});

export const register = (data) => API.post('/users/register', data);
export const login = (data) => API.post('/users/login', data);
