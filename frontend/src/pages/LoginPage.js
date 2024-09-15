//frontend/src/pages/LoginPage.js

import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import styles from '../css/LoginPage.module.css'; // Importar los estilos

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
                navigate('/dashboard');
            })
            .catch(error => {
                console.error(error);
                alert('Credenciales inválidas');
            });
    };

    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1>BIMS</h1>
            </header>

            <main className={styles.main}>
                <div className={styles.loginContainer}>
                    <h2>Iniciar Sesión</h2>
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
            </main>

            <footer className={styles.footer}>
                <p>&copy; 2024 ZERON - Bims. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default LoginPage;
