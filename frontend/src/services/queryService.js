// frontend/src/services/queryService.js

import axios from 'axios';

const API_URL = 'http://localhost:8000/api/queries'; // Ruta correcta para tu API

export const getQueries = () => axios.get(API_URL);

export const runQuery = (queryDetails) => axios.post(`${API_URL}/run`, queryDetails);

export const deleteQuery = (queryId) => axios.delete(`${API_URL}/${queryId}`); // URL correcta
