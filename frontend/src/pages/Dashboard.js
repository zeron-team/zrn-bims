import React from 'react';
import styles from '../css/Dashboard.module.css'; // Importa los estilos

const Dashboard = () => {
    return (
        <div className={styles.pageContainer}>
            <header className={styles.header}>
                <h1>Panel de Control</h1>
                <nav className={styles.navbar}>
                    <a href="/dashboard" className={styles.navLink}>Inicio</a>
                    <a href="/page1" className={styles.navLink}>Página 1</a>
                    <a href="/page2" className={styles.navLink}>Página 2</a>
                    <a href="/login" className={styles.navLink}>Cerrar Sesión</a>
                </nav>
            </header>

            <main className={styles.main}>
                <h2>Bienvenido al Panel de Control</h2>
                <p>Aquí puedes gestionar diferentes opciones y visualizaciones.</p>
                {/* Puedes agregar más contenido aquí */}
            </main>

            <footer className={styles.footer}>
                <p>&copy; 2024 ZERON - BIMS. Todos los derechos reservados.</p>
            </footer>
        </div>
    );
};

export default Dashboard;
