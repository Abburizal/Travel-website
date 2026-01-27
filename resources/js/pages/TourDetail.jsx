import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';
import ReviewList from '../components/ReviewList';
import StarRating from '../components/StarRating';
import ImageGallery from '../components/ImageGallery';
import SocialShare from '../components/SocialShare';
import WishlistButton from '../components/WishlistButton';
import CompareButton from '../components/CompareButton';
import SEO from '../components/SEO';
import { TourProductSchema, BreadcrumbSchema } from '../components/Schema';
import { useAnalytics } from '../hooks/useAnalytics';

export default function TourDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { trackTourView, trackBookingStart } = useAnalytics();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [reviewStats, setReviewStats] = useState(null);

    // DEBUG: Log component mount and ID
    useEffect(() => {
        console.log('🔍 TourDetail mounted with ID:', id);
        console.log('🔍 Current URL:', window.location.href);
    }, []);

    useEffect(() => {
        console.log('🔍 Fetching tour with ID:', id);
        if (id) {
            fetchTourDetail();
            fetchReviewStats();
        } else {
            console.error('❌ No tour ID provided!');
            setError('Tour ID is missing');
            setLoading(false);
        }
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
        console.log('🚀 fetchTourDetail called for ID:', id);
        try {
            const url = `/tours/${id}`;
            console.log('📡 Calling API:', url);
            const response = await api.get(url);
            console.log('✅ API Response received:', response.data);
            setTour(response.data);
            console.log('✅ Tour data set in state');
            
            // Track tour view
            trackTourView(response.data.id, response.data.name);
        } catch (err) {
            console.error('❌ Error fetching tour:', err);
            console.error('❌ Error response:', err.response?.data);
            console.error('❌ Error status:', err.response?.status);
            setError('Failed to load tour details');
        } finally {
            console.log('🏁 fetchTourDetail finished, setting loading to false');
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

    const formatDuration = (duration) => {
        // If duration already contains "Days", "Nights", "Day", "Night", return as is
        if (/days?|nights?/i.test(duration)) {
            return duration;
        }
        // Otherwise, it's just a number, add "Days"
        const days = parseInt(duration);
        if (isNaN(days)) return duration;
        
        // Calculate nights (days - 1)
        const nights = Math.max(0, days - 1);
        return `${days} Days ${nights} Nights`;
    };

    const formatPrice = (price) => {
        const numPrice = parseFloat(price);
        if (isNaN(numPrice)) return price;
        
        // Price is already in IDR from database
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(numPrice);
    };

    const handleBookNow = () => {
        if (!user) {
            navigate('/login');
        } else {
            // Track booking initiation
            trackBookingStart(tour.id, tour.name);
            navigate(`/booking/${id}`);
        }
    };

    if (loading) {
        console.log('⏳ TourDetail: Showing loading state');
        return (
            <div className="container mx-auto px-4 py-16">
                <div className="flex flex-col items-center justify-center">
                    <div className="animate-spin rounded-full h-16 w-16 border-b-4 border-blue-600 mb-4"></div>
                    <p className="text-gray-600 text-lg">Loading tour details...</p>
                    <p className="text-gray-400 text-sm mt-2">Tour ID: {id}</p>
                </div>
            </div>
        );
    }

    if (error || !tour) {
        console.log('❌ TourDetail: Showing error state', { error, tour });
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-red-600 text-xl mb-4">{error || 'Tour not found'}</div>
                <p className="text-gray-600 mb-4">Tour ID: {id}</p>
                <Link to="/tours" className="text-blue-600 hover:underline">
                    ← Back to Tours
                </Link>
            </div>
        );
    }

    console.log('✅ TourDetail: Rendering tour', tour);

    const availableSeats = tour.max_participants - tour.booked_participants;

    return (
        <div className="container mx-auto px-4 py-8">
            {/* Dynamic SEO & Schema Markup */}
            {tour && (
                <>
                    <SEO 
                        title={`${tour.name} - ${tour.destination}`}
                        description={`${tour.description.substring(0, 155)}... Book this ${tour.duration}-day tour starting from IDR ${tour.price.toLocaleString('id-ID')}.`}
                        keywords={`${tour.name}, ${tour.destination}, tour package, ${tour.category?.name || 'travel'}, vacation, holiday`}
                        image={tour.image_url || '/images/og-default.jpg'}
                        url={`/tours/${tour.id}`}
                        type="product"
                    />
                    <TourProductSchema tour={tour} />
                    <BreadcrumbSchema items={[
                        { name: 'Home', url: 'https://tripin.travel' },
                        { name: 'Tours', url: 'https://tripin.travel/tours' },
                        { name: tour.name, url: `https://tripin.travel/tours/${tour.id}` }
                    ]} />
                </>
            )}
            
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
                            <div className="flex items-start justify-between mb-4">
                                <h1 className="text-4xl font-bold flex-1">{tour.name}</h1>
                                {/* Action Buttons */}
                                <div className="ml-4 flex gap-2">
                                    <CompareButton tour={tour} size="md" variant="outline" />
                                    <WishlistButton tourId={tour.id} tourName={tour.name} size="lg" showText />
                                </div>
                            </div>
                            
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
                            {formatDuration(tour.duration)}
                        </div>
                        <div className="flex items-center">
                            <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                            {availableSeats} seats available
                        </div>
                    </div>
                    
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold mb-4">About This Tour</h2>
                        <p className="text-gray-700 leading-relaxed whitespace-pre-line">{tour.description}</p>
                    </div>

                    {/* Tour Highlights */}
                    {tour.highlights && Array.isArray(tour.highlights) && tour.highlights.length > 0 && (
                        <div className="mb-8 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <svg className="w-7 h-7 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                                </svg>
                                Tour Highlights
                            </h2>
                            <ul className="space-y-3">
                                {tour.highlights.map((highlight, index) => (
                                    <li key={index} className="flex items-start gap-3">
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700">{String(highlight).replace(/^[•\-*]\s*/, '')}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>
                    )}

                    {/* What's Included */}
                    {tour.included && Array.isArray(tour.included) && tour.included.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <svg className="w-7 h-7 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                What's Included
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {tour.included.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 bg-green-50 rounded-lg p-3">
                                        <svg className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700 text-sm">{String(item).replace(/^[•\-*]\s*/, '')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* What's Excluded */}
                    {tour.excluded && Array.isArray(tour.excluded) && tour.excluded.length > 0 && (
                        <div className="mb-8">
                            <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                                <svg className="w-7 h-7 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                What's Not Included
                            </h2>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                {tour.excluded.map((item, index) => (
                                    <div key={index} className="flex items-start gap-3 bg-red-50 rounded-lg p-3">
                                        <svg className="w-5 h-5 text-red-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                        <span className="text-gray-700 text-sm">{String(item).replace(/^[•\-*]\s*/, '')}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Tour Information Grid */}
                    <div className="mb-8 bg-gray-50 rounded-xl p-6">
                        <h2 className="text-2xl font-bold mb-6">Tour Information</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Duration */}
                            <div className="flex items-start gap-4">
                                <div className="bg-blue-100 rounded-lg p-3">
                                    <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Duration</h3>
                                    <p className="text-gray-600">{formatDuration(tour.duration)}</p>
                                </div>
                            </div>

                            {/* Max Participants */}
                            <div className="flex items-start gap-4">
                                <div className="bg-purple-100 rounded-lg p-3">
                                    <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Group Size</h3>
                                    <p className="text-gray-600">Max {tour.max_participants} people</p>
                                </div>
                            </div>

                            {/* Destination */}
                            <div className="flex items-start gap-4">
                                <div className="bg-green-100 rounded-lg p-3">
                                    <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                    </svg>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900 mb-1">Destination</h3>
                                    <p className="text-gray-600">{tour.destination}</p>
                                </div>
                            </div>

                            {/* Departure Location */}
                            {tour.departure_location && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-orange-100 rounded-lg p-3">
                                        <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Departure From</h3>
                                        <p className="text-gray-600">{tour.departure_location}</p>
                                    </div>
                                </div>
                            )}

                            {/* Available Dates */}
                            {(tour.available_from || tour.start_date) && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-indigo-100 rounded-lg p-3">
                                        <svg className="w-6 h-6 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Next Departure</h3>
                                        <p className="text-gray-600">
                                            {new Date(tour.available_from || tour.start_date).toLocaleDateString('en-US', { 
                                                year: 'numeric', 
                                                month: 'long', 
                                                day: 'numeric' 
                                            })}
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Category */}
                            {tour.category && (
                                <div className="flex items-start gap-4">
                                    <div className="bg-pink-100 rounded-lg p-3">
                                        <svg className="w-6 h-6 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                                        </svg>
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-gray-900 mb-1">Category</h3>
                                        <p className="text-gray-600">{tour.category.name}</p>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Image Gallery Section */}
                    {tour.gallery_images && tour.gallery_images.length > 0 && (
                        <div className="mb-8">
                            <ImageGallery images={tour.gallery_images} tourName={tour.name} />
                        </div>
                    )}
                    
                    <div className="border-t pt-8 mt-8">
                        <div className="flex flex-col lg:flex-row items-center justify-between gap-6">
                            {/* Price Section */}
                            <div className="text-center lg:text-left">
                                <span className="text-gray-600 block mb-2 text-sm uppercase tracking-wide">Starting From</span>
                                <div className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent mb-2">
                                    {formatPrice(tour.price)}
                                </div>
                                <p className="text-sm text-gray-500">per person</p>
                            </div>
                            
                            {/* Availability Badge */}
                            <div className="flex flex-col items-center lg:items-end gap-4">
                                <div className={`px-6 py-3 rounded-full font-semibold text-sm ${
                                    availableSeats > 10 
                                        ? 'bg-green-100 text-green-700' 
                                        : availableSeats > 0 
                                            ? 'bg-orange-100 text-orange-700' 
                                            : 'bg-red-100 text-red-700'
                                }`}>
                                    {availableSeats > 0 
                                        ? `${availableSeats} Seats Available` 
                                        : 'Sold Out'}
                                </div>
                                
                                {/* Book Button */}
                                <button
                                    onClick={handleBookNow}
                                    disabled={availableSeats === 0}
                                    className="w-full lg:w-auto bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-12 py-4 rounded-xl text-lg font-bold hover:from-blue-700 hover:to-indigo-700 disabled:from-gray-400 disabled:to-gray-500 disabled:cursor-not-allowed transition-all transform hover:scale-105 hover:shadow-xl shadow-lg"
                                >
                                    {availableSeats === 0 ? 'Sold Out' : 'Book This Tour Now'}
                                </button>
                            </div>
                        </div>
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
