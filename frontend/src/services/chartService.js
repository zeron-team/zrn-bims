import axios from 'axios';

const API_URL = 'http://localhost:8000/charts/';

export const getChartData = (page, token) => {
    return axios.get(API_URL + page, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};
