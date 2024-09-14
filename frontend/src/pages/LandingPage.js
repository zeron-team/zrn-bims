import React from 'react';
import { Link } from 'react-router-dom';

const LandingPage = () => {
    return (
        <div className="container">
            <h1>Bienvenido al Sistema de BI</h1>
            <Link to="/login">Iniciar Sesión</Link>
        </div>
    );
};

export default LandingPage;
