// src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:3000/api/v1/auth'; // adjust your backend URL

export const login = async ({ name, password }) => {
  return await axios.post(`${API_URL}/login`, { name, password });
};

export const register = async ({ name, password }) => {
  return await axios.post(`${API_URL}/register`, { name, password });
};

export const saveToken = (token) => {
  localStorage.setItem('token', token);
};
// Get token
export const getToken = () => {
  return localStorage.getItem('token');
};


export const logoutClient = () => {
  localStorage.removeItem('token');
};

export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};

// Authenticated request helper
export const authRequest = ({ url, method, data }) => {
  const token = localStorage.getItem('token');
  return axios({
    method,
    url: `http://localhost:3000/api/v1${url}`,
    data,
    headers: { Authorization: `Bearer ${token}` },
  });
};
