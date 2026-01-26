import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';
import ImageGallery from '../components/ImageGallery';
import SocialShare from '../components/SocialShare';

export default function TourDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviewStats, setReviewStats] = useState(null);

    useEffect(() => {
        fetchTourDetail();
        fetchReviewStats();
    }, [id]);

    // Update meta tags when tour data is loaded
    useEffect(() => {
        if (tour) {
            updateMetaTags();
        }
    }, [tour]);

    const updateMetaTags = () => {
        const url = window.location.href;
        const title = `${tour.name} - Flymora Tours`;
        const description = tour.description || 'Book your dream tour with Flymora Tours';
        const image = tour.image_url || '/images/default-tour.jpg';

        // Update document title
        document.title = title;

        // Update or create meta tags
        updateMetaTag('property', 'og:title', title);
        updateMetaTag('property', 'og:description', description);
        updateMetaTag('property', 'og:image', image);
        updateMetaTag('property', 'og:url', url);
        updateMetaTag('property', 'og:type', 'website');

        updateMetaTag('name', 'twitter:card', 'summary_large_image');
        updateMetaTag('name', 'twitter:title', title);
        updateMetaTag('name', 'twitter:description', description);
        updateMetaTag('name', 'twitter:image', image);

        updateMetaTag('name', 'description', description);
    };

    const updateMetaTag = (attr, key, content) => {
        let element = document.querySelector(`meta[${attr}="${key}"]`);
        if (!element) {
            element = document.createElement('meta');
            element.setAttribute(attr, key);
            document.head.appendChild(element);
        }
        element.setAttribute('content', content);
    };

    const fetchTourDetail = async () => {
        try {
            const response = await api.get(`/tours/${id}`);
            setTour(response.data);
        } catch (err) {
            setError('Failed to load tour details');
        } finally {
            setLoading(false);
        }
    };

    const fetchReviewStats = async () => {
        try {
            const response = await api.get(`/tours/${id}/reviews?per_page=1`);
            if (response.data.success) {
                setReviewStats(response.data.stats);
            }
        } catch (err) {
            console.log('Could not load review stats');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    const handleBookNow = () => {
        if (!user) {
            navigate('/login');
        } else {
            navigate(`/booking/${id}`);
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
    }

    if (error || !tour) {
        return <div className="container mx-auto px-4 py-16 text-center text-red-600">{error}</div>;
    }

    const availableSeats = tour.max_participants - tour.booked_participants;

    return (
        <div className="container mx-auto px-4 py-8">
            <Link to="/tours" className="text-blue-600 hover:underline mb-4 inline-block">
                ← Back to Tours
            </Link>
            
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
                {/* Hero Image or Placeholder */}
                <div className="h-96 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    {tour.image_url ? (
                        <img 
                            src={tour.image_url} 
                            alt={tour.name}
                            className="w-full h-full object-cover"
                        />
                    ) : (
                        <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                    )}
                </div>
                
                <div className="p-8">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between mb-6">
                        <div className="flex-1">
                            <h1 className="text-4xl font-bold mb-4">{tour.name}</h1>
                            
                            {/* Rating Section */}
                            {reviewStats && reviewStats.total_reviews > 0 && (
                                <div className="flex items-center gap-4 mb-4">
                                    <StarRating rating={reviewStats.average_rating} />
                                    <span className="text-2xl font-bold text-gray-800">
                                        {reviewStats.average_rating.toFixed(1)}
                                    </span>
                                    <span className="text-gray-600">
                                        ({reviewStats.total_reviews} {reviewStats.total_reviews === 1 ? 'review' : 'reviews'})
                                    </span>
                                </div>
                            )}
                        </div>
                        
                        {/* Download Itinerary Button - Prominent Position */}
                        <div className="mt-4 lg:mt-0 lg:ml-6">
                            <a
                                href={`/api/tours/${tour.id}/itinerary/download`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-green-600 to-green-700 text-white rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg transform hover:-translate-y-0.5"
                            >
                                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                </svg>
                                <div className="text-left">
                                    <div className="text-sm font-normal opacity-90">Download</div>
                                    <div className="text-base font-bold">Full Itinerary PDF</div>
                                </div>
                            </a>
                        </div>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 mb-6 text-gray-600 pb-6 border-b">
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            {tour.destination}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            {tour.duration} days
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {availableSeats} seats available
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">Description</h2>
                        <p className="text-gray-700 leading-relaxed">{tour.description}</p>
                    </div>

                    {/* Image Gallery Section */}
                    {tour.gallery_images && tour.gallery_images.length > 0 && (
                        <div className="mb-8">
                            <ImageGallery images={tour.gallery_images} tourName={tour.name} />
                        </div>
                    )}
                    
                    <div className="border-t pt-6 flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-center sm:text-left">
                            <span className="text-gray-600 block mb-1">Price per person</span>
                            <div className="text-4xl font-bold text-blue-600">
                                {formatCurrency(tour.price)}
                            </div>
                        </div>
                        
                        <button
                            onClick={handleBookNow}
                            disabled={availableSeats === 0}
                            className="w-full sm:w-auto bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                        >
                            {availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                        </button>
                    </div>
                </div>
            </div>

            {/* Social Share Section */}
            <div className="mt-8">
                <SocialShare 
                    url={window.location.href}
                    title={tour.name}
                    description={tour.description}
                    imageUrl={tour.image_url}
                />
            </div>

            {/* Reviews Section */}
            <div className="mt-8 bg-white rounded-lg shadow-md p-8">
                <h2 className="text-2xl font-bold mb-6">Customer Reviews</h2>
                <ReviewList tourId={id} />
            </div>
        </div>
    );
}
