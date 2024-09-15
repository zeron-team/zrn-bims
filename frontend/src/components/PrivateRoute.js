import React, { useContext } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ roles }) => {
    const { user } = useContext(AuthContext);

    // Si el usuario no está autenticado, redirigir a la página de login
    if (!user) {
        return <Navigate to="/login" />;
    }

    // Si el usuario no tiene los roles correctos, redirigir a la página principal
    if (roles && !roles.includes(user.role)) {
        return <Navigate to="/" />;
    }

    return <Outlet />;
};

export default PrivateRoute;
