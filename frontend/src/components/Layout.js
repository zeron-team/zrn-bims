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

    useEffect(() => {
        getPages()
            .then(response => setPages(response.data))
            .catch(error => console.error("Error al cargar las páginas dinámicas:", error));
    }, []);

    const toggleSubMenu = () => {
        setShowSubMenu(!showSubMenu);
    };

    return (
        <div className={styles.container}>
            <aside className={styles.sidebar}>
                <h2 className={styles.menuTitle}>Menú</h2>
                <nav className={styles.navMenu}>
                    <ul>
                        <li>
                            <Link to="/dashboard" className={styles.navLink}>
                                <i className="fas fa-home"></i> Inicio
                            </Link>
                        </li>
                        <li>
                            <Link to="/page1" className={styles.navLink}>
                                <i className="fas fa-file-alt"></i> Página 1
                            </Link>
                        </li>
                        <li>
                            <Link to="/page2" className={styles.navLink}>
                                <i className="fas fa-file-alt"></i> Página 2
                            </Link>
                        </li>

                        {user?.role === 'admin' && (
                            <>
                                <li>
                                    <Link to="/admin" className={styles.navLink}>
                                        <i className="fas fa-user-shield"></i> Administración
                                    </Link>
                                </li>
                                <li>
                                    <Link to="/manage-pages" className={styles.navLink}>
                                        <i className="fas fa-folder-open"></i> Gestionar Páginas
                                    </Link>
                                </li>

                                {/* Nuevo enlace para gestión de DB */}
                                <li>
                                    <Link to="/manage-db" className={styles.navLink}>
                                        <i className="fas fa-database"></i> Gestión de DB
                                    </Link>
                                </li>

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
                            </>
                        )}

                        <li>
                            <Link to="/login" className={styles.navLink}>
                                <i className="fas fa-sign-out-alt"></i> Cerrar Sesión
                            </Link>
                        </li>
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
