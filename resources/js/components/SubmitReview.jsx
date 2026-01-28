import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import api from '../services/api';

export default function SubmitReview({ tourId, onReviewSubmitted }) {
    const { user } = useAuth();
    const [canReview, setCanReview] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);
    
    const [formData, setFormData] = useState({
        booking_id: '',
        rating: 5,
        comment: '',
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (user) {
            checkCanReview();
        } else {
            setLoading(false);
        }
    }, [tourId, user]);

    const checkCanReview = async () => {
        try {
            const response = await api.get(`/tours/${tourId}/can-review`);
            setCanReview(response.data.can_review);
            setBookings(response.data.bookings || []);
            if (response.data.bookings && response.data.bookings.length > 0) {
                setFormData(prev => ({
                    ...prev,
                    booking_id: response.data.bookings[0].id
                }));
            }
        } catch (error) {
            console.error('Failed to check review eligibility:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setErrors({});
        setSubmitting(true);

        try {
            await api.post(`/tours/${tourId}/reviews`, formData);
            alert('Review submitted successfully! It will be published after admin approval.');
            setShowForm(false);
            setFormData({ booking_id: bookings[0]?.id || '', rating: 5, comment: '' });
            if (onReviewSubmitted) onReviewSubmitted();
            checkCanReview(); // Refresh eligibility
        } catch (error) {
            if (error.response?.data?.errors) {
                setErrors(error.response.data.errors);
            } else {
                alert(error.response?.data?.message || 'Failed to submit review');
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return null;
    }

    if (!user) {
        return (
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 text-center">
                <p className="text-gray-700">Please <a href="/login" className="text-blue-600 hover:underline font-semibold">login</a> to write a review</p>
            </div>
        );
    }

    if (!canReview) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-6 text-center">
                <p className="text-gray-600">You need to book and complete this tour before writing a review</p>
            </div>
        );
    }

    return (
        <div className="bg-white rounded-lg shadow-md p-6">
            {!showForm ? (
                <button
                    onClick={() => setShowForm(true)}
                    className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold"
                >
                    ✍️ Write a Review
                </button>
            ) : (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <h3 className="text-xl font-bold mb-4">Write Your Review</h3>

                    {/* Booking Selection */}
                    {bookings.length > 1 && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Select Booking
                            </label>
                            <select
                                value={formData.booking_id}
                                onChange={(e) => setFormData({ ...formData, booking_id: e.target.value })}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                required
                            >
                                {bookings.map((booking) => (
                                    <option key={booking.id} value={booking.id}>
                                        Booking on {booking.booking_date}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    {/* Star Rating */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Rating
                        </label>
                        <div className="flex gap-2">
                            {[1, 2, 3, 4, 5].map((star) => (
                                <button
                                    key={star}
                                    type="button"
                                    onClick={() => setFormData({ ...formData, rating: star })}
                                    className={`text-4xl transition-colors ${
                                        star <= formData.rating ? 'text-yellow-400' : 'text-gray-300'
                                    } hover:text-yellow-400`}
                                >
                                    ★
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Comment */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                            Your Review
                        </label>
                        <textarea
                            value={formData.comment}
                            onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                            placeholder="Share your experience with this tour..."
                            rows={5}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            required
                            minLength={10}
                            maxLength={1000}
                        />
                        <p className="text-sm text-gray-500 mt-1">
                            {formData.comment.length}/1000 characters (minimum 10)
                        </p>
                        {errors.comment && (
                            <p className="text-red-500 text-sm mt-1">{errors.comment[0]}</p>
                        )}
                    </div>

                    {/* Buttons */}
                    <div className="flex gap-3">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                            className="flex-1 px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting || formData.comment.length < 10}
                            className="flex-1 px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {submitting ? 'Submitting...' : 'Submit Review'}
                        </button>
                    </div>
                </form>
            )}
        </div>
    );
}
