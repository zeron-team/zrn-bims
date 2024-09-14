import React, { useState, useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { login as loginService } from '../services/authService';
import { useHistory } from 'react-router-dom';

const LoginPage = () => {
    const [form, setForm] = useState({ username: '', password: '' });
    const { login } = useContext(AuthContext);
    const history = useHistory();

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        loginService(form.username, form.password)
            .then(response => {
                login(response.data.access_token);
                history.push('/dashboard');
            })
            .catch(error => {
                console.error(error);
                alert('Credenciales inválidas');
            });
    };

    return (
        <div className="container">
            <h2>Iniciar Sesión</h2>
            <form onSubmit={handleSubmit}>
                <input type="text" name="username" placeholder="Usuario" value={form.username} onChange={handleChange} required />
                <input type="password" name="password" placeholder="Contraseña" value={form.password} onChange={handleChange} required />
                <button type="submit">Login</button>
            </form>
        </div>
    );
};

export default LoginPage;
