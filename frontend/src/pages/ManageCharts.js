//frontend/src/pages/ManageCharts.js

import React, { useState, useEffect } from 'react';
import { getQueries, runQuery } from '../services/queryService';
import { getCharts, createChart } from '../services/chartService';
import Layout from '../components/Layout';
import styles from '../css/ManageCharts.module.css';
import ChartRenderer from '../components/ChartRenderer'; // Importar ChartRenderer para mostrar el gráfico

const ManageCharts = () => {
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState('');
    const [chartType, setChartType] = useState('column');
    const [chartTitle, setChartTitle] = useState('');
    const [charts, setCharts] = useState([]);
    const [queryResult, setQueryResult] = useState(null); // Resultado de la consulta seleccionada
    const [xAxis, setXAxis] = useState(''); // Columna seleccionada para el eje X
    const [yAxis, setYAxis] = useState(''); // Columna seleccionada para el eje Y

    useEffect(() => {
        fetchQueries();
        fetchCharts();
    }, []);

    // Obtener consultas guardadas
    const fetchQueries = async () => {
        try {
            const response = await getQueries();
            setQueries(response.data);
            console.log("Consultas cargadas:", response.data); // Verifica las consultas cargadas
        } catch (error) {
            console.error('Error fetching queries', error);
        }
    };

    // Obtener gráficos guardados
    const fetchCharts = async () => {
        try {
            const response = await getCharts();
            setCharts(response.data);
        } catch (error) {
            console.error('Error fetching charts', error);
        }
    };

    // Ejecutar consulta seleccionada y obtener datos
    const fetchQueryResult = async (queryId) => {
        try {
            console.log("ID de consulta seleccionada:", queryId); // Verifica el ID seleccionado
            const selectedQueryObj = queries.find(q => q.id === parseInt(queryId, 10)); // Asegúrate de que coincida el tipo de dato

            if (!selectedQueryObj) {
                console.error('No se encontró la consulta seleccionada.');
                return;
            }

            console.log("Consulta seleccionada:", selectedQueryObj); // Verifica el objeto de consulta seleccionado

            if (!selectedQueryObj.connection_id) {
                console.error('La consulta seleccionada no tiene un connection_id.');
                return;
            }

            const response = await runQuery({
                connection_id: selectedQueryObj.connection_id,
                query: selectedQueryObj.query
            });

            setQueryResult(response.data); // Almacenar resultado de la consulta
            console.log("Resultado de la consulta:", response.data); // Verificar el resultado de la consulta
        } catch (error) {
            console.error('Error running query', error.response ? error.response.data : error.message);
        }
    };

    // Crear un gráfico y guardarlo
    const handleCreateChart = async () => {
        if (!xAxis || !yAxis) {
            alert('Selecciona tanto el eje X como el eje Y para crear el gráfico.');
            return;
        }
    
        try {
            const newChart = {
                query_id: selectedQuery,
                chart_type: chartType,
                chart_title: chartTitle,  // Asegúrate de enviar chart_title
                chart_options: JSON.stringify({
                    xAxis: xAxis,
                    yAxis: yAxis
                }),
                chart_data: JSON.stringify(queryResult.rows.map(row => ({
                    x: row[xAxis],
                    y: row[yAxis]
                })))  // Si deseas guardar datos específicos del gráfico
            };
            const response = await createChart(newChart);
            console.log("Nuevo gráfico creado:", response.data);  // Muestra el nuevo gráfico creado
            fetchCharts();  // Actualizar la lista de gráficos
        } catch (error) {
            console.error('Error creating chart', error.response ? error.response.data : error.message);
        }
    };
    

    return (
        <Layout>
            <div className={styles.container}>
                <h2>Gestionar Gráficos</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="querySelect">Seleccionar Consulta Guardada:</label>
                    <select
                        id="querySelect" 
                        name="querySelect" 
                        onChange={(e) => {
                            setSelectedQuery(e.target.value);
                            fetchQueryResult(e.target.value); // Obtener resultado de la consulta al seleccionar
                        }}
                        value={selectedQuery}
                    >
                        <option value="">-- Seleccionar Consulta --</option>
                        {queries.map(query => (
                            <option key={query.id} value={query.id}>
                                {query.name}
                            </option>
                        ))}
                    </select>
                </div>
                {queryResult && queryResult.columns && queryResult.columns.length > 0 && (
                    <>
                        <div className={styles.formGroup}>
                            <label htmlFor="chartType">Tipo de Gráfico:</label>
                            <select 
                                id="chartType" 
                                name="chartType" 
                                onChange={(e) => setChartType(e.target.value)} 
                                value={chartType}
                            >
                                <option value="column">Columnas</option>
                                <option value="line">Líneas</option>
                                <option value="bar">Barras</option>
                                <option value="pie">Circular</option>
                                <option value="area">Área</option>
                                <option value="scatter">Dispersión</option>
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="xAxisSelect">Eje X:</label>
                            <select 
                                id="xAxisSelect" 
                                name="xAxisSelect" 
                                onChange={(e) => setXAxis(e.target.value)} 
                                value={xAxis}
                            >
                                <option value="">-- Seleccionar Columna para X --</option>
                                {queryResult.columns.map(column => (
                                    <option key={column} value={column}>
                                        {column}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className={styles.formGroup}>
                            <label htmlFor="yAxisSelect">Eje Y:</label>
                            <select 
                                id="yAxisSelect" 
                                name="yAxisSelect" 
                                onChange={(e) => setYAxis(e.target.value)} 
                                value={yAxis}
                            >
                                <option value="">-- Seleccionar Columna para Y --</option>
                                {queryResult.columns.map(column => (
                                    <option key={column} value={column}>
                                        {column}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </>
                )}
                <div className={styles.formGroup}>
                    <label htmlFor="chartTitle">Título del Gráfico:</label>
                    <input
                        id="chartTitle"
                        name="chartTitle"
                        type="text"
                        value={chartTitle}
                        onChange={(e) => setChartTitle(e.target.value)}
                        placeholder="Título descriptivo del gráfico"
                        autoComplete="off" // Cambiado 'autocomplete' por 'autoComplete'
                    />
                </div>
                <button onClick={handleCreateChart} className={styles.createButton}>Crear Gráfico</button>

                {queryResult && xAxis && yAxis && (
                    <div className={styles.chartPreview}>
                        <h3>Vista previa del gráfico</h3>
                        <ChartRenderer
                            chartData={{
                                chart_type: chartType,
                                chart_title: chartTitle,
                                chart_options: JSON.stringify({
                                    xAxis: xAxis,
                                    yAxis: yAxis
                                }),
                                data: queryResult.rows.map(row => ({
                                    x: row[xAxis],
                                    y: row[yAxis]
                                }))
                            }}
                        />
                    </div>
                )}

                <h3>Gráficos Guardados</h3>
                <ul className={styles.chartList}>
                    {charts.map(chart => (
                        <li key={chart.id}>
                            <strong>{chart.name}:</strong> {chart.chart_type}
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
};

export default ManageCharts;
