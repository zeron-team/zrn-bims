// frontend/src/components/ManagePages.js

import React, { useState, useEffect } from 'react';
import { getPages, createPage, updatePage, deletePage } from '../services/pageService';
import { Link } from 'react-router-dom';
import Layout from '../components/Layout';
import styles from '../css/ManagePages.module.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

const ManagePages = () => {
    const [pages, setPages] = useState([]);
    const [form, setForm] = useState({ 
        nombre: '', 
        descripcion: '', 
        contenido: '', 
        estado: false, 
        url: '', 
        estructura: { superior: 1, medio: 1, inferior: 1 }
    });
    const [pageUrl, setPageUrl] = useState(''); 
    const [errorMessage, setErrorMessage] = useState(''); 

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
        if (name.includes('estructura')) {
            const [, key] = name.split('.'); 
            setForm(prevForm => ({
                ...prevForm,
                estructura: {
                    ...prevForm.estructura,
                    [key]: parseInt(value, 10)
                }
            }));
        } else {
            setForm({
                ...form,
                [name]: type === 'checkbox' ? checked : value
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrorMessage(''); 
        if (form.nombre.trim() === '' || form.contenido.trim() === '' || form.url.trim() === '' || form.descripcion.trim() === '') {
            setErrorMessage('Por favor completa todos los campos antes de enviar.');
            return;
        }
    
        const pageData = {
            ...form,
            estructura: {
                superior: form.estructura.superior,
                medio: form.estructura.medio,
                inferior: form.estructura.inferior
            }
        };
    
        if (form.id) {
            updatePage(form.id, pageData)
                .then(() => {
                    fetchPages();
                    setForm({ 
                        nombre: '', 
                        descripcion: '', 
                        contenido: '', 
                        estado: false, 
                        url: '', 
                        estructura: { superior: 1, medio: 1, inferior: 1 } 
                    });
                    setErrorMessage('Página actualizada exitosamente.');
                })
                .catch(error => {
                    console.error(error);
                    setErrorMessage('Error al actualizar la página.');
                });
        } else {
            createPage(pageData)
                .then((response) => {
                    fetchPages();
                    setForm({ 
                        nombre: '', 
                        descripcion: '', 
                        contenido: '', 
                        estado: false, 
                        url: '', 
                        estructura: { superior: 1, medio: 1, inferior: 1 } 
                    });
                    setPageUrl(`/page/${response.data.id}`); 
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
        setErrorMessage(''); 
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
                        name="descripcion"
                        placeholder="Descripción de la página"
                        value={form.descripcion}
                        onChange={handleChange}
                        className={styles.textarea}
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

                    {/* Sección para configurar la estructura de cuadrantes */}
                    <h3>Configurar Estructura de Cuadrantes</h3>
                    <div className={styles.formGroup}>
                        <label>Estructura Superior:</label>
                        <select name="estructura.superior" value={form.estructura.superior} onChange={handleChange} className={styles.select}>
                            <option value="1">1 Bloque</option>
                            <option value="2">2 Bloques</option>
                            <option value="3">3 Bloques</option>
                            <option value="4">4 Bloques</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Estructura Medio:</label>
                        <select name="estructura.medio" value={form.estructura.medio} onChange={handleChange} className={styles.select}>
                            <option value="1">1 Bloque</option>
                            <option value="2">2 Bloques</option>
                            <option value="3">3 Bloques</option>
                        </select>
                    </div>
                    <div className={styles.formGroup}>
                        <label>Estructura Inferior:</label>
                        <select name="estructura.inferior" value={form.estructura.inferior} onChange={handleChange} className={styles.select}>
                            <option value="1">1 Bloque</option>
                            <option value="2">2 Bloques</option>
                            <option value="3">3 Bloques</option>
                        </select>
                    </div>

                    <button type="submit" className={styles.button}>
                        {form.id ? 'Actualizar Página' : 'Agregar Página'}
                    </button>
                </form>

                {pageUrl && (
                    <p className={styles.successMessage}>
                        Página disponible en: <Link to={pageUrl}>{pageUrl}</Link>
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
                                        <button onClick={() => handleEdit(page)} className={styles.actionButton}>
                                            <FontAwesomeIcon icon={faEdit} />
                                        </button>
                                        <Link to={`/page/${page.id}`} className={styles.actionButton}>
                                            <FontAwesomeIcon icon={faEye} />
                                        </Link>
                                        <button onClick={() => handleDelete(page.id)} className={styles.actionButton}>
                                            <FontAwesomeIcon icon={faTrashAlt} />
                                        </button>
                                        
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

                {/* Vista previa de la estructura */}
                <h3>Vista Previa de Estructura</h3>
                <div className={styles.pagePreview}>
                    <div className={styles.previewSection}>
                        <h4>Superior ({form.estructura.superior} Bloques)</h4>
                        <div className={styles.quadrants}>
                            {[...Array(form.estructura.superior)].map((_, index) => (
                                <div key={index} className={styles.quadrant}>
                                    Bloque {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.previewSection}>
                        <h4>Medio ({form.estructura.medio} Bloques)</h4>
                        <div className={styles.quadrants}>
                            {[...Array(form.estructura.medio)].map((_, index) => (
                                <div key={index} className={styles.quadrant}>
                                    Bloque {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                    <div className={styles.previewSection}>
                        <h4>Inferior ({form.estructura.inferior} Bloques)</h4>
                        <div className={styles.quadrants}>
                            {[...Array(form.estructura.inferior)].map((_, index) => (
                                <div key={index} className={styles.quadrant}>
                                    Bloque {index + 1}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </Layout>
    );
};

export default ManagePages;
