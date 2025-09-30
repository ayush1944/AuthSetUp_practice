import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_URL
    ? `${import.meta.env.VITE_BACKEND_URL}/api/auth`
    : "http://localhost:3000/api/auth",
  withCredentials: true,
});

export default api;