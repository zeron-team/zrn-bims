//frontend/src/components/ManagePages.js

import React, { useState, useEffect } from 'react';
import { getPages, createPage, updatePage, deletePage } from '../services/pageService';

const ManagePages = () => {
    const [pages, setPages] = useState([]);
    const [form, setForm] = useState({
        title: '',
        description: '',
    });

    useEffect(() => {
        fetchPages();
    }, []);

    const fetchPages = () => {
        getPages()
            .then(response => setPages(response.data))
            .catch(error => console.error(error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.id) {
            updatePage(form.id, form)
                .then(fetchPages)
                .catch(error => console.error(error));
        } else {
            createPage(form)
                .then(fetchPages)
                .catch(error => console.error(error));
        }
        setForm({ title: '', description: '' });
    };

    const handleEdit = (page) => {
        setForm(page);
    };

    const handleDelete = (id) => {
        deletePage(id)
            .then(fetchPages)
            .catch(error => console.error(error));
    };

    return (
        <div>
            <h2>Administrar Páginas de Dashboards</h2>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    name="title"
                    placeholder="Título"
                    value={form.title}
                    onChange={handleChange}
                    required
                />
                <textarea
                    name="description"
                    placeholder="Descripción"
                    value={form.description}
                    onChange={handleChange}
                    required
                ></textarea>
                <button type="submit">{form.id ? 'Actualizar Página' : 'Agregar Página'}</button>
            </form>
            <h3>Lista de Páginas</h3>
            <table>
                <thead>
                    <tr>
                        <th>Título</th>
                        <th>Descripción</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {pages.map(page => (
                        <tr key={page.id}>
                            <td>{page.title}</td>
                            <td>{page.description}</td>
                            <td>
                                <button onClick={() => handleEdit(page)}>Editar</button>
                                <button onClick={() => handleDelete(page.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default ManagePages;
