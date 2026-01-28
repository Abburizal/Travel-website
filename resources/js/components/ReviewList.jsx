import React, { useState, useEffect } from 'react';
import api from '../services/api';

export default function ReviewList({ tourId }) {
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReviews();
    }, [tourId]);

    const fetchReviews = async () => {
        try {
            const response = await api.get(`/tours/${tourId}/reviews`);
            setReviews(response.data.reviews);
            setStats(response.data.stats);
        } catch (error) {
            console.error('Failed to load reviews:', error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            {/* Rating Summary */}
            {stats && stats.total_reviews > 0 && (
                <div className="bg-white rounded-lg shadow-md p-6">
                    <div className="flex items-center justify-between mb-4">
                        <div>
                            <h3 className="text-2xl font-bold">Customer Reviews</h3>
                            <p className="text-gray-600">{stats.total_reviews} reviews</p>
                        </div>
                        <div className="text-center">
                            <div className="text-4xl font-bold text-blue-600">{stats.average_rating}</div>
                            <div className="text-yellow-400 text-xl">
                                {Array.from({ length: 5 }, (_, i) => (
                                    <span key={i}>{i < Math.round(stats.average_rating) ? '★' : '☆'}</span>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* Rating Breakdown */}
                    <div className="space-y-2">
                        {[5, 4, 3, 2, 1].map((rating) => {
                            const count = stats.rating_breakdown[rating] || 0;
                            const percentage = stats.total_reviews > 0 
                                ? (count / stats.total_reviews) * 100 
                                : 0;
                            
                            return (
                                <div key={rating} className="flex items-center gap-3">
                                    <span className="text-sm font-medium w-12">{rating} ★</span>
                                    <div className="flex-1 bg-gray-200 rounded-full h-2">
                                        <div 
                                            className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                                            style={{ width: `${percentage}%` }}
                                        ></div>
                                    </div>
                                    <span className="text-sm text-gray-600 w-12 text-right">{count}</span>
                                </div>
                            );
                        })}
                    </div>
                </div>
            )}

            {/* Reviews List */}
            <div className="space-y-4">
                {reviews.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <p className="text-gray-500">No reviews yet. Be the first to review this tour!</p>
                    </div>
                ) : (
                    reviews.map((review) => (
                        <div key={review.id} className="bg-white rounded-lg shadow-md p-6">
                            <div className="flex items-start justify-between mb-3">
                                <div>
                                    <h4 className="font-semibold text-gray-900">{review.user_name}</h4>
                                    <p className="text-sm text-gray-500">{review.created_at_human}</p>
                                </div>
                                <div className="flex items-center gap-1 text-yellow-400">
                                    {Array.from({ length: 5 }, (_, i) => (
                                        <span key={i} className="text-lg">
                                            {i < review.rating ? '★' : '☆'}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <p className="text-gray-700 leading-relaxed">{review.comment}</p>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
}
