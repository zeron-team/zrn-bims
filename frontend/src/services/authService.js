import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

export const register = (username, password, role) => {
    return axios.post(API_URL + 'register', { username, password, role });
};

export const login = (username, password) => {
    return axios.post(API_URL + 'login', { username, password });
};
