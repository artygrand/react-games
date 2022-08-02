import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import { initReactI18next } from 'react-i18next';

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .init({
        fallbackLng: 'en',

        interpolation: {
            escapeValue: false, // react already safes from xss
        },

        // have a common namespace used around the full app
        ns: ['common'],
        defaultNS: 'common',
        fallbackNS: 'common',
    });

export default i18n;
