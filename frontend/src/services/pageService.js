// frontend/src/services/pageService.js

import axios from 'axios';

// Obtener la lista de páginas
export const getPages = async () => {
    return await axios.get('http://localhost:8000/api/pages');
};

// Obtener una página específica por ID
export const getPage = async (id) => {
    return await axios.get(`http://localhost:8000/api/pages/${id}`);
};

// Crear una nueva página
export const createPage = async (pageData) => {
    return await axios.post('http://localhost:8000/api/pages', pageData);
};

// Actualizar una página existente
export const updatePage = async (id, pageData) => {
    return await axios.put(`http://localhost:8000/api/pages/${id}`, pageData);
};

// Eliminar una página por ID
export const deletePage = async (id) => {
    return await axios.delete(`http://localhost:8000/api/pages/${id}`);
};
