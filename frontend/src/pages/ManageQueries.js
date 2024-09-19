// frontend/src/pages/ManageQueries.js

import React, { useState, useEffect } from 'react';
import { getQueries, runQuery } from '../services/queryService';
import { getConnections } from '../services/dbService';
import Layout from '../components/Layout';
import styles from '../css/ManageQueries.module.css';

const ManageQueries = () => {
    const [queries, setQueries] = useState([]);
    const [connections, setConnections] = useState([]);
    const [query, setQuery] = useState('');
    const [selectedConnection, setSelectedConnection] = useState('');
    const [result, setResult] = useState(null); // Store the result (columns and rows)
    const [recordsToShow, setRecordsToShow] = useState(10); // Number of records to show
    const [filteredRows, setFilteredRows] = useState([]); // Rows filtered by number of records

    useEffect(() => {
        fetchQueries();
        fetchConnections();
    }, []);

    useEffect(() => {
        if (result && result.rows) {
            updateFilteredRows();
        }
    }, [result, recordsToShow]);

    const fetchQueries = async () => {
        try {
            const response = await getQueries();
            setQueries(response.data);
        } catch (error) {
            console.error('Error fetching queries', error);
        }
    };

    const fetchConnections = async () => {
        try {
            const response = await getConnections();
            setConnections(response);
        } catch (error) {
            console.error('Error fetching connections', error);
        }
    };

    const handleRunQuery = async () => {
        try {
            const response = await runQuery({ connection_id: selectedConnection, query });
            setResult(response.data); // Store the columns and rows returned by the backend
            fetchQueries();
        } catch (error) {
            console.error('Error running query', error.response ? error.response.data : error.message);
        }
    };

    // Función para manejar el cambio en el número de registros a mostrar
    const handleRecordsToShowChange = (e) => {
        setRecordsToShow(parseInt(e.target.value, 10) || 'total'); // Convertir a número o a 'total'
    };

    // Actualiza las filas que se muestran según la cantidad seleccionada
    const updateFilteredRows = () => {
        if (recordsToShow === 'total') {
            setFilteredRows(result.rows);
        } else {
            setFilteredRows(result.rows.slice(0, recordsToShow));
        }
    };

    return (
        <Layout>
            <div className={styles.container}>
                <h2>Gestionar Consultas SQL</h2>
                <div className={styles.formGroup}>
                    <label>Seleccionar Conexión:</label>
                    <select onChange={(e) => setSelectedConnection(e.target.value)} value={selectedConnection}>
                        <option value="">-- Seleccionar Conexión --</option>
                        {connections.map(connection => (
                            <option key={connection.id} value={connection.id}>
                                {connection.name} ({connection.db_type})
                            </option>
                        ))}
                    </select>
                </div>

                <div className={styles.formGroup}>
                    <label>Consulta SQL:</label>
                    <textarea
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        placeholder="Escribe tu consulta SQL"
                    />
                </div>

                <button onClick={handleRunQuery} className={styles.runButton}>Ejecutar Consulta</button>

                {result && result.columns && filteredRows && (
                    <div className={styles.result}>
                        <h3>Resultado:</h3>

                        <div className={styles.formGroup}>
                            <label>Mostrar registros:</label>
                            <select onChange={handleRecordsToShowChange} value={recordsToShow}>
                                <option value="10">10 registros</option>
                                <option value="20">20 registros</option>
                                <option value="30">30 registros</option>
                                <option value="50">50 registros</option>
                                <option value="100">100 registros</option>
                                <option value="total">Todos los registros</option>
                            </select>
                        </div>

                        <table className={styles.table}>
                            <thead>
                                <tr>
                                    {result.columns.map((col, index) => (
                                        <th key={index}>{col}</th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody>
                                {filteredRows.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        {result.columns.map((col, colIndex) => (
                                            <td key={colIndex}>{row[col]}</td>
                                        ))}
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                <h3>Consultas Guardadas</h3>
                <ul className={styles.queryList}>
                    {queries.map(q => (
                        <li key={q.id}>
                            <strong>{q.query}</strong>
                            <pre>{q.result}</pre>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
};

export default ManageQueries;
