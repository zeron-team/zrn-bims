// frontend/src/pages/ManageUsers.js

import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../services/userService';
import Layout from '../components/Layout';  // Asegúrate de importar tu componente Layout
import styles from '../css/ManageUsers.module.css';  // Archivo de estilos si es necesario

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [form, setForm] = useState({
        username: '',
        password: '',
        role: 'viewer',
    });

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = () => {
        getUsers()
            .then(response => setUsers(response.data))
            .catch(error => console.error(error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (form.id) {
            updateUser(form.id, form)
                .then(() => {
                    setForm({ username: '', password: '', role: 'viewer' });
                    fetchUsers();
                })
                .catch(error => console.error(error));
        } else {
            createUser(form)
                .then(() => {
                    setForm({ username: '', password: '', role: 'viewer' });
                    fetchUsers();
                })
                .catch(error => console.error(error));
        }
    };

    const handleEdit = (user) => {
        setForm(user);
    };

    const handleDelete = (id) => {
        deleteUser(id)
            .then(fetchUsers)
            .catch(error => console.error(error));
    };

    return (
        <Layout> {/* Asegúrate de envolver todo en Layout para la consistencia visual */}
            <div className={styles.container}>
                <h2>Administrar Usuarios</h2>

                {/* Formulario para agregar o editar usuarios */}
                <form onSubmit={handleSubmit} className={styles.form}>
                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de usuario"
                        value={form.username}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <input
                        type="password"
                        name="password"
                        placeholder="Contraseña"
                        value={form.password}
                        onChange={handleChange}
                        className={styles.input}
                        required
                    />
                    <select
                        name="role"
                        value={form.role}
                        onChange={handleChange}
                        className={styles.select}
                    >
                        <option value="admin">Administrador</option>
                        <option value="viewer">Visualizador</option>
                    </select>
                    <button type="submit" className={styles.button}>
                        {form.id ? 'Actualizar Usuario' : 'Agregar Usuario'}
                    </button>
                </form>

                {/* Lista de usuarios */}
                <h3>Lista de Usuarios</h3>
                <table className={styles.table}>
                    <thead>
                        <tr>
                            <th>Usuario</th>
                            <th>Rol</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.length > 0 ? (
                            users.map(user => (
                                <tr key={user.id}> {/* Corregido: la clave única es user.id */}
                                    <td>{user.username}</td>
                                    <td>{user.role}</td>
                                    <td>
                                        <button
                                            onClick={() => handleEdit(user)}
                                            className={styles.actionButton}
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(user.id)}
                                            className={styles.actionButton}
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="3">No hay usuarios disponibles</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </Layout>
    );
};

export default ManageUsers;
