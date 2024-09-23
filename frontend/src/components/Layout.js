// frontend/src/components/Layout.js

import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getPages } from '../services/pageService';
import styles from '../css/Layout.module.css';

const Layout = ({ children }) => {
    const { user } = useContext(AuthContext);
    const [pages, setPages] = useState([]);
    const [showSubMenu, setShowSubMenu] = useState(false);
    const [showAdminMenu, setShowAdminMenu] = useState(false);

    useEffect(() => {
        getPages()
            .then(response => setPages(response.data))
            .catch(error => console.error("Error al cargar las páginas dinámicas:", error));
    }, []);

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    const toggleAdminMenu = () => {
        setShowAdminMenu(!showAdminMenu);
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2 className={styles.menuTitle}>Menú</h2>
                <nav className={styles.navMenu}>
                    <ul>
                        <Link to="/dashboard" className={styles.navLink}>
                            <i className="fas fa-home"></i> Inicio
                        </Link>

                        <li className={styles.folder} onClick={toggleSubMenu}>
                            <div className={styles.folderTitle}>
                                <i className="fas fa-folder"></i> Páginas Nuevas
                            </div>
                            <i className={`${styles.chevron} ${showSubMenu ? 'fas fa-chevron-down' : 'fas fa-chevron-right'}`}></i>
                        </li>
                        <ul className={`${styles.subMenu} ${showSubMenu ? styles.showSubMenu : ''}`}>
                            {pages.length > 0 ? (
                                pages.map(page => (
                                    <li key={page.id}>
                                        <Link to={`/page/${page.id}`} className={styles.subNavLink}>
                                            <i className="fas fa-file-alt"></i> {page.nombre}
                                        </Link>
                                    </li>
                                ))
                            ) : (
                                <li className={styles.noPagesMessage}>No hay páginas creadas</li>
                            )}
                        </ul>

                        {user?.role === 'admin' && (
                            <>
                                <li className={styles.folder} onClick={toggleAdminMenu}>
                                    <div className={styles.folderTitle}>
                                        <i className="fas fa-user-shield"></i> Administración
                                    </div>
                                    <i className={`${styles.chevron} ${showAdminMenu ? 'fas fa-chevron-down' : 'fas fa-chevron-right'}`}></i>
                                </li>
                                <ul className={`${styles.subMenu} ${showAdminMenu ? styles.showSubMenu : ''}`}>
                                    <Link to="/manage-pages" className={styles.navLink}>
                                        <i className="fas fa-folder-open"></i> Gestionar Páginas
                                    </Link>
                                    <Link to="/manage-db" className={styles.navLink}>
                                        <i className="fas fa-database"></i> Gestión de DB
                                    </Link>
                                    <Link to="/manage-queries" className={styles.navLink}>
                                        <i className="fas fa-code"></i> Gestionar Consultas SQL
                                    </Link>
                                    <Link to="/manage-charts" className={styles.navLink}>
                                        <i className="fas fa-chart-bar"></i> Gestionar Gráficos
                                    </Link>
                                    <Link to="/manage-users" className={styles.navLink}>
                                        <i className="fas fa-users"></i> Gestión de Usuarios
                                    </Link>
                                </ul>
                            </>
                        )}

                        <Link to="/login" className={styles.navLink}>
                            <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                        </Link>
                    </ul>
                </nav>
            </aside>
            <main className={styles.mainContent}>
                {children}
            </main>
        </div>
    );
};

export default Layout;
