import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://prepforge-ai-orat.onrender.com",
  withCredentials: true
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export async function register({ username, email, password }) {
  try {
    const response = await api.post("/api/auth/register", {
      username,
      email,
      password
    });
    return response.data;
  } catch (err) {
    console.error("Register API error:", err);
    throw err;
  }
}

export async function login({ email, password }) {
  try {
    const response = await api.post("/api/auth/login", {
      email,
      password
    });
    return response.data;
  } catch (err) {
    console.error("Login API error:", err);
    throw err;
  }
}

export async function logout() {
  try {
    const response = await api.post("/api/auth/logout");
    return response.data;
  } catch (err) {
    console.error("Logout API error:", err);
    return null;
  }
}

export async function getMe() {
  try {
    const response = await api.get("/api/auth/get-me");
    return response.data;
  } catch (err) {
    // Expected error when user is unauthenticated or token is expired
    return null;
  }
}

export default { login, logout, register, getMe };