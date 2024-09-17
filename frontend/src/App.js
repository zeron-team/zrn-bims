// frontend/src/App.js

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import AdminPage from './pages/AdminPage';
import ManageUsers from './pages/ManageUsers';
import ManagePages from './pages/ManagePages';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/PrivateRoute';
import PageView from './components/PageView'; // Componente para ver una página específica

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
                    <Route path="/page1" element={<PrivateRoute><Page1 /></PrivateRoute>} />
                    <Route path="/page2" element={<PrivateRoute><Page2 /></PrivateRoute>} />

                    {/* Ruta para ver una página específica por ID */}
                    <Route path="/page/:id" element={<PageView />} />
                </Routes>
            </Router>
        </AuthProvider>
    );
}

export default App;
