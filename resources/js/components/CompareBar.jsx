import React from 'react';
import { Link } from 'react-router-dom';
import { useCompare } from '../context/CompareContext';

const CompareBar = () => {
    const { compareTours, compareCount, clearCompare } = useCompare();

    if (compareCount === 0) {
        return null;
    }

    return (
        <div className="fixed bottom-6 left-1/2 transform -translate-x-1/2 z-50">
            <div className="bg-blue-600 text-white rounded-full shadow-2xl px-6 py-4 flex items-center gap-4 animate-bounce-in">
                {/* Icon */}
                <div className="bg-white text-blue-600 rounded-full p-2">
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={2}
                        stroke="currentColor"
                        className="w-6 h-6"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                        />
                    </svg>
                </div>

                {/* Counter */}
                <div>
                    <div className="font-bold text-lg">
                        {compareCount} Tour{compareCount !== 1 ? 's' : ''} Selected
                    </div>
                    <div className="text-xs text-blue-100">
                        {compareCount < 2 ? 'Add at least 2 tours to compare' : 'Ready to compare'}
                    </div>
                </div>

                {/* Tour Thumbnails */}
                <div className="hidden md:flex gap-2 ml-4">
                    {compareTours.map((tour) => (
                        <div key={tour.id} className="relative group">
                            <img
                                src={tour.image_url || '/images/placeholder.jpg'}
                                alt={tour.name}
                                className="w-12 h-12 rounded object-cover border-2 border-white"
                            />
                            <div className="absolute bottom-full mb-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-2 py-1 rounded whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
                                {tour.name.substring(0, 30)}...
                            </div>
                        </div>
                    ))}
                </div>

                {/* Actions */}
                <div className="flex gap-2 ml-4">
                    <Link
                        to="/compare"
                        className={`
                            px-4 py-2 rounded-lg font-medium transition
                            ${compareCount >= 2
                                ? 'bg-white text-blue-600 hover:bg-blue-50'
                                : 'bg-blue-500 text-white cursor-not-allowed opacity-60'
                            }
                        `}
                        onClick={(e) => {
                            if (compareCount < 2) {
                                e.preventDefault();
                            }
                        }}
                    >
                        Compare Now
                    </Link>
                    <button
                        onClick={clearCompare}
                        className="px-3 py-2 bg-blue-500 hover:bg-blue-400 rounded-lg transition"
                        title="Clear all"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            strokeWidth={2}
                            stroke="currentColor"
                            className="w-5 h-5"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    );
};

export default CompareBar;
