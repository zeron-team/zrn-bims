// frontend/src/services/pageService.js:

import axios from 'axios';

const API_URL = "http://localhost:8000/api/pages";

export const getPages = () => axios.get(`${API_URL}/`);
export const createPage = (data) => axios.post(`${API_URL}/`, data);
export const updatePage = (id, data) => axios.put(`${API_URL}/${id}`, data);
export const deletePage = (id) => axios.delete(`${API_URL}/${id}`);
