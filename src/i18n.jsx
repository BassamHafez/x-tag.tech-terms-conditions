import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import arTranslate from "./scripts/ar.json";
import enTranslate from "./scripts/en.json";
import LanguageDetector from "i18next-browser-languagedetector";

const resources = {
  en: {
    translation: enTranslate,
  },
  ar: {
    translation: arTranslate,
  },
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    lng: localStorage.getItem("i18nextLng") || "en",

    interpolation: {
      escapeValue: false,
    },
    react: {
      useSuspense: false,
    },
  });

export default i18n;
