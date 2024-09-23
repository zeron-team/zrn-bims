// frontend/src/services/chartService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/charts';  // Ruta correcta para tu API

export const getCharts = () => axios.get(API_URL);

export const createChart = (chartDetails) => axios.post(API_URL, chartDetails);

export const deleteChart = (chartId) => axios.delete(`${API_URL}/${chartId}`);

// Nueva función para actualizar un gráfico por ID
export const updateChart = (chartId, chartDetails) => axios.put(`${API_URL}/${chartId}`, chartDetails);

// Agregar la función getChartData si es necesaria
export const getChartData = (page, token) => {
    return axios.get(`${API_URL}/data`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
