import React, { useState, useEffect, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { createDBConnection, getDBConnections, deleteDBConnection } from '../services/adminService';

const Admin = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem('token');

    const [connections, setConnections] = useState([]);
    const [form, setForm] = useState({
        name: '',
        db_type: 'mysql',
        host: '',
        port: '',
        username: '',
        password: '',
        database: ''
    });

    useEffect(() => {
        fetchConnections();
    }, []);

    const fetchConnections = () => {
        getDBConnections(token)
            .then(response => setConnections(response.data))
            .catch(error => console.error(error));
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        createDBConnection(form, token)
            .then(() => {
                setForm({
                    name: '',
                    db_type: 'mysql',
                    host: '',
                    port: '',
                    username: '',
                    password: '',
                    database: ''
                });
                fetchConnections();
            })
            .catch(error => console.error(error));
    };

    const handleDelete = (id) => {
        deleteDBConnection(id, token)
            .then(() => fetchConnections())
            .catch(error => console.error(error));
    };

    return (
        <div className="container">
            <h2>Administración de Conexiones de Base de Datos</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="name" placeholder="Nombre" value={form.name} onChange={handleChange} required />
                <select name="db_type" value={form.db_type} onChange={handleChange}>
                    <option value="mysql">MySQL</option>
                    <option value="postgresql">PostgreSQL</option>
                    <option value="sqlserver">SQL Server</option>
                    <option value="mongodb">MongoDB</option>
                </select>
                <input type="text" name="host" placeholder="Host" value={form.host} onChange={handleChange} required />
                <input type="number" name="port" placeholder="Puerto" value={form.port} onChange={handleChange} required />
                <input type="text" name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
                <input type="text" name="database" placeholder="Base de Datos" value={form.database} onChange={handleChange} required />
                <button type="submit">Agregar Conexión</button>
            </form>
            <h3>Conexiones Existentes</h3>
            <table>
                <thead>
                    <tr>
                        <th>Nombre</th>
                        <th>Tipo de DB</th>
                        <th>Host</th>
                        <th>Puerto</th>
                        <th>Usuario</th>
                        <th>Base de Datos</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    {connections.map(conn => (
                        <tr key={conn.id}>
                            <td>{conn.name}</td>
                            <td>{conn.db_type}</td>
                            <td>{conn.host}</td>
                            <td>{conn.port}</td>
                            <td>{conn.username}</td>
                            <td>{conn.database}</td>
                            <td>
                                <button onClick={() => handleDelete(conn.id)}>Eliminar</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default Admin;
