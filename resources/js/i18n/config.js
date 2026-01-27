import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import enTranslation from './locales/en.json';
import idTranslation from './locales/id.json';

i18n
    .use(LanguageDetector) // Detect user language
    .use(initReactI18next) // Pass i18n to react-i18next
    .init({
        resources: {
            en: {
                translation: enTranslation
            },
            id: {
                translation: idTranslation
            }
        },
        fallbackLng: 'id', // Default language
        lng: 'id', // Initial language
        debug: false, // Set to true for debugging
        
        interpolation: {
            escapeValue: false // React already escapes
        },
        
        detection: {
            // Order of language detection
            order: ['localStorage', 'navigator'],
            caches: ['localStorage'],
            lookupLocalStorage: 'i18nextLng'
        }
    });

export default i18n;
