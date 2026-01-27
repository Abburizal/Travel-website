import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTranslation } from 'react-i18next';
import LanguageSwitcher from '../LanguageSwitcher';

export default function Navbar() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();
    const { t } = useTranslation();

    const handleLogout = async () => {
        await logout();
        navigate('/login');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="container mx-auto px-4 py-4">
                <div className="flex justify-between items-center">
                    <Link to="/" className="flex items-center space-x-3">
                        <img 
                            src="/images/flymora-logo.png" 
                            alt="Flymora Tours and Travels" 
                            className="h-16 md:h-20 w-auto"
                        />
                    </Link>
                    
                    <div className="hidden md:flex space-x-6 items-center">
                        <Link to="/" className="text-gray-700 hover:text-blue-600">{t('nav.home')}</Link>
                        <Link to="/tours" className="text-gray-700 hover:text-blue-600">{t('nav.tours')}</Link>
                        
                        {user ? (
                            <>
                                <Link to="/dashboard" className="text-gray-700 hover:text-blue-600">
                                    {t('nav.dashboard')}
                                </Link>
                                <Link to="/wishlist" className="text-gray-700 hover:text-blue-600 flex items-center gap-1">
                                    <svg 
                                        xmlns="http://www.w3.org/2000/svg" 
                                        fill="none" 
                                        viewBox="0 0 24 24" 
                                        strokeWidth={1.5} 
                                        stroke="currentColor" 
                                        className="w-5 h-5"
                                    >
                                        <path 
                                            strokeLinecap="round" 
                                            strokeLinejoin="round" 
                                            d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
                                        />
                                    </svg>
                                    {t('nav.wishlist')}
                                </Link>
                                
                                {/* Language Switcher */}
                                <LanguageSwitcher />
                                
                                <span className="text-gray-600">Hi, {user.name}</span>
                                <button
                                    onClick={handleLogout}
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    {t('nav.logout')}
                                </button>
                            </>
                        ) : (
                            <>
                                {/* Language Switcher */}
                                <LanguageSwitcher />
                                
                                <Link
                                    to="/login"
                                    className="text-gray-700 hover:text-blue-600"
                                >
                                    {t('nav.login')}
                                </Link>
                                <Link
                                    to="/register"
                                    className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
                                >
                                    {t('nav.register')}
                                </Link>
                            </>
                        )}
                    </div>

                    {/* Mobile menu button - simplified for now */}
                    <button 
                        className="md:hidden text-gray-700"
                        aria-label="Open navigation menu"
                    >
                        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                        </svg>
                    </button>
                </div>
            </div>
        </nav>
    );
}
