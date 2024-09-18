// frontend/src/context/AuthContext.js

import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            fetch('http://localhost:8000/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ username, password })
            })
            .then(response => {
                if (!response.ok) {
                    return reject('Credenciales inválidas');
                }
                return response.json(); // Procesar la respuesta como JSON
            })
            .then(data => {
                const userData = { username, role: 'admin', token: data.access_token };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData)); // Guardar el token en localStorage
                resolve();
            })
            .catch(reject);
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
