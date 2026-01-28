import { useState, useRef, useEffect } from 'react';
import { useCurrency } from '../hooks/useCurrency';

const CurrencySwitcher = () => {
    const { currency, setCurrency, exchangeRates } = useCurrency();
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    const currencies = [
        { code: 'IDR', name: 'Indonesian Rupiah', symbol: 'Rp' },
        { code: 'USD', name: 'US Dollar', symbol: '$' },
        { code: 'EUR', name: 'Euro', symbol: '€' }
    ];

    const currentCurrency = currencies.find(c => c.code === currency) || currencies[0];

    const changeCurrency = (currencyCode) => {
        setCurrency(currencyCode);
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <div className="relative" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                aria-label="Change Currency"
            >
                <span className="text-lg font-bold text-gray-700">{currentCurrency.symbol}</span>
                <span className="hidden md:inline text-sm font-medium text-gray-700">
                    {currentCurrency.code}
                </span>
                <svg 
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                    {currencies.map((curr) => (
                        <button
                            key={curr.code}
                            onClick={() => changeCurrency(curr.code)}
                            className={`w-full px-4 py-2 text-left flex items-center gap-3 hover:bg-blue-50 transition-colors ${
                                currentCurrency.code === curr.code ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                            }`}
                        >
                            <span className="text-xl font-bold w-6">{curr.symbol}</span>
                            <div className="flex-1">
                                <div className="font-medium">{curr.code}</div>
                                <div className="text-xs text-gray-500">{curr.name}</div>
                            </div>
                            {currentCurrency.code === curr.code && (
                                <svg className="w-5 h-5 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                            )}
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
};

export default CurrencySwitcher;
