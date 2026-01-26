import React, { useState } from 'react';
import { useCompare } from '../context/CompareContext';

const CompareButton = ({ tour, size = 'md', variant = 'default' }) => {
    const { addToCompare, removeFromCompare, isInCompare, canAddMore } = useCompare();
    const [showTooltip, setShowTooltip] = useState(false);
    const inCompare = isInCompare(tour.id);

    // Size variants
    const sizeClasses = {
        sm: 'text-xs px-2 py-1',
        md: 'text-sm px-3 py-2',
        lg: 'text-base px-4 py-3'
    };

    // Variant styles
    const variantClasses = {
        default: inCompare
            ? 'bg-green-600 hover:bg-green-700 text-white'
            : 'bg-blue-600 hover:bg-blue-700 text-white',
        outline: inCompare
            ? 'border-2 border-green-600 text-green-600 hover:bg-green-50'
            : 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
        icon: inCompare
            ? 'text-green-600 hover:text-green-700'
            : 'text-blue-600 hover:text-blue-700'
    };

    const handleClick = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (inCompare) {
            removeFromCompare(tour.id);
            showMessage('Removed from comparison');
        } else {
            if (!canAddMore()) {
                showMessage('Maximum 3 tours can be compared');
                return;
            }
            const result = addToCompare(tour);
            showMessage(result.message);
        }
    };

    const showMessage = (message) => {
        setShowTooltip(true);
        setTimeout(() => setShowTooltip(false), 2000);
    };

    if (variant === 'icon') {
        return (
            <div className="relative">
                <button
                    onClick={handleClick}
                    className={`
                        p-2 rounded-full transition-all duration-200
                        ${variantClasses[variant]}
                        hover:scale-110
                        focus:outline-none focus:ring-2 focus:ring-blue-500
                    `}
                    title={inCompare ? 'Remove from comparison' : 'Add to comparison'}
                >
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-5 h-5"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                        />
                    </svg>
                </button>
                {showTooltip && (
                    <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50">
                        {inCompare ? 'Removed!' : 'Added!'}
                    </div>
                )}
            </div>
        );
    }

    return (
        <div className="relative">
            <button
                onClick={handleClick}
                className={`
                    ${sizeClasses[size]}
                    ${variantClasses[variant]}
                    rounded-lg font-medium
                    transition-all duration-200
                    flex items-center gap-2
                    focus:outline-none focus:ring-2 focus:ring-blue-500
                `}
            >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z"
                    />
                </svg>
                <span>{inCompare ? 'Remove' : 'Compare'}</span>
            </button>
            {showTooltip && (
                <div className="absolute top-full mt-2 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white text-xs px-3 py-1 rounded shadow-lg whitespace-nowrap z-50">
                    {inCompare ? 'Removed from comparison!' : 'Added to comparison!'}
                </div>
            )}
        </div>
    );
};

export default CompareButton;
