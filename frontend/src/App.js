// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import ManageUsers from './pages/ManageUsers';
import ManagePages from './pages/ManagePages';
import ManageDB from './pages/ManageDB'; // Importar la nueva página
import ManageQueries from './pages/ManageQueries'; // Asegúrate de importar esta página
import ManageCharts from './pages/ManageCharts'; // Asegúrate de importar esta página
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import DynamicPage from './pages/DynamicPage'; // Importar el componente para páginas dinámicas
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Navigate to="/login" />} />
                    <Route path="/login" element={<LoginPage />} />
                    <Route path="/dashboard" element={<PrivateRoute><Dashboard /></PrivateRoute>} />
                    <Route path="/admin" element={<PrivateRoute roles={['admin']}><AdminPage /></PrivateRoute>} />
                    <Route path="/manage-users" element={<PrivateRoute roles={['admin']}><ManageUsers /></PrivateRoute>} />
                    <Route path="/manage-pages" element={<PrivateRoute roles={['admin']}><ManagePages /></PrivateRoute>} />

                    {/* Nueva ruta para la gestión de DB */}
                    <Route path="/manage-db" element={<PrivateRoute roles={['admin']}><ManageDB /></PrivateRoute>} />

                    {/* Nueva ruta para la gestión de consultas SQL */}
                    <Route path="/manage-queries" element={<PrivateRoute roles={['admin']}><ManageQueries /></PrivateRoute>} /> {/* Asegúrate de incluir esta ruta */}

                    {/* Nueva ruta para la gestión de gráficos */}
                    <Route path="/manage-charts" element={<PrivateRoute roles={['admin']}><ManageCharts /></PrivateRoute>} /> {/* Agregamos la ruta para la gestión de gráficos */}

                    <Route path="/page1" element={<PrivateRoute><Page1 /></PrivateRoute>} />
                    <Route path="/page2" element={<PrivateRoute><Page2 /></PrivateRoute>} />

                    {/* Ruta dinámica para páginas nuevas */}
                    <Route path="/page/:id" element={<PrivateRoute><DynamicPage /></PrivateRoute>} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
