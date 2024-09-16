// frontend/src/components/Layout.js

import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import styles from '../css/Layout.module.css';

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2>Menú</h2>
                <nav>
                    <a href="/dashboard" className={styles.navLink}>Inicio</a>
                    <a href="/page1" className={styles.navLink}>Página 1</a>
                    <a href="/page2" className={styles.navLink}>Página 2</a>
                    
                    {user?.role === 'admin' && (
                        <a href="/admin" className={styles.navLink}>Administración</a>
                    )}

                    <a href="/login" className={styles.navLink}>Cerrar Sesión</a>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
