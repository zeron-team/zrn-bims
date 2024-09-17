// frontend/src/services/dbService.js

import axios from 'axios';

// Verificar conexión a la base de datos y obtener las bases de datos
export const checkDBConnection = async (dbDetails) => {
    const response = await axios.post('http://localhost:8000/api/check-db', dbDetails);
    return response.data;
};

// Guardar la conexión a la base de datos
export const saveDBConnection = async (dbDetails) => {
    const response = await axios.post('http://localhost:8000/api/save-connection', dbDetails);
    return response.data;
};

// Conectarse a la base de datos
export const connectToDB = async (dbDetails) => {
    const response = await axios.post('http://localhost:8000/api/connect-db', dbDetails);
    return response.data;
};
