// frontend/src/pages/DynamicPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';  // Asegúrate de que el Layout esté importado correctamente
import styles from '../css/DynamicPage.module.css';  // Usa tu propio CSS si es necesario

const DynamicPage = () => {
    const { id } = useParams();  // Obtiene el 'id' de la página desde la URL
    const [page, setPage] = useState(null);  // Estado para almacenar la página cargada
    const [error, setError] = useState(null);  // Estado para manejar errores

    useEffect(() => {
        axios.get(`http://localhost:8000/api/pages/${id}`)  // Reemplaza con la URL de tu backend
            .then(response => {
                setPage(response.data);  // Almacena los datos de la página en el estado
            })
            .catch(error => {
                setError("Error al cargar la página.");  // Manejador de errores
                console.error("Error al cargar la página:", error);
            });
    }, [id]);

    if (error) {
        return <div>{error}</div>;  // Muestra error si ocurre
    }

    if (!page) {
        return <div>Cargando página...</div>;  // Muestra mensaje de carga mientras se obtienen los datos
    }

    return (
        <Layout>  {/* Aquí envolvemos el contenido en el Layout */}
            <div className={styles.pageContainer}>
                <h1>{page.nombre}</h1> {/* Título de la página */}
                <div className={styles.content}>
                    <div dangerouslySetInnerHTML={{ __html: page.contenido }} />  {/* Renderiza el contenido como HTML */}
                </div>
            </div>
        </Layout>
    );
};

export default DynamicPage;
