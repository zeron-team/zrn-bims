// frontend/src/pages/DynamicPage.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import styles from '../css/PageView.module.css';

const DynamicPage = () => {
    const { id } = useParams();  
    const [page, setPage] = useState(null);  
    const [error, setError] = useState(null);  

    useEffect(() => {
        axios.get(`http://localhost:8000/api/pages/${id}`)  
            .then(response => {
                console.log('Datos de la página:', response.data); // Verificamos los datos recibidos
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
                <h1>{page.nombre}</h1> 
                <div className={styles.description}>{page.descripcion}</div> 
                <div className={styles.content}>
                    <div dangerouslySetInnerHTML={{ __html: page.contenido }} /> 
                </div>
                <div className={styles.structure}>
                    {renderQuadrants('Superior', page.estructura?.superior || 0)}
                    {renderQuadrants('Medio', page.estructura?.medio || 0)}
                    {renderQuadrants('Inferior', page.estructura?.inferior || 0)}
                </div>
            </div>
        </Layout>
    );
};

const renderQuadrants = (sectionName, numberOfQuadrants) => {
    console.log(`Rendering ${numberOfQuadrants} cuadrantes for ${sectionName}`); // Verificar qué se está intentando renderizar
    if (numberOfQuadrants === 0) {
        return null;
    }

    return (
        <div className={styles.section}>
            <h4>{sectionName} ({numberOfQuadrants} Bloque{numberOfQuadrants > 1 ? 's' : ''})</h4>
            <div className={styles.quadrants}>
                {[...Array(numberOfQuadrants)].map((_, index) => (
                    <div key={index} className={styles.quadrant}>
                        {/* Aquí agregamos contenido ficticio para verificar visualización */}
                        <div>{sectionName} - Bloque {index + 1}</div>
                        <div>Contenido del {sectionName} - Bloque {index + 1}</div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default DynamicPage;
