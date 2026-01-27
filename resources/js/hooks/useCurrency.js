import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

// Exchange rates (can be replaced with API call later)
const EXCHANGE_RATES = {
    IDR: 1,
    USD: 0.000067, // 1 IDR = 0.000067 USD (approx 15,000 IDR = 1 USD)
    EUR: 0.000061  // 1 IDR = 0.000061 EUR (approx 16,400 IDR = 1 EUR)
};

export const useCurrency = () => {
    const { i18n } = useTranslation();
    const [currency, setCurrency] = useState('IDR');

    // Auto-set currency based on language
    useEffect(() => {
        if (i18n.language === 'en') {
            setCurrency('USD');
        } else {
            setCurrency('IDR');
        }
    }, [i18n.language]);

    const formatCurrency = (amount, targetCurrency = currency) => {
        // Convert IDR amount to target currency
        const convertedAmount = amount * EXCHANGE_RATES[targetCurrency];

        // Format based on currency
        switch (targetCurrency) {
            case 'IDR':
                return new Intl.NumberFormat('id-ID', {
                    style: 'currency',
                    currency: 'IDR',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0
                }).format(convertedAmount);
            
            case 'USD':
                return new Intl.NumberFormat('en-US', {
                    style: 'currency',
                    currency: 'USD',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(convertedAmount);
            
            case 'EUR':
                return new Intl.NumberFormat('de-DE', {
                    style: 'currency',
                    currency: 'EUR',
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2
                }).format(convertedAmount);
            
            default:
                return convertedAmount;
        }
    };

    const convert = (amount, from = 'IDR', to = currency) => {
        // Convert to IDR first, then to target currency
        const amountInIDR = amount / EXCHANGE_RATES[from];
        return amountInIDR * EXCHANGE_RATES[to];
    };

    return {
        currency,
        setCurrency,
        formatCurrency,
        convert,
        exchangeRates: EXCHANGE_RATES
    };
};
