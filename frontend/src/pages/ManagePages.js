// frontend/src/components/ManagePages.js

import React, { useState, useEffect } from 'react';
import { getPages, createPage, updatePage, deletePage } from '../services/pageService'; // Elimina la importación de 'getPage'
import { Link } from 'react-router-dom'; // Asegúrate de importar Link
import Layout from '../components/Layout';
import styles from '../css/ManagePages.module.css';

const ManagePages = () => {
    const [pages, setPages] = useState([]);
    const [form, setForm] = useState({ nombre: '', contenido: '', estado: false, url: '' }); // Incluye 'url'
    const [pageUrl, setPageUrl] = useState(''); // Nueva URL de la página
    const [errorMessage, setErrorMessage] = useState(''); // Para manejar errores

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = () => {
        getPages()
            .then(response => setPages(response.data))
            .catch(error => {
                console.error(error);
                setErrorMessage("Error al cargar las páginas.");
            });
    };

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm({
            ...form,
            [name]: type === 'checkbox' ? checked : value
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(''); // Reiniciar el mensaje de error
        if (form.nombre.trim() === '' || form.contenido.trim() === '' || form.url.trim() === '') {
            setErrorMessage('Por favor completa todos los campos antes de enviar.');
            return;
        }

        if (form.id) {
            updatePage(form.id, form)
                .then(() => {
                    fetchPages();
                    setForm({ nombre: '', contenido: '', estado: false, url: '' }); // Restablecer formulario
                    setErrorMessage('Página actualizada exitosamente.');
                })
                .catch(error => {
                    console.error(error);
                    setErrorMessage('Error al actualizar la página.');
                });
        } else {
            createPage(form)
                .then((response) => {
                    fetchPages();
                    setForm({ nombre: '', contenido: '', estado: false, url: '' });
                    setPageUrl(`/page/${response.data.id}`); // Establece la nueva URL
                    setErrorMessage('Página creada exitosamente.');
                })
                .catch(error => {
                    console.error(error);
                    setErrorMessage('Error al crear la página.');
                });
        }
    };

    const handleEdit = (page) => {
        setForm(page);
    };

    const handleDelete = (id) => {
        setErrorMessage(''); // Reiniciar el mensaje de error
        deletePage(id)
            .then(() => {
                fetchPages();
                setErrorMessage('Página eliminada exitosamente.');
            })
            .catch(error => {
                console.error(error);
                setErrorMessage('Error al eliminar la página.');
            });
    };

    return (
        <Layout>
            <div className={styles.container}>
                <h2>Administrar Páginas</h2>
                
                {/* Mostrar mensaje de error o éxito */}
                {errorMessage && <p className={styles.errorMessage}>{errorMessage}</p>}

                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="nombre"
                        placeholder="Título de la página"
                        value={form.nombre}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="text"
                        name="url"
                        placeholder="URL de la página"
                        value={form.url}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <textarea
                        name="contenido"
                        placeholder="Contenido de la página"
                        value={form.contenido}
                        onChange={handleChange}
                        className={styles.textarea}
                        required
                    />
                    <label className={styles.checkboxLabel}>
                        Publicar:
                        <input
                            type="checkbox"
                            name="estado"
                            checked={form.estado}
                            onChange={handleChange}
                        />
                    </label>
                    <button type="submit" className={styles.button}>
                        {form.id ? 'Actualizar Página' : 'Agregar Página'}
                    </button>
                </form>

                {/* Mostrar la nueva URL si se ha creado o editado una página */}
                {pageUrl && (
                    <p className={styles.successMessage}>
                        Página disponible en: <Link to={pageUrl}>{pageUrl}</Link> {/* Usa Link para navegación interna */}
                    </p>
                )}

                <h3>Lista de Páginas</h3>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Título</th>
                            <th>Estado</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {pages.length > 0 ? (
                            pages.map(page => (
                                <tr key={page.id}>
                                    <td>{page.nombre}</td>
                                    <td>{page.estado ? 'Publicado' : 'Borrador'}</td>
                                    <td>
                                        <button onClick={() => handleEdit(page)} className={styles.actionButton}>Editar</button>
                                        <button onClick={() => handleDelete(page.id)} className={styles.actionButton}>Eliminar</button>
                                        <Link to={`/page/${page.id}`} className={styles.actionButton}>Ver Página</Link>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No hay páginas disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default ManagePages;
