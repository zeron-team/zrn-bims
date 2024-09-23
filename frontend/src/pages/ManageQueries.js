import React, { useState, useEffect, useCallback } from 'react';
import { getQueries, runQuery, deleteQuery } from '../services/queryService'; // Importa deleteQuery
import { getConnections } from '../services/dbService';
import Layout from '../components/Layout';
import styles from '../css/ManageQueries.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrash } from '@fortawesome/free-solid-svg-icons';

const ManageQueries = () => {
    const [queries, setQueries] = useState([]);
    const [connections, setConnections] = useState([]);
    const [query, setQuery] = useState('');
    const [queryName, setQueryName] = useState('');
    const [selectedConnection, setSelectedConnection] = useState('');
    const [result, setResult] = useState(null);
    const [recordsToShow, setRecordsToShow] = useState(10);
    const [filteredRows, setFilteredRows] = useState([]);
    const [errorMessage, setErrorMessage] = useState(''); // Estado para mensajes de error

    useEffect(() => {
        fetchQueries();
        fetchConnections();
    }, []);

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
            setErrorMessage('Error al cargar las consultas.'); // Mensaje de error si falla la carga de consultas
        }
    };

    const fetchConnections = async () => {
        try {
            const response = await getConnections();
            setConnections(response);
        } catch (error) {
            console.error('Error fetching connections', error);
            setErrorMessage('Error al cargar las conexiones.'); // Mensaje de error si falla la carga de conexiones
        }
    };

    const handleRunQuery = async () => {
        try {
            setErrorMessage(''); // Limpiar cualquier mensaje de error previo
            const response = await runQuery({
                connection_id: selectedConnection,
                query,
                name: queryName || "Unnamed Query"
            });
            setResult(response.data);
            fetchQueries(); // Actualiza la lista de consultas guardadas
        } catch (error) {
            console.error('Error running query', error.response ? error.response.data : error.message);
            setErrorMessage('Error al ejecutar la consulta.'); // Mensaje de error si falla la ejecución de la consulta
        }
    };

    // Función para manejar el cambio en el número de registros a mostrar
    const handleRecordsToShowChange = (e) => {
        const value = e.target.value === 'total' ? 'total' : parseInt(e.target.value, 10);
        setRecordsToShow(value);
    };

    // Función para ver la consulta
    const handleViewQuery = (query) => {
        setQuery(query.query);
        setQueryName(query.name);
        setSelectedConnection(query.connection_id);
    };

    // Función para editar la consulta
    const handleEditQuery = (query) => {
        setQuery(query.query);
        setQueryName(query.name);
        setSelectedConnection(query.connection_id);
    };

    // Función para borrar la consulta
    const handleDeleteQuery = async (queryId) => {
        if (window.confirm("¿Estás seguro de que deseas eliminar esta consulta?")) {
            try {
                await deleteQuery(queryId); // Llamada al servicio con el ID correcto
                setQueries(queries.filter(query => query.id !== queryId)); // Actualiza la lista en el estado
            } catch (error) {
                console.error('Error deleting query', error.response ? error.response.data : error.message);
                setErrorMessage('Error al eliminar la consulta.'); // Mostrar mensaje de error
            }
        }
    };

    // Renderizar la tabla de consultas guardadas
    const renderQueriesTable = () => (
        <div className={styles.tableContainer}>
            <table className={styles.queryTable}>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Consulta</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {queries.map(query => (
                        <tr key={query.id}>
                            <td>{query.name || 'Unnamed Query'}</td>
                            <td><pre>{query.query}</pre></td>
                            <td className={styles.actionButtons}>
                                <button onClick={() => handleViewQuery(query)} className={styles.iconButton}>
                                    <FontAwesomeIcon icon={faEye} />
                                </button>
                                <button onClick={() => handleEditQuery(query)} className={styles.iconButton}>
                                    <FontAwesomeIcon icon={faEdit} />
                                </button>
                                <button onClick={() => handleDeleteQuery(query.id)} className={styles.iconButton}>
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
                <h2>Gestionar Consultas SQL</h2>
                {errorMessage && <div className={styles.errorMessage}>{errorMessage}</div>} {/* Mostrar error */}
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
                {renderQueriesTable()} {/* Renderizar la tabla de consultas guardadas */}
            </div>
        </Layout>
    );
};

export default ManageQueries;
