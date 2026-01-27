import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import { useAnalytics } from '../hooks/useAnalytics';

const WishlistButton = ({ tourId, tourName, size = 'md', showText = false }) => {
    const { user } = useAuth();
    const { trackWishlistAdd, trackWishlistRemove } = useAnalytics();
    const [inWishlist, setInWishlist] = useState(false);
    const [loading, setLoading] = useState(false);

    // Size variants
    const sizeClasses = {
        sm: 'text-lg p-1',
        md: 'text-2xl p-2',
        lg: 'text-3xl p-3'
    };

    useEffect(() => {
        if (user) {
            checkWishlistStatus();
        }
    }, [user, tourId]);

    const checkWishlistStatus = async () => {
        try {
            const response = await api.get(`/wishlist/check/${tourId}`);
            setInWishlist(response.data.in_wishlist);
        } catch (error) {
            console.error('Error checking wishlist:', error);
        }
    };

    const toggleWishlist = async (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!user) {
            alert('Please login to add tours to wishlist');
            window.location.href = '/login';
            return;
        }

        setLoading(true);

        try {
            if (inWishlist) {
                // Remove from wishlist
                console.log('Removing tour from wishlist:', tourId);
                const response = await api.delete(`/wishlist/${tourId}`);
                console.log('Remove response:', response.data);
                setInWishlist(false);
                trackWishlistRemove(tourId, tourName || `Tour ${tourId}`);
                alert('Tour removed from wishlist! ❤️');
            } else {
                // Add to wishlist
                console.log('Adding tour to wishlist:', tourId);
                const response = await api.post('/wishlist', { tour_id: tourId });
                console.log('Add response:', response.data);
                setInWishlist(true);
                trackWishlistAdd(tourId, tourName || `Tour ${tourId}`);
                alert('Tour added to wishlist! 💖');
            }
        } catch (error) {
            console.error('Error toggling wishlist:', error);
            console.error('Error response:', error.response?.data);
            alert(error.response?.data?.message || 'Failed to update wishlist');
            // Revert state on error
            setInWishlist(!inWishlist);
        } finally {
            setLoading(false);
        }
    };

    // Always show button, but with different behavior
    return (
        <button
            onClick={toggleWishlist}
            disabled={loading}
            className={`
                ${sizeClasses[size]}
                rounded-full
                transition-all
                duration-200
                ${inWishlist 
                    ? 'text-red-500 hover:text-red-600' 
                    : 'text-gray-400 hover:text-red-500'
                }
                ${loading ? 'opacity-50 cursor-not-allowed' : 'hover:scale-110'}
                focus:outline-none
                focus:ring-2
                focus:ring-red-500
                focus:ring-offset-2
            `}
            aria-label={
                !user 
                    ? 'Login to add to wishlist'
                    : inWishlist 
                        ? 'Remove from wishlist' 
                        : 'Add to wishlist'
            }
            title={
                !user 
                    ? 'Login to add to wishlist'
                    : inWishlist 
                        ? 'Remove from wishlist' 
                        : 'Add to wishlist'
            }
        >
            {inWishlist ? (
                // Filled heart
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    viewBox="0 0 24 24" 
                    fill="currentColor" 
                    className="w-6 h-6"
                >
                    <path d="m11.645 20.91-.007-.003-.022-.012a15.247 15.247 0 0 1-.383-.218 25.18 25.18 0 0 1-4.244-3.17C4.688 15.36 2.25 12.174 2.25 8.25 2.25 5.322 4.714 3 7.688 3A5.5 5.5 0 0 1 12 5.052 5.5 5.5 0 0 1 16.313 3c2.973 0 5.437 2.322 5.437 5.25 0 3.925-2.438 7.111-4.739 9.256a25.175 25.175 0 0 1-4.244 3.17 15.247 15.247 0 0 1-.383.219l-.022.012-.007.004-.003.001a.752.752 0 0 1-.704 0l-.003-.001Z" />
                </svg>
            ) : (
                // Outline heart
                <svg 
                    xmlns="http://www.w3.org/2000/svg" 
                    fill="none" 
                    viewBox="0 0 24 24" 
                    strokeWidth={1.5} 
                    stroke="currentColor" 
                    className="w-6 h-6"
                >
                    <path 
                        strokeLinecap="round" 
                        strokeLinejoin="round" 
                        d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12Z" 
                    />
                </svg>
            )}
            {showText && (
                <span className="ml-2">
                    {inWishlist ? 'Saved' : 'Save'}
                </span>
            )}
        </button>
    );
};

export default WishlistButton;
