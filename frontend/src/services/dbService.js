// frontend/src/services/dbService.js

import axios from 'axios';

// Verificar conexión a la base de datos y obtener las bases de datos
export const checkDBConnection = async (dbDetails) => {
    try {
        const response = await axios.post('http://localhost:8000/api/check-db', dbDetails);
        return response.data;
    } catch (error) {
        console.error('Error checking DB connection:', error.response?.data || error);
        throw error;
    }
};

// Guardar la conexión a la base de datos
export const saveDBConnection = async (dbDetails) => {
    try {
        const response = await axios.post('http://localhost:8000/api/save-connection', dbDetails);
        return response.data;
    } catch (error) {
        console.error('Error saving DB connection:', error.response?.data || error);
        throw error;
    }
};

// Obtener todas las conexiones guardadas
export const getConnections = async () => {
    try {
        const response = await axios.get('http://localhost:8000/api/get-connections');
        return response.data;
    } catch (error) {
        console.error('Error getting connections:', error.response?.data || error);
        throw error;
    }
};

// Eliminar una conexión
export const deleteConnection = async (id) => {
    try {
        const response = await axios.delete(`http://localhost:8000/api/delete-connection/${id}`);
        return response.data;
    } catch (error) {
        console.error('Error deleting connection:', error.response?.data || error);
        throw error;
    }
};

// Obtener la estructura de una conexión específica
export const getConnectionStructure = async (id) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/connection/${id}/structure`);
        return response.data;
    } catch (error) {
        console.error('Error getting DB structure:', error.response?.data || error);
        throw error;
    }
};

// Obtener la estructura de una conexión (este es un duplicado, ajustado en la parte de arriba)
export const getDBStructure = async (connectionId) => {
    try {
        const response = await axios.get(`http://localhost:8000/api/connection/${connectionId}/structure`);
        return response.data;
    } catch (error) {
        console.error('Error getting DB structure:', error.response?.data || error);
        throw error;
    }
};
