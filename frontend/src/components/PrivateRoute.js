import React, { useContext } from 'react';
import { Route, Redirect } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const PrivateRoute = ({ component: Component, roles, ...rest }) => {
    const { user } = useContext(AuthContext);
    return (
        <Route
            {...rest}
            render={props => {
                if (!user) {
                    return <Redirect to="/login" />;
                }
                if (roles && !roles.includes(user.role)) {
                    return <Redirect to="/" />;
                }
                return <Component {...props} />;
            }}
        />
    );
};

export default PrivateRoute;
