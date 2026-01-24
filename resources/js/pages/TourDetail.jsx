import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function TourDetail() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchTourDetail();
    }, [id]);

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
                <div className="h-96 bg-gradient-to-r from-blue-400 to-blue-600 flex items-center justify-center">
                    <svg className="w-32 h-32 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                </div>
                
                <div className="p-8">
                    <h1 className="text-4xl font-bold mb-4">{tour.name}</h1>
                    
                    <div className="flex flex-wrap gap-4 mb-6 text-gray-600">
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
                    
                    <div className="border-t pt-6 flex items-center justify-between">
                        <div>
                            <span className="text-gray-600">Price per person</span>
                            <div className="text-4xl font-bold text-blue-600">
                                {formatCurrency(tour.price)}
                            </div>
                        </div>
                        
                        <button
                            onClick={handleBookNow}
                            disabled={availableSeats === 0}
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg text-lg font-semibold hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed"
                        >
                            {availableSeats === 0 ? 'Sold Out' : 'Book Now'}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
