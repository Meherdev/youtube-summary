import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE, // Make sure this is defined in Vercel
});

export default api;
