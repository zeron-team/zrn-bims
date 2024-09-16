// frontend/src/pages/LoginPage.js
import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginPage.module.css';

const LoginPage = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        login(form.username, form.password)
            .then(() => {
                navigate('/dashboard'); // Redirigir al Dashboard después de iniciar sesión
            })
            .catch(error => {
                console.error(error);
                alert('Credenciales inválidas'); // Asegúrate de que esto solo aparezca si el error es real
            });
    };

    return (
        <div className={styles.container}>
            <h2 className={styles.title}>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit} className={styles.form}>
                <input
                    type="text"
                    name="username"
                    placeholder="Usuario"
                    value={form.username}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <input
                    type="password"
                    name="password"
                    placeholder="Contraseña"
                    value={form.password}
                    onChange={handleChange}
                    required
                    className={styles.input}
                />
                <button type="submit" className={styles.button}>Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
