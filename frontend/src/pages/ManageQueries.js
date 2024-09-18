// frontend/src/pages/ManageQueries.js

import React, { useState, useEffect } from 'react';
import { getConnections } from '../services/dbService';  // Reutiliza el servicio de conexiones
import { executeQuery, saveQuery } from '../services/queryService'; // Nuevos servicios para ejecutar y guardar consultas
import Layout from '../components/Layout';
import styles from '../css/ManageQueries.module.css';  // Agrega tu propio estilo

const ManageQueries = () => {
    const [connections, setConnections] = useState([]);
    const [selectedConnection, setSelectedConnection] = useState('');
    const [query, setQuery] = useState('');
    const [result, setResult] = useState(null);
    const [error, setError] = useState('');
    const [savedQueryName, setSavedQueryName] = useState('');

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const response = await getConnections();
            setConnections(response.data);  // Asegúrate de que el formato sea el adecuado
        } catch (error) {
            console.error('Error al obtener las conexiones:', error);
            setError('Error al obtener las conexiones');
        }
    };

    const handleQueryExecution = async () => {
        setError('');
        try {
            const response = await executeQuery(selectedConnection, query);
            setResult(response.data.result);  // Asegúrate de que la respuesta sea correcta
        } catch (error) {
            console.error('Error al ejecutar la consulta:', error);
            setError('Error al ejecutar la consulta');
        }
    };

    const handleSaveQuery = async () => {
        try {
            await saveQuery({ name: savedQueryName, query, connectionId: selectedConnection });
            setError('');
            alert('Consulta guardada exitosamente');
        } catch (error) {
            console.error('Error al guardar la consulta:', error);
            setError('Error al guardar la consulta');
        }
    };

    return (
        <Layout>
            <div className={styles.container}>
                <h2>Gestión de Consultas SQL</h2>
                {error && <p className={styles.error}>{error}</p>}

                <div className={styles.formGroup}>
                    <label>Conexión a Base de Datos:</label>
                    <select value={selectedConnection} onChange={(e) => setSelectedConnection(e.target.value)} required>
                        <option value="">-- Selecciona una conexión --</option>
                        {connections.map((connection) => (
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
                        placeholder="Escribe tu consulta SQL aquí..."
                        rows={6}
                    />
                </div>

                <button onClick={handleQueryExecution} className={styles.button}>
                    Ejecutar Consulta
                </button>

                <div className={styles.formGroup}>
                    <label>Nombre de la consulta (opcional):</label>
                    <input
                        type="text"
                        value={savedQueryName}
                        onChange={(e) => setSavedQueryName(e.target.value)}
                        placeholder="Nombre para guardar la consulta"
                    />
                </div>

                <button onClick={handleSaveQuery} className={styles.button}>
                    Guardar Consulta
                </button>

                {result && (
                    <div className={styles.results}>
                        <h3>Resultados:</h3>
                        <pre>{JSON.stringify(result, null, 2)}</pre>
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default ManageQueries;
