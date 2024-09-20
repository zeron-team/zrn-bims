// frontend/src/services/queryService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/queries';  // Asegúrate de que esta URL sea correcta

export const getQueries = () => axios.get(API_URL);
export const runQuery = (data) => axios.post(`${API_URL}/run`, data);