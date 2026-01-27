import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';

export default function Booking() {
    const { tourId } = useParams();
    const navigate = useNavigate();
    const [tour, setTour] = useState(null);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    
    const [formData, setFormData] = useState({
        booking_date: '',
        number_of_participants: 1,
    });

    useEffect(() => {
        fetchTour();
    }, [tourId]);

    const fetchTour = async () => {
        try {
            const response = await api.get(`/tours/${tourId}`);
            setTour(response.data);
        } catch (err) {
            setError('Failed to load tour');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSubmitting(true);

        try {
            const bookingResponse = await api.post('/bookings', {
                tour_id: parseInt(tourId),
                ...formData,
            });

            const bookingId = bookingResponse.data.data.id;

            // Request payment token
            const paymentResponse = await api.post(`/payments/${bookingId}`);
            const { snap_token, redirect_url } = paymentResponse.data;

            // Check if test mode (snap_token starts with "test-")
            if (snap_token && snap_token.startsWith('test-')) {
                // Redirect to local payment simulator
                navigate(`/payment/${snap_token}`);
                return;
            }

            // Production mode: Use Midtrans Snap
            if (window.snap) {
                window.snap.pay(snap_token, {
                    onSuccess: function(result) {
                        alert('Payment successful!');
                        navigate('/dashboard');
                    },
                    onPending: function(result) {
                        alert('Payment pending. Please complete your payment.');
                        navigate('/dashboard');
                    },
                    onError: function(result) {
                        alert('Payment failed!');
                        setError('Payment failed. Please try again.');
                    },
                    onClose: function() {
                        alert('You closed the payment popup.');
                    }
                });
            } else {
                // Fallback: Open redirect URL
                window.open(redirect_url, '_blank');
            }
        } catch (err) {
            setError(err.response?.data?.message || 'Booking failed');
        } finally {
            setSubmitting(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(amount);
    };

    const calculateTotal = () => {
        if (!tour) return 0;
        return tour.price * formData.number_of_participants;
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-16 text-center">Loading...</div>;
    }

    if (!tour) {
        return <div className="container mx-auto px-4 py-16 text-center text-red-600">{error}</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8 max-w-2xl">
            <h1 className="text-3xl font-bold mb-8">Book Your Tour</h1>
            
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h2 className="text-xl font-bold mb-4">{tour.name}</h2>
                <p className="text-gray-600 mb-2">📍 {tour.destination}</p>
                <p className="text-gray-600 mb-2">⏱️ {tour.duration} days</p>
                <p className="text-2xl font-bold text-blue-600">{formatCurrency(tour.price)} / person</p>
            </div>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-md p-6">
                <div className="mb-4">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Booking Date
                    </label>
                    <input
                        type="date"
                        value={formData.booking_date}
                        onChange={(e) => setFormData({...formData, booking_date: e.target.value})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        required
                        min={new Date().toISOString().split('T')[0]}
                    />
                </div>

                <div className="mb-6">
                    <label className="block text-gray-700 text-sm font-bold mb-2">
                        Number of Participants
                    </label>
                    <input
                        type="number"
                        value={formData.number_of_participants}
                        onChange={(e) => setFormData({...formData, number_of_participants: parseInt(e.target.value)})}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-blue-500"
                        min="1"
                        max={tour.max_participants - tour.booked_participants}
                        required
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        Available: {tour.max_participants - tour.booked_participants} seats
                    </p>
                </div>

                <div className="border-t pt-4 mb-6">
                    <div className="flex justify-between items-center mb-2">
                        <span className="text-gray-600">Subtotal</span>
                        <span className="text-xl font-bold">{formatCurrency(calculateTotal())}</span>
                    </div>
                    <p className="text-sm text-gray-500">
                        Booking will expire in 30 minutes after creation
                    </p>
                </div>

                <button
                    type="submit"
                    disabled={submitting}
                    className="w-full bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 font-semibold"
                >
                    {submitting ? 'Processing...' : `Pay ${formatCurrency(calculateTotal())}`}
                </button>
            </form>
        </div>
    );
}
