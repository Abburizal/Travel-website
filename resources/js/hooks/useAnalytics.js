import ReactGA from 'react-ga4';

// Initialize GA4 once
const GA_MEASUREMENT_ID = import.meta.env.VITE_GA_MEASUREMENT_ID;
let isInitialized = false;

export const initializeAnalytics = () => {
    if (!GA_MEASUREMENT_ID) {
        console.warn('GA4 Measurement ID not found in environment variables');
        return;
    }
    
    if (!isInitialized) {
        ReactGA.initialize(GA_MEASUREMENT_ID);
        isInitialized = true;
        console.log('✅ Google Analytics 4 initialized');
    }
};

export const useAnalytics = () => {
    // Track page views
    const trackPageView = (path, title) => {
        if (!isInitialized) return;
        
        ReactGA.send({
            hitType: 'pageview',
            page: path,
            title: title
        });
    };

    // Track custom events
    const trackEvent = (category, action, label, value) => {
        if (!isInitialized) return;
        
        ReactGA.event({
            category,
            action,
            label,
            value
        });
    };

    // Specific tracking functions
    const trackTourView = (tourId, tourName) => {
        trackEvent('Tour', 'View', tourName, tourId);
    };

    const trackSearch = (query) => {
        trackEvent('Search', 'Query', query);
    };

    const trackFilter = (filterType, filterValue) => {
        trackEvent('Filter', filterType, filterValue);
    };

    const trackBookingStart = (tourId, tourName) => {
        trackEvent('Booking', 'Start', tourName, tourId);
    };

    const trackBookingComplete = (tourId, amount) => {
        trackEvent('Booking', 'Complete', `Tour ${tourId}`, amount);
    };

    const trackPaymentSuccess = (bookingId, amount) => {
        trackEvent('Payment', 'Success', `Booking ${bookingId}`, amount);
    };

    const trackPaymentFailure = (bookingId, reason) => {
        trackEvent('Payment', 'Failure', reason, bookingId);
    };

    const trackReviewSubmit = (tourId, rating) => {
        trackEvent('Review', 'Submit', `Tour ${tourId}`, rating);
    };

    const trackWishlistAdd = (tourId, tourName) => {
        trackEvent('Wishlist', 'Add', tourName, tourId);
    };

    const trackWishlistRemove = (tourId, tourName) => {
        trackEvent('Wishlist', 'Remove', tourName, tourId);
    };

    const trackCompareAdd = (tourId, tourName) => {
        trackEvent('Compare', 'Add', tourName, tourId);
    };

    const trackCompareRemove = (tourId, tourName) => {
        trackEvent('Compare', 'Remove', tourName, tourId);
    };

    const trackSocialShare = (platform, tourId, tourName) => {
        trackEvent('Social', `Share_${platform}`, tourName, tourId);
    };

    return {
        trackPageView,
        trackEvent,
        trackTourView,
        trackSearch,
        trackFilter,
        trackBookingStart,
        trackBookingComplete,
        trackPaymentSuccess,
        trackPaymentFailure,
        trackReviewSubmit,
        trackWishlistAdd,
        trackWishlistRemove,
        trackCompareAdd,
        trackCompareRemove,
        trackSocialShare
    };
};
