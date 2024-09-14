import axios from 'axios';

const API_URL = 'http://localhost:8000/admin/';

export const createDBConnection = (connection, token) => {
    return axios.post(API_URL + 'db-connections', connection, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const getDBConnections = (token) => {
    return axios.get(API_URL + 'db-connections', {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

export const deleteDBConnection = (id, token) => {
    return axios.delete(API_URL + `db-connections/${id}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
