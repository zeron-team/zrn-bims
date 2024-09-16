//frontend/src/pages/AdminPage.js

import React from 'react';
import Layout from '../components/Layout';
import { Link } from 'react-router-dom';

const AdminPage = () => {
    return (
        <Layout>
            <h2>Panel de Administración</h2>
            <p>Bienvenido al área de administración. Elige una opción:</p>
            <ul>
                <li><Link to="/manage-users">Administrar Usuarios</Link></li>
                <li><Link to="/manage-pages">Administrar Páginas de Dashboards</Link></li>
            </ul>
        </Layout>
    );
};

export default AdminPage;
