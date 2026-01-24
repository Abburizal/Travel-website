import React from 'react';

export default function StarRating({ rating, size = 'md', showNumber = false, editable = false, onChange }) {
    const sizes = {
        sm: 'text-sm',
        md: 'text-xl',
        lg: 'text-3xl',
        xl: 'text-4xl',
    };

    const sizeClass = sizes[size] || sizes.md;

    const handleClick = (value) => {
        if (editable && onChange) {
            onChange(value);
        }
    };

    return (
        <div className="flex items-center gap-1">
            {[1, 2, 3, 4, 5].map((star) => (
                <button
                    key={star}
                    type="button"
                    onClick={() => handleClick(star)}
                    disabled={!editable}
                    className={`${sizeClass} ${
                        star <= rating
                            ? 'text-yellow-400'
                            : 'text-gray-300'
                    } ${
                        editable
                            ? 'cursor-pointer hover:scale-110 transition-transform'
                            : 'cursor-default'
                    }`}
                >
                    {star <= rating ? '★' : '☆'}
                </button>
            ))}
            {showNumber && (
                <span className="ml-2 text-gray-600 font-medium">
                    {rating.toFixed(1)}
                </span>
            )}
        </div>
    );
}
