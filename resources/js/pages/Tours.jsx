import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function Tours() {
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

    useEffect(() => {
        fetchCategories();
    }, []);

    // Auto-update for filters (NOT search)
    useEffect(() => {
        fetchTours();
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

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
        }).format(amount);
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
                            <div key={tour.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                                {/* Tour Image or Placeholder */}
                                <div className="h-48 relative overflow-hidden">
                                    {tour.image_url ? (
                                        <img 
                                            src={tour.image_url} 
                                            alt={tour.name}
                                            className="w-full h-full object-cover"
                                            onError={(e) => {
                                                e.target.onerror = null;
                                                e.target.src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"%3E%3Crect fill="%234299e1" width="100" height="100"/%3E%3C/svg%3E';
                                            }}
                                        />
                                    ) : (
                                        <div className="w-full h-full bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                                            <svg className="w-20 h-20 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                            </svg>
                                        </div>
                                    )}
                                    {tour.category && (
                                        <span className="absolute top-4 left-4 bg-white px-3 py-1 rounded-full text-sm font-medium text-gray-700 shadow-md">
                                            {tour.category.name}
                                        </span>
                                    )}
                                </div>
                                
                                <div className="p-6">
                                    <h3 className="text-xl font-bold mb-2">{tour.name}</h3>
                                    <p className="text-gray-600 mb-4 line-clamp-2">{tour.description}</p>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <div>
                                            <span className="text-2xl font-bold text-blue-600">
                                                {formatCurrency(tour.price)}
                                            </span>
                                            <span className="text-gray-500 text-sm"> / person</span>
                                        </div>
                                        <div className="text-sm text-gray-600">
                                            {tour.duration} days
                                        </div>
                                    </div>
                                    
                                    <div className="flex justify-between items-center mb-4">
                                        <span className="text-sm text-gray-600">
                                            📍 {tour.destination}
                                        </span>
                                        <span className={`text-sm font-semibold ${
                                            isSoldOut ? 'text-red-600' : isLowStock ? 'text-orange-600' : 'text-green-600'
                                        }`}>
                                            {isSoldOut ? 'Sold Out' : `${availableSeats} seats left`}
                                        </span>
                                    </div>
                                    
                                    <Link
                                        to={`/tours/${tour.id}`}
                                        className={`block w-full text-center py-2 rounded-lg transition-colors ${
                                            isSoldOut 
                                                ? 'bg-gray-300 text-gray-600 cursor-not-allowed' 
                                                : 'bg-blue-600 text-white hover:bg-blue-700'
                                        }`}
                                    >
                                        {isSoldOut ? 'Sold Out' : 'View Details'}
                                    </Link>
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
