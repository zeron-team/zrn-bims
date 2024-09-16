// frontend/src/services/authService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/auth/';

export const login = (username, password) => {
    return axios.post(API_URL + 'login', { username, password })
        .then(response => {
            return {
                access_token: response.data.access_token,
                role: response.data.role
            };
        });
};
