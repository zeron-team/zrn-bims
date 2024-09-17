// frontend/src/pages/DBStructure.js

import React, { useState, useEffect } from 'react';
import { getDBStructure } from '../services/dbService'; // Asegúrate de que este servicio esté implementado
import styles from '../css/DBStructure.module.css';

const DBStructure = ({ connectionId }) => {
    const [structure, setStructure] = useState([]);
    const [expandedTables, setExpandedTables] = useState([]);

    useEffect(() => {
        const fetchStructure = async () => {
            try {
                const data = await getDBStructure(connectionId);
                setStructure(data.structure);
            } catch (error) {
                console.error('Error al obtener la estructura de la base de datos:', error);
            }
        };

        fetchStructure();
    }, [connectionId]);

    const toggleTable = (tableName) => {
        if (expandedTables.includes(tableName)) {
            setExpandedTables(expandedTables.filter((name) => name !== tableName));
        } else {
            setExpandedTables([...expandedTables, tableName]);
        }
    };

    return (
        <div className={styles.container}>
            <h2>Estructura de la Base de Datos</h2>
            {structure.length === 0 && <p>No hay tablas en la base de datos.</p>}
            {structure.map((table) => (
                <div key={table.name} className={styles.tableContainer}>
                    <div className={styles.tableHeader} onClick={() => toggleTable(table.name)}>
                        <span>{table.name}</span>
                        <span>{expandedTables.includes(table.name) ? '-' : '+'}</span>
                    </div>
                    {expandedTables.includes(table.name) && (
                        <div className={styles.columnsContainer}>
                            <ul>
                                {table.columns.map((column) => (
                                    <li key={column}>{column}</li>
                                ))}
                            </ul>
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
};

export default DBStructure;
