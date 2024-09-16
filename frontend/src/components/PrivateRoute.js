//frontend/src/components/PrivateRoute.js

import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ children, roles }) => {
    const { user } = useContext(AuthContext);

    if (!user) {
        // Si el usuario no está autenticado, redirigir al login
        return <Navigate to="/login" />;
    }

    if (roles && !roles.includes(user.role)) {
        // Si el usuario no tiene el rol correcto, redirigir al dashboard
        return <Navigate to="/dashboard" />;
    }

    // Si está autenticado y tiene el rol correcto, renderizar el componente
    return children;
};

export default PrivateRoute;
