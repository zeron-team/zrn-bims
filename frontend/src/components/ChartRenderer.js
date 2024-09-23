// frontend/src/components/ChartRenderer.js

import React from 'react';
import Highcharts from 'highcharts';
import HighchartsReact from 'highcharts-react-official';

const ChartRenderer = ({ chartData }) => {
    // Validar los datos de entrada
    const data = chartData?.data || [];

    // Parsear las opciones del gráfico de forma segura
    let parsedOptions = {};
    try {
        parsedOptions = chartData?.chart_options ? JSON.parse(chartData.chart_options) : {};
    } catch (error) {
        console.error('Error parsing chart options:', error);
    }

    // Configuración de Highcharts
    const options = {
        chart: {
            type: chartData?.chart_type || 'line', // Tipo de gráfico por defecto: línea
        },
        title: {
            text: chartData?.chart_title || 'Gráfico sin título', // Título por defecto
        },
        xAxis: {
            categories: data.map(item => item?.x || 'No data'), // Utiliza los datos seleccionados para X o 'No data'
            title: {
                text: parsedOptions?.xAxis || 'Eje X' // Título por defecto para el eje X
            }
        },
        yAxis: {
            title: {
                text: parsedOptions?.yAxis || 'Eje Y' // Título por defecto para el eje Y
            }
        },
        series: [
            {
                name: chartData?.chart_title || 'Serie de datos', // Nombre de la serie
                data: data.map(item => item?.y || 0) // Utiliza los datos seleccionados para Y o 0 como valor por defecto
            }
        ]
    };

    return (
        <HighchartsReact highcharts={Highcharts} options={options} />
    );
};

export default ChartRenderer;
