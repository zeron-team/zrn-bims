//frontend/src/pages/Dashboard.js 

import React, { useContext } from 'react';
import Layout from '../components/Layout'; // styles eliminado
import { AuthContext } from '../context/AuthContext';

const Dashboard = () => {
    const { user } = useContext(AuthContext);

    return (
        <Layout>
            <h2>Bienvenido al Dashboard</h2>
            <p>{`Bienvenido, ${user?.username}`}</p>
            <p>Aquí puedes gestionar diferentes opciones y visualizaciones.</p>
        </Layout>
    );
};

export default Dashboard;
