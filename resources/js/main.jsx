import './bootstrap';
import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import App from './App';
import { AuthProvider } from './context/AuthContext';
import { CompareProvider } from './context/CompareContext';

ReactDOM.createRoot(document.getElementById('app')).render(
    <React.StrictMode>
        <HelmetProvider>
            <BrowserRouter>
                <AuthProvider>
                    <CompareProvider>
                        <App />
                    </CompareProvider>
                </AuthProvider>
            </BrowserRouter>
        </HelmetProvider>
    </React.StrictMode>
);
