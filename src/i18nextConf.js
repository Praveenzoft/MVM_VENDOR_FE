import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import Backend from 'i18next-xhr-backend';
import LanguageDetector from 'i18next-browser-languagedetector';


//For adding new languages, follow the below steps
//1 => Add translated JSON into ./assets/locale/{Language Code}/translations.json file
//2 => Add language code in "availableLanguages" array
//3 => Import the translations.json 
//4 => Add new language into "resources" JSON


const fallbackLng        = ['en'];
const availableLanguages = ['en', 'ar', 'fr'];


import translationEN from "./assets/locale/en/translations.json";
import translationAR from "./assets/locale/ar/translations.json";


const resources = {
  en: {
    translation: translationEN
  },
  ar: {
    translation: translationAR
  }  
};


i18n
  .use(Backend) // load translations using http (default public/assets/locale/en/translations)
  .use(LanguageDetector) // detect user language
  .use(initReactI18next) // pass the i18n instance to react-i18next.
  .init({
  	resources,
    fallbackLng, // fallback language is english.

    detection: {
      checkWhitelist: true, // options for language detection
    },

    debug: false,

    whitelist: availableLanguages,

    interpolation: {
      escapeValue: false, // no need for react. it escapes by default
    },
  });

export default i18n;