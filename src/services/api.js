import axios from "axios";

export const API_BASE_URL = (() => {
  if (typeof window !== "undefined") {
    // If running in browser and NOT on standalone Vite dev port 5173, use the origin /api
    if (window.location.port !== "5173") {
      return `${window.location.origin}/api`;
    }
    return import.meta.env.VITE_API_URL || "/api";
  }
  return import.meta.env.VITE_API_URL || "http://localhost:5000/api";
})();

const api = axios.create({
  baseURL: API_BASE_URL,
});

export default api;