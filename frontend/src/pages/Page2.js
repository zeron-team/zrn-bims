// frontend/src/pages/Page2.js

import React, { useState, useEffect } from 'react';
import { getChartData } from '../services/chartService'; // Asegúrate de que getChartData esté definida
import ChartRenderer from '../components/ChartRenderer'; // Asegúrate de que esta ruta sea correcta
import Layout from '../components/Layout';

const Page2 = () => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        // Suponiendo que el ID del gráfico a visualizar es 1, puedes cambiarlo según lo necesites
        fetchChartData(1);
    }, []);

    const fetchChartData = async (chartId) => {
        try {
            const response = await getChartData(chartId);
            setChartData(response.data);
        } catch (error) {
            console.error('Error fetching chart data', error);
        }
    };

    return (
        <Layout>
            <div>
                <h2>Gráfico Detallado</h2>
                {chartData ? (
                    <ChartRenderer chartData={chartData} />
                ) : (
                    <p>Cargando datos del gráfico...</p>
                )}
            </div>
        </Layout>
    );
};

export default Page2;