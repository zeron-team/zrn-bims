// frontend/src/components/Layout.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { Link } from 'react-router-dom'; // Importar Link de react-router-dom
import styles from '../css/Layout.module.css';

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2>Menú</h2>
                <nav>
                    <Link to="/dashboard" className={styles.navLink}>Inicio</Link>
                    <Link to="/page1" className={styles.navLink}>Página 1</Link> {/* Usar Link aquí */}
                    <Link to="/page2" className={styles.navLink}>Página 2</Link>
                    
                    {user?.role === 'admin' && (
                        <Link to="/admin" className={styles.navLink}>Administración</Link>
                    )}

                    <Link to="/login" className={styles.navLink}>Cerrar Sesión</Link>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
