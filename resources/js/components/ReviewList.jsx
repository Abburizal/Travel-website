import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StarRating from '../components/StarRating';

export default function ReviewList({ tourId }) {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);

    useEffect(() => {
        fetchReviews();
    }, [tourId, page]);

    const fetchReviews = async () => {
        try {
            const response = await axios.get(`/api/tours/${tourId}/reviews?page=${page}`);
            setReviews(response.data.data.data);
            setStats(response.data.stats);
        } catch (err) {
            console.error('Failed to load reviews', err);
        } finally {
            setLoading(false);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
        });
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto"></div>
                <p className="mt-4 text-gray-600">Loading reviews...</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Review Stats */}
            {stats && (
                <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6">
                    <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
                        {/* Average Rating */}
                        <div className="text-center md:border-r md:pr-6">
                            <div className="text-5xl font-bold text-purple-600 mb-2">
                                {stats.average_rating}
                            </div>
                            <StarRating rating={stats.average_rating} size="lg" />
                            <p className="text-gray-600 mt-2">{stats.total_reviews} reviews</p>
                        </div>

                        {/* Rating Distribution */}
                        <div className="flex-1 w-full">
                            <h3 className="font-semibold text-gray-800 mb-3">Rating Distribution</h3>
                            {[5, 4, 3, 2, 1].map((star) => {
                                const count = stats.rating_distribution[star] || 0;
                                const percentage = stats.total_reviews > 0
                                    ? (count / stats.total_reviews) * 100
                                    : 0;

                                return (
                                    <div key={star} className="flex items-center gap-2 mb-2">
                                        <span className="text-sm text-gray-600 w-8">{star}★</span>
                                        <div className="flex-1 bg-gray-200 rounded-full h-2">
                                            <div
                                                className="bg-yellow-400 h-2 rounded-full transition-all"
                                                style={{ width: `${percentage}%` }}
                                            ></div>
                                        </div>
                                        <span className="text-sm text-gray-600 w-12 text-right">
                                            {count}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                <h3 className="text-xl font-bold text-gray-800">Customer Reviews</h3>

                {reviews.length === 0 ? (
                    <div className="text-center py-8 bg-gray-50 rounded-lg">
                        <p className="text-gray-600">No reviews yet. Be the first to review!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div
                            key={review.id}
                            className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition"
                        >
                            <div className="flex items-start justify-between mb-3">
                                <div className="flex items-center gap-3">
                                    <div className="w-10 h-10 rounded-full bg-gradient-to-r from-purple-500 to-blue-500 flex items-center justify-center text-white font-bold">
                                        {review.user.name.charAt(0).toUpperCase()}
                                    </div>
                                    <div>
                                        <h4 className="font-semibold text-gray-800">
                                            {review.user.name}
                                        </h4>
                                        <p className="text-sm text-gray-500">
                                            {formatDate(review.created_at)}
                                        </p>
                                    </div>
                                </div>
                                <StarRating rating={review.rating} size="sm" />
                            </div>

                            {review.comment && (
                                <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
