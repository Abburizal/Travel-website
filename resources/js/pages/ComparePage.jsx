import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

const ComparePage = () => {
    const { compareTours, removeFromCompare, clearCompare } = useCompare();
    const navigate = useNavigate();

    if (compareTours.length === 0) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <svg
                            className="mx-auto h-24 w-24 text-gray-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={1}
                                d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                            />
                        </svg>
                        <h3 className="mt-4 text-xl font-medium text-gray-900">
                            No tours to compare
                        </h3>
                        <p className="mt-2 text-gray-500">
                            Add 2-3 tours to compare their features side-by-side
                        </p>
                        <Link
                            to="/tours"
                            className="mt-6 inline-block bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition"
                        >
                            Browse Tours
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('id-ID', {
            style: 'currency',
            currency: 'IDR',
            minimumFractionDigits: 0
        }).format(amount);
    };

    return (
        <div className="min-h-screen bg-gray-50 pt-20">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* Header */}
                <div className="flex items-center justify-between mb-8">
                    <div>
                        <h1 className="text-3xl font-bold text-gray-900">Compare Tours</h1>
                        <p className="mt-2 text-gray-600">
                            Comparing {compareTours.length} tour{compareTours.length !== 1 ? 's' : ''}
                        </p>
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={() => navigate('/tours')}
                            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700"
                        >
                            Add More Tours
                        </button>
                        <button
                            onClick={clearCompare}
                            className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition"
                        >
                            Clear All
                        </button>
                    </div>
                </div>

                {/* Comparison Table */}
                <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-900 sticky left-0 bg-gray-50 z-10 min-w-[200px]">
                                        Feature
                                    </th>
                                    {compareTours.map((tour) => (
                                        <th key={tour.id} className="px-6 py-4 text-left min-w-[280px]">
                                            <div className="flex flex-col gap-2">
                                                <button
                                                    onClick={() => removeFromCompare(tour.id)}
                                                    className="self-end text-red-600 hover:text-red-700 text-sm"
                                                >
                                                    Remove
                                                </button>
                                            </div>
                                        </th>
                                    ))}
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {/* Tour Images */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                                        Image
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <img
                                                src={tour.image_url || '/images/placeholder.jpg'}
                                                alt={tour.name}
                                                className="w-full h-40 object-cover rounded-lg"
                                            />
                                        </td>
                                    ))}
                                </tr>

                                {/* Tour Names */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                                        Tour Name
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <Link
                                                to={`/tours/${tour.id}`}
                                                className="text-lg font-bold text-blue-600 hover:text-blue-700"
                                            >
                                                {tour.name}
                                            </Link>
                                        </td>
                                    ))}
                                </tr>

                                {/* Category */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                                        Category
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <span className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                                                {tour.category?.name || 'N/A'}
                                            </span>
                                        </td>
                                    ))}
                                </tr>

                                {/* Price */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                                        Price
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <div className="text-2xl font-bold text-green-600">
                                                {formatCurrency(tour.price)}
                                            </div>
                                            <div className="text-sm text-gray-500">per person</div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Duration */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                                        Duration
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                                                    />
                                                </svg>
                                                <span>{tour.duration}</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Destination */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                                        Destination
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                                                    />
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                                                    />
                                                </svg>
                                                <span>{tour.destination || 'N/A'}</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Max Participants */}
                                <tr className="bg-white">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                                        Max Participants
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <div className="flex items-center gap-2 text-gray-700">
                                                <svg
                                                    className="w-5 h-5 text-gray-400"
                                                    fill="none"
                                                    viewBox="0 0 24 24"
                                                    stroke="currentColor"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                                                    />
                                                </svg>
                                                <span>{tour.max_participants} people</span>
                                            </div>
                                        </td>
                                    ))}
                                </tr>

                                {/* Available Seats */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                                        Available Seats
                                    </td>
                                    {compareTours.map((tour) => {
                                        const available = tour.max_participants - (tour.booked_participants || 0);
                                        const isLow = available <= 5 && available > 0;
                                        const isSoldOut = available <= 0;
                                        
                                        return (
                                            <td key={tour.id} className="px-6 py-4">
                                                <span className={`
                                                    inline-block px-3 py-1 rounded-full text-sm font-medium
                                                    ${isSoldOut ? 'bg-red-100 text-red-800' :
                                                      isLow ? 'bg-yellow-100 text-yellow-800' :
                                                      'bg-green-100 text-green-800'}
                                                `}>
                                                    {isSoldOut ? 'Sold Out' : `${available} seats`}
                                                </span>
                                            </td>
                                        );
                                    })}
                                </tr>

                                {/* Highlights */}
                                {compareTours.some(t => t.highlights && t.highlights.length > 0) && (
                                    <tr className="bg-white">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                                            Highlights
                                        </td>
                                        {compareTours.map((tour) => (
                                            <td key={tour.id} className="px-6 py-4">
                                                {tour.highlights && tour.highlights.length > 0 ? (
                                                    <ul className="space-y-2">
                                                        {tour.highlights.slice(0, 5).map((highlight, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                                <svg
                                                                    className="w-4 h-4 text-green-500 flex-shrink-0 mt-0.5"
                                                                    fill="currentColor"
                                                                    viewBox="0 0 20 20"
                                                                >
                                                                    <path
                                                                        fillRule="evenodd"
                                                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                                                        clipRule="evenodd"
                                                                    />
                                                                </svg>
                                                                <span>{highlight}</span>
                                                            </li>
                                                        ))}
                                                        {tour.highlights.length > 5 && (
                                                            <li className="text-sm text-gray-500 italic ml-6">
                                                                +{tour.highlights.length - 5} more...
                                                            </li>
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                )}

                                {/* Included */}
                                {compareTours.some(t => t.included && t.included.length > 0) && (
                                    <tr className="bg-gray-50">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                                            What's Included
                                        </td>
                                        {compareTours.map((tour) => (
                                            <td key={tour.id} className="px-6 py-4">
                                                {tour.included && tour.included.length > 0 ? (
                                                    <ul className="space-y-1">
                                                        {tour.included.slice(0, 5).map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                                <span className="text-green-500">✓</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                        {tour.included.length > 5 && (
                                                            <li className="text-sm text-gray-500 italic ml-6">
                                                                +{tour.included.length - 5} more...
                                                            </li>
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                )}

                                {/* Excluded */}
                                {compareTours.some(t => t.excluded && t.excluded.length > 0) && (
                                    <tr className="bg-white">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-white z-10">
                                            What's Excluded
                                        </td>
                                        {compareTours.map((tour) => (
                                            <td key={tour.id} className="px-6 py-4">
                                                {tour.excluded && tour.excluded.length > 0 ? (
                                                    <ul className="space-y-1">
                                                        {tour.excluded.slice(0, 5).map((item, idx) => (
                                                            <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                                                                <span className="text-red-500">✗</span>
                                                                <span>{item}</span>
                                                            </li>
                                                        ))}
                                                        {tour.excluded.length > 5 && (
                                                            <li className="text-sm text-gray-500 italic ml-6">
                                                                +{tour.excluded.length - 5} more...
                                                            </li>
                                                        )}
                                                    </ul>
                                                ) : (
                                                    <span className="text-gray-500">N/A</span>
                                                )}
                                            </td>
                                        ))}
                                    </tr>
                                )}

                                {/* Actions */}
                                <tr className="bg-gray-50">
                                    <td className="px-6 py-4 text-sm font-medium text-gray-900 sticky left-0 bg-gray-50 z-10">
                                        Actions
                                    </td>
                                    {compareTours.map((tour) => (
                                        <td key={tour.id} className="px-6 py-4">
                                            <div className="flex flex-col gap-2">
                                                <Link
                                                    to={`/tours/${tour.id}`}
                                                    className="bg-blue-600 text-white text-center px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium"
                                                >
                                                    View Details
                                                </Link>
                                                <Link
                                                    to={`/booking/${tour.id}`}
                                                    className="bg-green-600 text-white text-center px-4 py-2 rounded-lg hover:bg-green-700 transition text-sm font-medium"
                                                >
                                                    Book Now
                                                </Link>
                                            </div>
                                        </td>
                                    ))}
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Bottom Actions */}
                <div className="mt-6 flex justify-center gap-4">
                    <Link
                        to="/tours"
                        className="px-6 py-3 border border-gray-300 rounded-lg hover:bg-gray-50 transition text-gray-700 font-medium"
                    >
                        ← Back to Tours
                    </Link>
                </div>
            </div>
        </div>
    );
};

export default ComparePage;
