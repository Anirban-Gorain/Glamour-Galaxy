import axios from "axios";
import { getCookieValue } from "./cookies";

const API_BASE_URL = "https://glamour-galaxy.onrender.com";

// Here is a problem, as soon as the app is getting loaded this file is getting executed. If the user is doing a manual login using email and password after successful log in the JWT token is arriving from the server but the axios instance was create with undefined JWT token.

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use(
  (config) => {
    const JWTToken = getCookieValue("JWT");

    if (JWTToken) config.headers.Authorization = `Bearer ${JWTToken}`;
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API_BASE_URL;
