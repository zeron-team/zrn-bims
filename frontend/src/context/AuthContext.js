//frontend/src/context/AuthContext.js

import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        // Al inicializar, obtenemos los datos del usuario de localStorage
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
    });

    const login = (username, password) => {
        return new Promise((resolve, reject) => {
            if (username === 'admin' && password === 'password') {
                const userData = { username, role: 'admin' };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData)); // Guardar en localStorage
                resolve();
            } else if (username === 'viewer' && password === 'password') {
                const userData = { username, role: 'viewer' };
                setUser(userData);
                localStorage.setItem('user', JSON.stringify(userData)); // Guardar en localStorage
                resolve();
            } else {
                reject('Credenciales inválidas');
            }
        });
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');  // Limpiar localStorage al cerrar sesión
    };

    useEffect(() => {
        // Si el usuario es null, eliminamos cualquier referencia en localStorage
        if (!user) {
            localStorage.removeItem('user');
        }
    }, [user]);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
