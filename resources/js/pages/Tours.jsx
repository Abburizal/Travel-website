import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCurrency } from '../hooks/useCurrency';
import api from '../services/api';
import WishlistButton from '../components/WishlistButton';
import CompareButton from '../components/CompareButton';
import SEO from '../components/SEO';
import { useAnalytics } from '../hooks/useAnalytics';

export default function Tours() {
    const { t } = useTranslation();
    const { formatCurrency } = useCurrency();
    const { trackSearch, trackFilter } = useAnalytics();
    const [tours, setTours] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    
    // Filter states
    const [searchInput, setSearchInput] = useState(''); // User typing
    const [searchQuery, setSearchQuery] = useState(''); // Actual search query
    const [selectedCategory, setSelectedCategory] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [duration, setDuration] = useState('');
    const [availableOnly, setAvailableOnly] = useState(false);
    const [sortBy, setSortBy] = useState('created_at');
    const [showFilters, setShowFilters] = useState(false);

    // Scroll to top on component mount
    useEffect(() => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }, []);

    useEffect(() => {
        fetchCategories();
    }, []);

    // Auto-update for filters (NOT search)
    useEffect(() => {
        fetchTours();
        
        // Track filter usage
        if (selectedCategory) trackFilter('Category', selectedCategory);
        if (minPrice || maxPrice) trackFilter('Price', `${minPrice}-${maxPrice}`);
        if (duration) trackFilter('Duration', duration);
        if (availableOnly) trackFilter('Availability', 'Available Only');
        if (sortBy !== 'created_at') trackFilter('Sort', sortBy);
    }, [searchQuery, selectedCategory, minPrice, maxPrice, duration, availableOnly, sortBy]);

    const fetchCategories = async () => {
        try {
            const response = await api.get('/categories');
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const fetchTours = async () => {
        setLoading(true);
        try {
            const params = new URLSearchParams();
            if (searchQuery) params.append('search', searchQuery);
            if (selectedCategory) params.append('category_id', selectedCategory);
            if (minPrice) params.append('min_price', minPrice);
            if (maxPrice) params.append('max_price', maxPrice);
            if (duration) params.append('duration', duration);
            if (availableOnly) params.append('available', 'true');
            params.append('sort_by', sortBy);

            const response = await api.get(`/tours?${params.toString()}`);
            setTours(response.data);
        } catch (err) {
            setError('Failed to load tours');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // Handle search submit (Enter key or button click)
    const handleSearch = (e) => {
        if (e) e.preventDefault();
        setSearchQuery(searchInput);
        
        // Track search query
        if (searchInput.trim()) {
            trackSearch(searchInput);
        }
    };

    // Handle Enter key in search input
    const handleKeyDown = (e) => {
        if (e.key === 'Enter') {
            handleSearch(e);
        }
    };

    const clearFilters = () => {
        setSearchInput('');
        setSearchQuery('');
        setSelectedCategory('');
        setMinPrice('');
        setMaxPrice('');
        setDuration('');
        setAvailableOnly(false);
        setSortBy('created_at');
    };

    // Use formatCurrency from useCurrency hook instead

    const formatDuration = (duration) => {
        // If duration already contains "Days", "Nights", "Day", "Night", return as is
        if (/days?|nights?/i.test(duration)) {
            return duration;
        }
        // Otherwise, it's just a number, add "days"
        return `${duration} ${t('common.days')}`;
    };

    if (error) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-red-600 text-xl">{error}</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <SEO 
                title="Available Tours - Explore Amazing Destinations"
                description={`Browse ${tours.length} amazing tour packages across Asia, Europe, and beyond. Find your perfect vacation with destinations including Thailand, Singapore, Korea, Japan, and more. Book your dream adventure today!`}
                keywords="tour packages, travel tours, vacation packages, Asia tours, Europe tours, adventure travel, holiday packages, international tours, tour booking, travel deals"
                url="/tours"
            />
            
            <h1 className="text-4xl font-bold mb-8">Available Tours</h1>
            
            {/* Search & Filter Section */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
                {/* Search Bar */}
                <div className="mb-4">
                    <form onSubmit={handleSearch} className="relative flex gap-2">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search tours by name, destination, or description..."
                                value={searchInput}
                                onChange={(e) => setSearchInput(e.target.value)}
                                onKeyDown={handleKeyDown}
                                className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="absolute left-4 top-3.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                        <button
                            type="submit"
                            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2 font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                            Search
                        </button>
                    </form>
                    {searchQuery && (
                        <div className="mt-2 text-sm text-gray-600">
                            Searching for: <span className="font-semibold">"{searchQuery}"</span>
                            <button
                                onClick={() => {
                                    setSearchInput('');
                                    setSearchQuery('');
                                }}
                                className="ml-2 text-blue-600 hover:text-blue-700"
                            >
                                Clear
                            </button>
                        </div>
                    )}
                </div>

                {/* Toggle Filters Button */}
                <button
                    onClick={() => setShowFilters(!showFilters)}
                    className="flex items-center gap-2 text-blue-600 hover:text-blue-700 font-medium mb-4"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                    {showFilters ? 'Hide Filters' : 'Show Filters'}
                </button>

                {/* Filter Panel */}
                {showFilters && (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 border-t">
                        {/* Category Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Categories</option>
                                {categories.map((cat) => (
                                    <option key={cat.id} value={cat.id}>
                                        {cat.name} ({cat.tours_count})
                                    </option>
                                ))}
                            </select>
                        </div>

                        {/* Price Range */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Min Price</label>
                            <input
                                type="number"
                                placeholder="0"
                                value={minPrice}
                                onChange={(e) => setMinPrice(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Max Price</label>
                            <input
                                type="number"
                                placeholder="10000000"
                                value={maxPrice}
                                onChange={(e) => setMaxPrice(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            />
                        </div>

                        {/* Duration Filter */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Duration (days)</label>
                            <select
                                value={duration}
                                onChange={(e) => setDuration(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">Any Duration</option>
                                <option value="1">1 Day</option>
                                <option value="2">2 Days</option>
                                <option value="3">3 Days</option>
                                <option value="4">4 Days</option>
                                <option value="5">5+ Days</option>
                            </select>
                        </div>

                        {/* Availability Checkbox */}
                        <div className="flex items-center">
                            <input
                                type="checkbox"
                                id="available"
                                checked={availableOnly}
                                onChange={(e) => setAvailableOnly(e.target.checked)}
                                className="w-4 h-4 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                            />
                            <label htmlFor="available" className="ml-2 text-sm text-gray-700">
                                Available only
                            </label>
                        </div>

                        {/* Clear Filters Button */}
                        <div className="flex items-end">
                            <button
                                onClick={clearFilters}
                                className="text-sm text-red-600 hover:text-red-700 font-medium"
                            >
                                Clear All Filters
                            </button>
                        </div>
                    </div>
                )}

                {/* Sort Options */}
                <div className="flex items-center gap-4 mt-4 pt-4 border-t">
                    <span className="text-sm font-medium text-gray-700">Sort by:</span>
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="created_at">Newest</option>
                        <option value="price_low">Price: Low to High</option>
                        <option value="price_high">Price: High to Low</option>
                        <option value="popularity">Most Popular</option>
                        <option value="date">Start Date</option>
                    </select>
                    <span className="text-sm text-gray-600 ml-auto">
                        {loading ? (
                            <span className="flex items-center gap-2">
                                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
                                Loading...
                            </span>
                        ) : (
                            `${tours.length} ${tours.length === 1 ? 'tour' : 'tours'} found`
                        )}
                    </span>
                </div>
            </div>

            {/* Tours Grid - Always visible, with opacity when loading */}
            <div className={`transition-opacity duration-300 ${loading ? 'opacity-50' : 'opacity-100'}`}>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {tours.map((tour) => {
                        const availableSeats = tour.max_participants - tour.booked_participants;
                        const isLowStock = availableSeats <= 5 && availableSeats > 0;
                        const isSoldOut = availableSeats <= 0;

                        return (
                            <div key={tour.id} className="group bg-white rounded-xl shadow-md overflow-hidden hover:shadow-2xl transition-all duration-300 hover:-translate-y-1">
                                {/* Tour Image with Overlay */}
                                <div className="h-56 relative overflow-hidden">
                                    {tour.image_url ? (
                                        <img 
                                            src={tour.image_url} 
                                            alt={tour.name}
                                            loading="lazy"
                                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%234299e1" width="100" height="100"/%3E%3C/svg%3E';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-br from-blue-500 via-blue-600 to-purple-600 flex items-center justify-center">
                                            <svg className="w-20 h-20 text-white opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    )}
                                    
                                    {/* Overlay Gradient */}
                                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent"></div>
                                    
                                    {/* Category Badge */}
                                    {tour.category && (
                                        <div className="absolute top-3 left-3">
                                            <span className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-semibold bg-white/95 text-gray-800 shadow-lg backdrop-blur-sm">
                                                🏷️ {tour.category.name}
                                            </span>
                                        </div>
                                    )}
                                    
                                    {/* Wishlist Button */}
                                    <div className="absolute top-3 right-3">
                                        <WishlistButton tourId={tour.id} tourName={tour.name} size="sm" />
                                    </div>
                                    
                                    {/* Status Badge */}
                                    {(isSoldOut || isLowStock) && (
                                        <div className="absolute bottom-3 right-3">
                                            <span className={`inline-flex items-center px-3 py-1.5 rounded-full text-xs font-bold shadow-lg ${
                                                isSoldOut 
                                                    ? 'bg-red-500 text-white' 
                                                    : 'bg-orange-500 text-white animate-pulse'
                                            }`}>
                                                {isSoldOut ? '🚫 SOLD OUT' : `⚡ ${availableSeats} LEFT`}
                                            </span>
                                        </div>
                                    )}
                                </div>
                                
                                {/* Card Content */}
                                <div className="p-5">
                                    {/* Tour Name */}
                                    <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors leading-snug min-h-[3.5rem]">
                                        {tour.name}
                                    </h3>
                                    
                                    {/* Description */}
                                    <p className="text-sm text-gray-600 mb-4 line-clamp-2 leading-relaxed">
                                        {tour.description}
                                    </p>
                                    
                                    {/* 2-Column Layout: Meta Info (Left) | Seats (Right) */}
                                    <div className="flex gap-4 mb-4 pb-4 border-b border-gray-100 items-start">
                                        {/* LEFT COLUMN: Meta Information */}
                                        <div className="flex-1 space-y-2 min-w-0">
                                            {/* Duration */}
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-4 h-4 text-blue-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                                </svg>
                                                <span className="font-medium">{formatDuration(tour.duration)}</span>
                                            </div>
                                            
                                            {/* Departure Location */}
                                            {tour.departure_location && (
                                                <div className="flex items-center gap-2 text-sm text-gray-700">
                                                    <svg className="w-4 h-4 text-green-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                                                    </svg>
                                                    <span className="font-medium truncate">{tour.departure_location}</span>
                                                </div>
                                            )}
                                            
                                            {/* Destination */}
                                            <div className="flex items-center gap-2 text-sm text-gray-700">
                                                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                                                </svg>
                                                <span className="font-medium truncate">{tour.destination}</span>
                                            </div>
                                        </div>
                                        
                                        {/* RIGHT COLUMN: Seats Available Highlight */}
                                        {!isSoldOut && (
                                            <div className="flex-shrink-0">
                                                <div className={`rounded-lg px-3 py-2 text-center min-w-[90px] border-2 ${
                                                    isLowStock 
                                                        ? 'bg-gradient-to-br from-orange-50 to-amber-50 border-orange-200' 
                                                        : 'bg-gradient-to-br from-green-50 to-emerald-50 border-green-200'
                                                }`}>
                                                    <div className={`text-2xl font-bold ${isLowStock ? 'text-orange-600' : 'text-green-600'}`}>
                                                        {availableSeats}
                                                    </div>
                                                    <div className={`text-xs font-semibold uppercase tracking-wide ${isLowStock ? 'text-orange-700' : 'text-green-700'}`}>
                                                        {t('tours.seatsLeft')}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    
                                    {/* Price Section */}
                                    <div className="mb-4">
                                        <div className="flex items-baseline">
                                            <span className="text-2xl font-bold text-blue-600">
                                                {formatCurrency(tour.price)}
                                            </span>
                                            <span className="text-sm text-gray-500 ml-1 font-medium">/ {t('common.per_person')}</span>
                                        </div>
                                    </div>
                                    
                                    {/* Action Buttons */}
                                    <div className="flex gap-2">
                                        <CompareButton tour={tour} size="sm" variant="outline" />
                                        <Link
                                            to={`/tours/${tour.id}`}
                                            className={`flex-1 flex items-center justify-center py-2.5 px-4 rounded-lg font-semibold text-sm transition-all duration-200 ${
                                                isSoldOut 
                                                    ? 'bg-gray-200 text-gray-500 cursor-not-allowed' 
                                                    : 'bg-gradient-to-r from-blue-600 to-blue-700 text-white hover:from-blue-700 hover:to-blue-800 shadow-md hover:shadow-lg'
                                            }`}
                                            onClick={(e) => isSoldOut && e.preventDefault()}
                                        >
                                            {isSoldOut ? (
                                                <>
                                                    <svg className="w-4 h-4 mr-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                                                    </svg>
                                                    {t('tours.soldOut')}
                                                </>
                                            ) : (
                                                <>
                                                    {t('tours.viewDetails')}
                                                    <svg className="w-4 h-4 ml-1.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                                    </svg>
                                                </>
                                            )}
                                        </Link>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Empty State */}
            {!loading && tours.length === 0 && (
                <div className="text-center py-16">
                    <svg className="w-24 h-24 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <h3 className="text-xl font-semibold text-gray-700 mb-2">No tours found</h3>
                    <p className="text-gray-600 mb-4">Try adjusting your filters or search criteria</p>
                    <button
                        onClick={clearFilters}
                        className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    >
                        Clear Filters
                    </button>
                </div>
            )}
        </div>
    );
}
