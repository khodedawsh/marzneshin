import dayjs from 'dayjs';
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpApi from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';
import { joinPaths } from '@remix-run/router';

declare module 'i18next' {
    interface CustomTypeOptions {
        returnNull: false;
    }
}

i18n
    .use(LanguageDetector)
    .use(initReactI18next)
    .use(HttpApi)
    .init(
        {
            debug: import.meta.env.NODE_ENV === 'development',
            returnNull: false,
            fallbackLng: 'en',
            interpolation: {
                escapeValue: false,
            },
            react: {
                useSuspense: false,
            },
            load: 'languageOnly',
            detection: {
                caches: ['localStorage', 'sessionStorage', 'cookie'],
            },
            backend: {
                loadPath: joinPaths([import.meta.env.BASE_URL, 'locales/{{lng}}.json']),
            },
            supportedLngs: ['en', 'ku-kur', 'ku-sor', 'ku-sor-latin', 'fa', 'ru'],
        },
        function() {
            dayjs.locale(i18n.language);
        }
    );

i18n.on('languageChanged', (lng) => {
    dayjs.locale(lng);
});

export default i18n;
