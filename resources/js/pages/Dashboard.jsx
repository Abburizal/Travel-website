import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import SubmitReview from '../components/SubmitReview';

export default function Dashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showReviewForm, setShowReviewForm] = useState({});

    useEffect(() => {
        fetchBookings();
    }, []);

    const fetchBookings = async () => {
        try {
            const response = await api.get('/bookings');
            setBookings(response.data.data);
        } catch (err) {
            console.error('Failed to load bookings', err);
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

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    const getStatusBadge = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            paid: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800',
            completed: 'bg-blue-100 text-blue-800',
        };
        return (
            <span className={`px-3 py-1 rounded-full text-sm font-semibold ${colors[status] || 'bg-gray-100 text-gray-800'}`}>
                {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
        );
    };

    const handlePayment = async (bookingId) => {
        try {
            const response = await api.post(`/payments/${bookingId}`);
            const { snap_token, redirect_url } = response.data;

            // Check if test mode (snap_token starts with "test-")
            if (snap_token && snap_token.startsWith('test-')) {
                // Redirect to local payment simulator
                navigate(`/payment/${snap_token}`);
                return;
            }

            // Production mode: Use Midtrans Snap
            if (window.snap) {
                window.snap.pay(snap_token, {
                    onSuccess: function() {
                        alert('Payment successful!');
                        fetchBookings();
                    },
                    onPending: function() {
                        alert('Payment pending.');
                        fetchBookings();
                    },
                    onError: function() {
                        alert('Payment failed!');
                    },
                });
            } else {
                // Fallback: Open redirect URL in new tab
                window.open(redirect_url, '_blank');
            }
        } catch (err) {
            alert(err.response?.data?.message || 'Failed to process payment');
        }
    };

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-16 text-center">
                <div className="text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">My Bookings</h1>
                <p className="text-gray-600">Welcome back, {user?.name}!</p>
            </div>

            {bookings.length === 0 ? (
                <div className="bg-white rounded-lg shadow-md p-8 text-center">
                    <p className="text-gray-600 mb-4">You haven't made any bookings yet.</p>
                    <a href="/tours" className="text-blue-600 hover:underline">
                        Browse available tours
                    </a>
                </div>
            ) : (
                <div className="space-y-4">
                    {bookings.map((booking) => (
                        <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex flex-col md:flex-row md:justify-between md:items-start mb-4">
                                <div className="mb-4 md:mb-0">
                                    <h3 className="text-xl font-bold mb-2">{booking.tour?.name}</h3>
                                    <p className="text-gray-600">📍 {booking.tour?.destination}</p>
                                    <p className="text-gray-600">📅 {formatDate(booking.booking_date)}</p>
                                    <p className="text-gray-600">👥 {booking.number_of_participants} participants</p>
                                </div>
                                <div className="text-right">
                                    {getStatusBadge(booking.status)}
                                    <p className="text-2xl font-bold text-blue-600 mt-2">
                                        {formatCurrency(booking.total_price)}
                                    </p>
                                </div>
                            </div>

                            {booking.status === 'pending' && (
                                <div className="border-t pt-4">
                                    <p className="text-sm text-gray-600 mb-3">
                                        ⏰ Expires: {booking.expired_at ? formatDate(booking.expired_at) : 'N/A'}
                                    </p>
                                    <button
                                        onClick={() => handlePayment(booking.id)}
                                        className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
                                    >
                                        Pay Now
                                    </button>
                                </div>
                            )}

                            {(booking.status === 'paid' || booking.status === 'completed') && (
                                <div className="border-t pt-4">
                                    {!showReviewForm[booking.id] ? (
                                        <button
                                            onClick={() => setShowReviewForm({...showReviewForm, [booking.id]: true})}
                                            className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-2 rounded-lg hover:from-purple-700 hover:to-blue-700 flex items-center gap-2"
                                        >
                                            ⭐ Write a Review
                                        </button>
                                    ) : (
                                        <div>
                                            <button
                                                onClick={() => setShowReviewForm({...showReviewForm, [booking.id]: false})}
                                                className="mb-4 text-gray-600 hover:text-gray-800 text-sm flex items-center gap-1"
                                            >
                                                ← Hide Review Form
                                            </button>
                                            <SubmitReview
                                                booking={booking}
                                                onSubmitted={(review) => {
                                                    setShowReviewForm({...showReviewForm, [booking.id]: false});
                                                    alert('✅ Thank you for your review!');
                                                }}
                                            />
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
