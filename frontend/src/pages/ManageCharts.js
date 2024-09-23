//frontend/src/pages/ManageCharts.js

import React, { useState, useEffect } from 'react';
import { getQueries, runQuery } from '../services/queryService';
import { getCharts, createChart, updateChart, deleteChart } from '../services/chartService';
import Layout from '../components/Layout';
import styles from '../css/ManageCharts.module.css';
import ChartRenderer from '../components/ChartRenderer';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ManageCharts = () => {
    const [queries, setQueries] = useState([]);
    const [selectedQuery, setSelectedQuery] = useState('');
    const [chartType, setChartType] = useState('column');
    const [chartTitle, setChartTitle] = useState('');
    const [charts, setCharts] = useState([]);
    const [queryResult, setQueryResult] = useState(null);
    const [xAxis, setXAxis] = useState('');
    const [yAxis, setYAxis] = useState('');
    const [isEditMode, setIsEditMode] = useState(false);
    const [chartToEdit, setChartToEdit] = useState(null);

    useEffect(() => {
        fetchQueries();
        fetchCharts();
    }, []);

    // Obtener consultas guardadas
    const fetchQueries = async () => {
        try {
            const response = await getQueries();
            setQueries(response.data);
            console.log("Consultas cargadas:", response.data);
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
            console.log("ID de consulta seleccionada:", queryId);
            const selectedQueryObj = queries.find(q => q.id === parseInt(queryId, 10));
            
            if (!selectedQueryObj) {
                console.error('No se encontró la consulta seleccionada.');
                return;
            }

            console.log("Consulta seleccionada:", selectedQueryObj);

            if (!selectedQueryObj.connection_id) {
                console.error('La consulta seleccionada no tiene un connection_id.');
                return;
            }

            // Ejecutar solo la consulta para obtener datos
            const response = await runQuery({
                connection_id: selectedQueryObj.connection_id,
                query: selectedQueryObj.query
            });

            setQueryResult(response.data);
            console.log("Resultado de la consulta:", response.data);
        } catch (error) {
            console.error('Error running query', error.response ? error.response.data : error.message);
        }
    };

    // Crear o actualizar un gráfico
    const handleSaveChart = async () => {
        if (!xAxis || !yAxis) {
           alert('Selecciona tanto el eje X como el eje Y para crear el gráfico.');
           return;
        }

        try {
            const chartDetails = {
                query_id: selectedQuery,
                chart_type: chartType,
                chart_title: chartTitle,
                chart_options: JSON.stringify({
                    xAxis: xAxis,
                    yAxis: yAxis
                }),
                chart_data: ''  
            };

            if (isEditMode && chartToEdit) {
                const response = await updateChart(chartToEdit.id, chartDetails);
                console.log("Gráfico actualizado:", response.data);
            } else {
                const response = await createChart(chartDetails);
                console.log("Nuevo gráfico creado:", response.data);
            }

            fetchCharts(); 
            resetForm(); 
        } catch (error) {
            console.error('Error saving chart', error.response ? error.response.data : error.message);
        }
    };

    const resetForm = () => {
        setSelectedQuery('');
        setChartType('column');
        setChartTitle('');
        setXAxis('');
        setYAxis('');
        setIsEditMode(false);
        setChartToEdit(null);
        setQueryResult(null);
    };

    const handleDeleteChart = async (chartId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar este gráfico?")) {
            try {
                await deleteChart(chartId);
                fetchCharts(); 
            } catch (error) {
                console.error('Error deleting chart', error.response ? error.response.data : error.message);
            }
        }
    };

    const handleEditChart = (chart) => {
        setIsEditMode(true);
        setChartToEdit(chart);
        setSelectedQuery(chart.query_id);
        setChartType(chart.chart_type);
        setChartTitle(chart.chart_title);

        const chartOptions = JSON.parse(chart.chart_options);
        setXAxis(chartOptions.xAxis);
        setYAxis(chartOptions.yAxis);
        fetchQueryResult(chart.query_id);
    };

    const handleViewChart = (chart) => {
        handleEditChart(chart); // Reutilizamos la lógica de edición para cargar los datos del gráfico
    };

    const renderChartTable = () => (
        <div className={styles.tableContainer}>
            <table className={styles.chartTable}>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Tipo</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {charts.map(chart => (
                        <tr key={chart.id}>
                            <td>{chart.chart_title}</td>
                            <td>{chart.chart_type}</td>
                            <td className={styles.actionButtons}>
                                <button onClick={() => handleViewChart(chart)} className={styles.iconButton}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button onClick={() => handleEditChart(chart)} className={styles.iconButton}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button onClick={() => handleDeleteChart(chart.id)} className={styles.iconButton}>
                                    <FontAwesomeIcon icon={faTrash} />
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );

    return (
        <Layout>
            <div className={styles.container}>
                <h2>{isEditMode ? 'Editar Gráfico' : 'Gestionar Gráficos'}</h2>
                <div className={styles.formGroup}>
                    <label htmlFor="querySelect">Seleccionar Consulta Guardada:</label>
                    <select
                        id="querySelect" 
                        name="querySelect" 
                        onChange={(e) => {
                            setSelectedQuery(e.target.value);
                            fetchQueryResult(e.target.value); 
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
                        autoComplete="off"
                    />
                </div>
                <button onClick={handleSaveChart} className={styles.createButton}>
                    {isEditMode ? 'Actualizar Gráfico' : 'Crear Gráfico'}
                </button>
                <button onClick={resetForm} className={styles.cancelButton} style={{ marginLeft: '10px' }}>
                    Cancelar
                </button>

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
                {renderChartTable()}
            </div>
        </Layout>
    );
};

export default ManageCharts;
