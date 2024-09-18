// frontend/src/services/queryService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api';  // Asegúrate de que esta URL sea la correcta para tu backend

// Ejecutar la consulta SQL
export const executeQuery = (connectionId, query) => {
    return axios.post(`${API_URL}/execute-query`, { connectionId, query });
};

// Guardar una consulta
export const saveQuery = (queryDetails) => {
    return axios.post(`${API_URL}/save-query`, queryDetails);
};