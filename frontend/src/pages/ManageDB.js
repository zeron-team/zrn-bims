// frontend/src/pages/ManageDB.js

import React, { useState } from 'react';
import { checkDBConnection, saveDBConnection } from '../services/dbService';  // Servicios para manejar la DB
import styles from '../css/ManageDB.module.css';

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

    const handleCheckConnection = async () => {
        try {
            const databases = await checkDBConnection({
                db_type: dbType,  // Asegúrate de usar 'db_type'
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
                db_type: dbType,  // Asegúrate de usar 'db_type'
                host,
                port: parseInt(port, 10),  // Asegúrate de que 'port' sea un número
                username,
                password,
                db_name: database  // Asegúrate de usar 'db_name'
            });
            setErrorMessage('');
            setSuccessMessage('Conexión guardada exitosamente.');
        } catch (error) {
            console.error(error);
            setErrorMessage(error.response?.data?.detail || 'Error al guardar la conexión');
            setSuccessMessage('');
        }
    };

    return (
        <div className={styles.container}>
            <h2>Gestión de DB</h2>
            <form className={styles.form}>
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

                {/* Botón de Check Conexión */}
                <button 
                    type="button" 
                    className={styles.checkButton} 
                    onClick={handleCheckConnection}
                >
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

                {/* Botón de Guardar Conexión */}
                <button 
                    type="button" 
                    className={styles.saveButton} 
                    onClick={handleSaveConnection}
                >
                    Guardar Conexión
                </button>

                {/* Mensajes de Error y Éxito */}
                {errorMessage && <p className={styles.error}>{errorMessage}</p>}
                {successMessage && <p className={styles.success}>{successMessage}</p>}
            </form>
        </div>
    );
};

export default ManageDB;
