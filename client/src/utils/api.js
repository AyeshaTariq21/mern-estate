import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL, // http://localhost:3000 or prod URL
  withCredentials: true, // include cookies
});

export default API;
