import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import LoginPage from './pages/LoginPage';
import Dashboard from './pages/Dashboard';
import Page1 from './pages/Page1';
import Page2 from './pages/Page2';
import Admin from './pages/Admin';
import PrivateRoute from './components/PrivateRoute';
import { AuthProvider } from './context/AuthContext';

function App() {
    return (
        <AuthProvider>
            <Router>
                <Switch>
                    <Route exact path="/" component={LandingPage} />
                    <Route path="/login" component={LoginPage} />
                    <PrivateRoute path="/dashboard" component={Dashboard} />
                    <PrivateRoute path="/page1" component={Page1} />
                    <PrivateRoute path="/page2" component={Page2} />
                    <PrivateRoute path="/admin" component={Admin} roles={['admin']} />
                </Switch>
            </Router>
        </AuthProvider>
    );
}

export default App;
