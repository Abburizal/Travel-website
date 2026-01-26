import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const useCompare = () => {
    const context = useContext(CompareContext);
    if (!context) {
        throw new Error('useCompare must be used within CompareProvider');
    }
    return context;
};

export const CompareProvider = ({ children }) => {
    const [compareTours, setCompareTours] = useState([]);
    const MAX_COMPARE = 3;

    // Load from localStorage on mount
    useEffect(() => {
        const stored = localStorage.getItem('compareTours');
        if (stored) {
            try {
                const parsed = JSON.parse(stored);
                setCompareTours(parsed);
            } catch (error) {
                console.error('Error loading compare tours:', error);
            }
        }
    }, []);

    // Save to localStorage on change
    useEffect(() => {
        localStorage.setItem('compareTours', JSON.stringify(compareTours));
    }, [compareTours]);

    const addToCompare = (tour) => {
        if (compareTours.length >= MAX_COMPARE) {
            return {
                success: false,
                message: `Maximum ${MAX_COMPARE} tours can be compared`
            };
        }

        if (compareTours.find(t => t.id === tour.id)) {
            return {
                success: false,
                message: 'Tour already in comparison'
            };
        }

        setCompareTours([...compareTours, tour]);
        return {
            success: true,
            message: 'Tour added to comparison'
        };
    };

    const removeFromCompare = (tourId) => {
        setCompareTours(compareTours.filter(t => t.id !== tourId));
    };

    const clearCompare = () => {
        setCompareTours([]);
    };

    const isInCompare = (tourId) => {
        return compareTours.some(t => t.id === tourId);
    };

    const canAddMore = () => {
        return compareTours.length < MAX_COMPARE;
    };

    return (
        <CompareContext.Provider
            value={{
                compareTours,
                addToCompare,
                removeFromCompare,
                clearCompare,
                isInCompare,
                canAddMore,
                compareCount: compareTours.length,
                maxCompare: MAX_COMPARE
            }}
        >
            {children}
        </CompareContext.Provider>
    );
};
