import axios from 'axios';

// Base URL of your backend API
const BASE_URL = 'http://localhost:5000/api/auth';

const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true, // Include cookies if your backend uses sessions
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to attach token from localStorage to each request
axiosInstance.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('authToken'); // Or wherever you save your token
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
