import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Pages
import Home from './pages/Home';
import Tours from './pages/Tours';
import TourDetail from './pages/TourDetail';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Booking from './pages/Booking';
import PaymentSimulator from './pages/PaymentSimulator';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
    const { user, loading } = useAuth();
    
    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }
    
    return user ? children : <Navigate to="/login" />;
};

function App() {
    return (
        <Routes>
            <Route path="/" element={<Layout />}>
                <Route index element={<Home />} />
                <Route path="tours" element={<Tours />} />
                <Route path="tours/:id" element={<TourDetail />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Protected Routes */}
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="booking/:tourId"
                    element={
                        <ProtectedRoute>
                            <Booking />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="payment/:snapToken"
                    element={<PaymentSimulator />}
                />
            </Route>
        </Routes>
    );
}

export default App;
