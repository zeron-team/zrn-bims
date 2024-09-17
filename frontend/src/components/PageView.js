// frontend/src/components/PageView.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import styles from '../css/PageView.module.css';

const PageView = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {
        axios.get(`http://localhost:8000/api/pages/${id}`)  // Usa el puerto correcto para la API backend
            .then(response => {
                setPage(response.data);
            })
            .catch(error => {
                setError("Error al cargar la página.");
                console.error("Error al cargar la página:", error);
            });
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!page) {
        return <div>Cargando página...</div>;
    }

    return (
        <Layout>
            <div className={styles.pageContainer}>
                <h1>{page.nombre}</h1> {/* Muestra el título de la página */}
                <div className={styles.content}>
                    {page.contenido} {/* Muestra el contenido de la página */}
                </div>
            </div>
        </Layout>
    );
};

export default PageView;
