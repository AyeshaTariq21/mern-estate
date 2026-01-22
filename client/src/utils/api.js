import axios from "axios";

const API = axios.create({
  baseURL: "https://mern-estate-sage-sigma.vercel.app", // your deployed backend
  withCredentials: true, // cookies
});

export default API;
