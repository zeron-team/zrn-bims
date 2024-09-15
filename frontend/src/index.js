// src/index.js

import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App';

const container = document.getElementById('root');
const root = createRoot(container); // Cambiamos ReactDOM.render por createRoot

root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);