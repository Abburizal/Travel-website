import React, { lazy, Suspense } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Layout from './components/layout/Layout';

// Eager load critical pages (above the fold)
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';

// Lazy load non-critical pages (code splitting)
const Tours = lazy(() => import('./pages/Tours'));
const TourDetail = lazy(() => import('./pages/TourDetail'));
const Dashboard = lazy(() => import('./pages/Dashboard'));
const Booking = lazy(() => import('./pages/Booking'));
const PaymentSimulator = lazy(() => import('./pages/PaymentSimulator'));
const FAQ = lazy(() => import('./pages/FAQ'));
const Contact = lazy(() => import('./pages/Contact'));
const TermsOfService = lazy(() => import('./pages/TermsOfService'));
const PrivacyPolicy = lazy(() => import('./pages/PrivacyPolicy'));
const Wishlist = lazy(() => import('./pages/Wishlist'));
const ComparePage = lazy(() => import('./pages/ComparePage'));

// Loading component
const PageLoader = () => (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
            <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mx-auto mb-4"></div>
            <p className="text-gray-600 text-lg">Loading...</p>
        </div>
    </div>
);

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
                {/* Eager loaded pages (no Suspense needed) */}
                <Route index element={<Home />} />
                <Route path="login" element={<Login />} />
                <Route path="register" element={<Register />} />
                
                {/* Lazy loaded pages (wrapped in Suspense) */}
                <Route 
                    path="tours" 
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <Tours />
                        </Suspense>
                    } 
                />
                <Route 
                    path="tours/:id" 
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <TourDetail />
                        </Suspense>
                    } 
                />
                <Route 
                    path="faq" 
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <FAQ />
                        </Suspense>
                    } 
                />
                <Route 
                    path="contact" 
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <Contact />
                        </Suspense>
                    } 
                />
                <Route 
                    path="terms-of-service" 
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <TermsOfService />
                        </Suspense>
                    } 
                />
                <Route 
                    path="privacy-policy" 
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <PrivacyPolicy />
                        </Suspense>
                    } 
                />
                
                {/* Protected Routes with Suspense */}
                <Route
                    path="dashboard"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Dashboard />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="wishlist"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Wishlist />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route 
                    path="compare" 
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <ComparePage />
                        </Suspense>
                    } 
                />
                <Route
                    path="booking/:tourId"
                    element={
                        <ProtectedRoute>
                            <Suspense fallback={<PageLoader />}>
                                <Booking />
                            </Suspense>
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="payment/:snapToken"
                    element={
                        <Suspense fallback={<PageLoader />}>
                            <PaymentSimulator />
                        </Suspense>
                    }
                />
            </Route>
        </Routes>
    );
}

export default App;
