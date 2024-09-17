// frontend/src/pages/DynamicPage.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { getPage } from '../services/pageService'; // Asegúrate de tener este servicio que obtiene una página por ID

const DynamicPage = () => {
    const { id } = useParams();
    const [page, setPage] = useState(null);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchPage = async () => {
            try {
                const response = await getPage(id);
                setPage(response.data);
            } catch (err) {
                setError('Error al cargar la página.');
            }
        };

        fetchPage();
    }, [id]);

    if (error) {
        return <div>{error}</div>;
    }

    if (!page) {
        return <div>Cargando página...</div>;
    }

    return (
        <div>
            <h1>{page.nombre}</h1>
            <div dangerouslySetInnerHTML={{ __html: page.contenido }} />
        </div>
    );
};

export default DynamicPage;
