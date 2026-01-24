import React, { useState, useEffect } from 'react';
import api from '../services/api';
import StarRating from '../components/StarRating';

export default function SubmitReview({ booking, onSubmitted }) {
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [canReview, setCanReview] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        checkCanReview();
    }, [booking.id]);

    const checkCanReview = async () => {
        try {
            const response = await api.get(`/bookings/${booking.id}/can-review`);
            setCanReview(response.data);
        } catch (err) {
            setCanReview({ can_review: false, message: 'Unable to check review eligibility' });
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (rating === 0) {
            setError('Please select a rating');
            return;
        }

        setSubmitting(true);
        setError('');

        try {
            const response = await api.post('/reviews', {
                booking_id: booking.id,
                rating,
                comment,
            });

            alert('✅ Review submitted successfully! Thank you for your feedback.');
            
            if (onSubmitted) {
                onSubmitted(response.data.data);
            }

            // Reset form
            setRating(0);
            setComment('');
            setCanReview({ can_review: false, message: 'Already reviewed' });

        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit review');
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-4">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-600 mx-auto"></div>
            </div>
        );
    }

    if (!canReview?.can_review) {
        return (
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 text-center">
                <p className="text-gray-600">{canReview?.message || 'You cannot review this booking'}</p>
            </div>
        );
    }

    return (
        <div className="bg-white border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-bold text-gray-800 mb-4">
                ⭐ Write a Review
            </h3>

            <form onSubmit={handleSubmit} className="space-y-4">
                {/* Tour Name */}
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600 mb-1">You're reviewing:</p>
                    <p className="font-semibold text-gray-800">{booking.tour?.name}</p>
                </div>

                {/* Rating */}
                <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Your Rating *
                    </label>
                    <div className="flex items-center gap-4">
                        <StarRating
                            rating={rating}
                            editable={true}
                            onChange={setRating}
                            size="xl"
                        />
                        {rating > 0 && (
                            <span className="text-gray-600">
                                ({rating} star{rating > 1 ? 's' : ''})
                            </span>
                        )}
                    </div>
                </div>

                {/* Comment */}
                <div>
                    <label
                        htmlFor="comment"
                        className="block text-sm font-semibold text-gray-700 mb-2"
                    >
                        Your Review (Optional)
                    </label>
                    <textarea
                        id="comment"
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                        rows={4}
                        placeholder="Share your experience with this tour..."
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                        maxLength={1000}
                    />
                    <p className="text-sm text-gray-500 mt-1">
                        {comment.length}/1000 characters
                    </p>
                </div>

                {/* Error Message */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
                        {error}
                    </div>
                )}

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={submitting || rating === 0}
                    className="w-full bg-gradient-to-r from-purple-600 to-blue-600 text-white py-3 rounded-lg font-semibold hover:from-purple-700 hover:to-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition flex items-center justify-center"
                >
                    {submitting ? (
                        <>
                            <svg
                                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                            >
                                <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                ></circle>
                                <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                                ></path>
                            </svg>
                            Submitting...
                        </>
                    ) : (
                        'Submit Review'
                    )}
                </button>
            </form>
        </div>
    );
}
