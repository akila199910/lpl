import axios from 'axios';

const api = axios.create({
  withCredentials: true,
  baseURL: 'http://192.168.8.101:4000/',
  headers: {
    'Content-Type': 'application/json',
  }, 
});

export default api;
