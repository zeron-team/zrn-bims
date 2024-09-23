// frontend/src/pages/Page1.js

import React, { useState, useEffect } from 'react';
import { getCharts } from '../services/chartService'; // Asegúrate de importar correctamente
import ChartRenderer from '../components/ChartRenderer'; // Asegúrate de que esta ruta sea correcta
import Layout from '../components/Layout';

const Page1 = () => {
    const [charts, setCharts] = useState([]);

    useEffect(() => {
        fetchCharts();
    }, []);

    const fetchCharts = async () => {
        try {
            const response = await getCharts(); // Asegúrate de que getCharts esté definido en chartService
            setCharts(response.data);
        } catch (error) {
            console.error('Error fetching charts', error);
        }
    };

    return (
        <Layout>
            <div>
                <h2>Página de Gráficos</h2>
                {charts.map(chart => (
                    <ChartRenderer key={chart.id} chartData={chart} />
                ))}
            </div>
        </Layout>
    );
};

export default Page1;