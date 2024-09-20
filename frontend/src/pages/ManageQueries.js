// frontend/src/pages/ManageQueries.js

import React, { useState, useEffect, useCallback } from 'react';
import { getQueries, runQuery } from '../services/queryService';
import { getConnections } from '../services/dbService';
import Layout from '../components/Layout';
import styles from '../css/ManageQueries.module.css';

const ManageQueries = () => {
    const [queries, setQueries] = useState([]);
    const [connections, setConnections] = useState([]);
    const [query, setQuery] = useState('');
    const [queryName, setQueryName] = useState(''); // Nuevo campo para el nombre de la consulta
    const [selectedConnection, setSelectedConnection] = useState('');
    const [result, setResult] = useState(null); // Almacena el resultado (columnas y filas)
    const [recordsToShow, setRecordsToShow] = useState(10); // Número de registros a mostrar
    const [filteredRows, setFilteredRows] = useState([]); // Filas filtradas por número de registros

    useEffect(() => {
        fetchQueries();
        fetchConnections();
    }, []);

    // Definir la función con useCallback para asegurarse de que no cambie innecesariamente
    const updateFilteredRows = useCallback(() => {
        if (result && result.rows) {
            if (recordsToShow === 'total') {
                setFilteredRows(result.rows);
            } else {
                setFilteredRows(result.rows.slice(0, recordsToShow));
            }
        }
    }, [result, recordsToShow]);

    useEffect(() => {
        updateFilteredRows();
    }, [result, recordsToShow, updateFilteredRows]);

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
            const response = await runQuery({
                connection_id: selectedConnection,
                query,
                name: queryName || "Unnamed Query" // Si no se proporciona nombre, usar valor por defecto
            });
            setResult(response.data); // Almacena las columnas y filas devueltas por el backend
            fetchQueries(); // Actualiza la lista de consultas guardadas
        } catch (error) {
            console.error('Error running query', error.response ? error.response.data : error.message);
        }
    };

    // Función para manejar el cambio en el número de registros a mostrar
    const handleRecordsToShowChange = (e) => {
        const value = e.target.value === 'total' ? 'total' : parseInt(e.target.value, 10);
        setRecordsToShow(value); // Establece el número de registros a mostrar
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
                    <label>Nombre de la Consulta:</label>
                    <input
                        type="text"
                        value={queryName}
                        onChange={(e) => setQueryName(e.target.value)}
                        placeholder="Nombre descriptivo de la consulta"
                    />
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
                            <strong>{q.name || 'Unnamed Query'}:</strong>
                            <pre>{q.query}</pre>
                        </li>
                    ))}
                </ul>
            </div>
        </Layout>
    );
};

export default ManageQueries;
