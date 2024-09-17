// frontend/src/pages/ManageDB.js

import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout'; // Asegúrate de que el Layout está correctamente importado
import { checkDBConnection, saveDBConnection, getConnections, deleteConnection, getConnectionStructure } from '../services/dbService';  // Importa la nueva función
import styles from '../css/ManageDB.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ManageDB = () => {
    const [dbType, setDbType] = useState('mysql');
    const [host, setHost] = useState('');
    const [port, setPort] = useState('');
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [database, setDatabase] = useState('');
    const [databasesList, setDatabasesList] = useState([]);
    const [connectionName, setConnectionName] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [connections, setConnections] = useState([]);
    const [dbStructure, setDbStructure] = useState(null);
    const [expandedTables, setExpandedTables] = useState({});

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = async () => {
        try {
            const response = await getConnections();
            setConnections(response);
        } catch (error) {
            console.error("Error al obtener las conexiones:", error);
        }
    };

    const handleCheckConnection = async () => {
        try {
            const databases = await checkDBConnection({
                db_type: dbType,
                host,
                port,
                username,
                password
            });
            setDatabasesList(databases);
            setErrorMessage('');
            setSuccessMessage('Conexión exitosa. Selecciona la base de datos.');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.detail || 'Error al conectar a la base de datos');
            setSuccessMessage('');
        }
    };

    const handleSaveConnection = async () => {
        try {
            if (!connectionName || !database) {
                setErrorMessage('Por favor, completa todos los campos.');
                return;
            }

            await saveDBConnection({
                name: connectionName,
                db_type: dbType,
                host,
                port: parseInt(port, 10),
                username,
                password,
                db_name: database
            });
            setErrorMessage('');
            setSuccessMessage('Conexión guardada exitosamente.');
            fetchConnections(); // Actualiza la lista de conexiones
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.detail || 'Error al guardar la conexión');
            setSuccessMessage('');
        }
    };

    const handleDeleteConnection = async (id) => {
        try {
            await deleteConnection(id);
            setSuccessMessage('Conexión eliminada correctamente.');
            fetchConnections();
        } catch (error) {
            console.error(error);
            setErrorMessage('Error al eliminar la conexión.');
        }
    };

    const handleViewStructure = async (id) => {
        try {
            const structure = await getConnectionStructure(id);
            setDbStructure(structure);
        } catch (error) {
            console.error('Error al obtener la estructura de la conexión:', error);
            setErrorMessage('Error al obtener la estructura de la base de datos.');
        }
    };

    // Función para alternar el despliegue de tablas
    const toggleTable = (tableName) => {
        setExpandedTables((prevExpanded) => ({
            ...prevExpanded,
            [tableName]: !prevExpanded[tableName]  // Alterna el estado de expandido/colapsado
        }));
    };

    return (
        <Layout> {/* Envuelve el contenido dentro del layout */}
            <div className={styles.container}>
                <h2>Gestión de DB</h2>
                <form className={styles.form}>
                    {/* Formulario para añadir nuevas conexiones */}
                    <div className={styles.formGroup}>
                        <label>Nombre de la Conexión:</label>
                        <input 
                            type="text" 
                            value={connectionName} 
                            onChange={(e) => setConnectionName(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Tipo de DB:</label>
                        <select value={dbType} onChange={(e) => setDbType(e.target.value)}>
                            <option value="mysql">MySQL</option>
                            <option value="postgresql">PostgreSQL</option>
                            <option value="sqlserver">SQLServer</option>
                            <option value="mongodb">MongoDB</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Host:</label>
                        <input 
                            type="text" 
                            value={host} 
                            onChange={(e) => setHost(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Puerto:</label>
                        <input 
                            type="number" 
                            value={port} 
                            onChange={(e) => setPort(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Usuario:</label>
                        <input 
                            type="text" 
                            value={username} 
                            onChange={(e) => setUsername(e.target.value)} 
                            required 
                        />
                    </div>
                    <div className={styles.formGroup}>
                        <label>Contraseña:</label>
                        <input 
                            type="password" 
                            value={password} 
                            onChange={(e) => setPassword(e.target.value)} 
                            required 
                        />
                    </div>

                    <button type="button" className={styles.checkButton} onClick={handleCheckConnection}>
                        Check Conexión
                    </button>

                    {databasesList.length > 0 && (
                        <div className={styles.formGroup}>
                            <label>Seleccionar Base de Datos:</label>
                            <select 
                                value={database} 
                                onChange={(e) => setDatabase(e.target.value)}
                                required
                            >
                                <option value="" disabled>-- Selecciona una Base de Datos --</option>
                                {databasesList.map((db, index) => (
                                    <option key={index} value={db}>{db}</option>
                                ))}
                            </select>
                        </div>
                    )}

                    <button type="button" className={styles.saveButton} onClick={handleSaveConnection}>
                        Guardar Conexión
                    </button>

                    {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                    {successMessage && <p className={styles.success}>{successMessage}</p>}
                </form>

                <h3>Conexiones Guardadas</h3>
                <table className={styles.connectionTable}>
                    <thead>
                        <tr>
                            <th>Nombre</th>
                            <th>Tipo</th>
                            <th>Usuario</th>
                            <th>Host</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {connections.map(connection => (
                            <tr key={connection.id}>
                                <td>{connection.name}</td>
                                <td>{connection.db_type}</td>
                                <td>{connection.username}</td>
                                <td>{connection.host}</td>
                                <td>
                                    <button onClick={() => handleViewStructure(connection.id)}>
                                        <FontAwesomeIcon icon={faEye} />
                                    </button>
                                    <button onClick={() => console.log('Editar', connection.id)}>
                                        <FontAwesomeIcon icon={faEdit} />
                                    </button>
                                    <button onClick={() => handleDeleteConnection(connection.id)}>
                                        <FontAwesomeIcon icon={faTrashAlt} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                {dbStructure && (
                    <div>
                        <h3>Estructura de la Base de Datos</h3>
                        {dbStructure.structure.map((table, index) => (
                            <div key={index}>
                                {/* Botón para desplegar o colapsar la tabla */}
                                <div className={styles.tableHeader} onClick={() => toggleTable(table.name)}>
                                    <span>{expandedTables[table.name] ? '-' : '+'}</span> {/* Icono + o - */}
                                    <strong>{table.name}</strong>
                                </div>
                                {/* Desplegar columnas de la tabla */}
                                {expandedTables[table.name] && (
                                    <ul className={styles.columnList}>
                                        {table.columns.map((column, idx) => (
                                            <li key={idx}>{column}</li>
                                        ))}
                                    </ul>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </Layout>  
    );
};

export default ManageDB;
