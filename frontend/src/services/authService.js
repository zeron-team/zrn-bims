// frontend/src/services/authService.js

import axios from 'axios';

// Make sure the API URL points to your FastAPI authentication endpoints
const API_URL = 'http://localhost:8000/auth/';

export const register = (username, password, role) => {
    // Make a POST request to the register endpoint with the username, password, and role
    return axios.post(API_URL + 'register', { username, password, role });
};

export const login = (username, password) => {
    // Make a POST request to the login endpoint with the username and password
    return axios.post(API_URL + 'login', { username, password });
};
