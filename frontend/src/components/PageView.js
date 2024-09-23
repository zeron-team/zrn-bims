// frontend/src/components/PageView.js

import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Layout from '../components/Layout';
import styles from '../css/PageView.module.css';

const PageView = () => {
    const { id } = useParams(); // Obtiene el parámetro 'id' de la URL
    const [page, setPage] = useState(null); // Estado para almacenar los datos de la página
    const [error, setError] = useState(null); // Estado para manejar errores

    // Efecto para obtener los datos de la página usando el 'id'
    useEffect(() => {
        axios.get(`http://localhost:8000/api/pages/${id}`) // Asegúrate de que la API esté configurada correctamente
            .then(response => {
                console.log('Datos de la página:', response.data); // Verificar los datos recibidos
                setPage(response.data); // Almacena los datos de la página en el estado
            })
            .catch(error => {
                setError("Error al cargar la página."); // Maneja errores de la API
                console.error("Error al cargar la página:", error);
            });
    }, [id]);

    // Muestra mensaje de error si lo hay
    if (error) {
        return <div>{error}</div>;
    }

    // Muestra el mensaje de carga mientras se obtienen los datos
    if (!page) {
        return <div>Cargando página...</div>;
    }

    // Función para renderizar los cuadrantes según la estructura
    const renderQuadrants = (sectionName, numberOfQuadrants) => {
        if (numberOfQuadrants === 0) {
            return null; // No renderizar nada si no hay cuadrantes
        }

        return (
            <div className={styles.section}>
                <h4>{sectionName} ({numberOfQuadrants} Bloque{numberOfQuadrants > 1 ? 's' : ''})</h4>
                <div className={styles.quadrants}>
                    {[...Array(numberOfQuadrants)].map((_, index) => (
                        <div key={index} className={styles.quadrant}>
                            {/* Aquí puedes agregar el contenido de cada cuadrante */}
                            <div>{sectionName} - Bloque {index + 1}</div>
                            <div>Contenido del {sectionName} - Bloque {index + 1}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    };

    return (
        <Layout>
            <div className={styles.pageContainer}>
                <h1>{page.nombre}</h1> {/* Muestra el título de la página */}
                <div className={styles.description}>{page.descripcion}</div> {/* Muestra la descripción de la página */}
                <div className={styles.content}>
                    <div dangerouslySetInnerHTML={{ __html: page.contenido }} /> {/* Renderiza el contenido */}
                </div>
                {/* Renderiza la estructura de cuadrantes según los datos */}
                <div className={styles.structure}>
                    {renderQuadrants('Superior', page.estructura.superior)}
                    {renderQuadrants('Medio', page.estructura.medio)}
                    {renderQuadrants('Inferior', page.estructura.inferior)}
                </div>
            </div>
        </Layout>
    );
};

export default PageView;
