import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null); // Estado del usuario autenticado

    const login = (username, password) => {
        // Simulación de autenticación (esto debería ser una API)
        return new Promise((resolve, reject) => {
            if (username === 'admin' && password === 'password') {
                setUser({ username, role: 'admin' });
                resolve();
            } else if (username === 'viewer' && password === 'password') {
                setUser({ username, role: 'viewer' });
                resolve();
            } else {
                reject('Credenciales inválidas');
            }
        });
    };

    const logout = () => {
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
