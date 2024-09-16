// frontend/src/services/pageService.js:

import axios from 'axios';

export const getPages = () => axios.get('/api/pages');
export const createPage = (data) => axios.post('/api/pages', data);
export const updatePage = (id, data) => axios.put(`/api/pages/${id}`, data);
export const deletePage = (id) => axios.delete(`/api/pages/${id}`);