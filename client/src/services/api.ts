import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5001/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Auth API
export const authAPI = {
  register: (userData: any) => api.post('/users/register', userData),
  login: (credentials: any) => api.post('/users/login', credentials),
  getProfile: () => api.get('/users/profile'),
  updateProfile: (userData: any) => api.put('/users/profile', userData),
};

// Startup API
export const startupAPI = {
  createProfile: (startupData: any) => api.post('/startups', startupData),
  getProfile: () => api.get('/startups/me'),
  updateProfile: (startupData: any) => api.put('/startups/me', startupData),
  getById: (id: string) => api.get(`/startups/${id}`),
  getAll: (params?: any) => api.get('/startups', { params }),
};

// Investor API
export const investorAPI = {
  createProfile: (investorData: any) => api.post('/investors', investorData),
  getProfile: () => api.get('/investors/me'),
  updateProfile: (investorData: any) => api.put('/investors/me', investorData),
  getById: (id: string) => api.get(`/investors/${id}`),
  getAll: (params?: any) => api.get('/investors', { params }),
};

// Connection API removed

export default api; 