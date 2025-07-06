import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import deTranslation from "./locales/de/translation.json";
import enTranslation from "./locales/en/translation.json";
import svTranslation from "./locales/sv/translation.json";
import jaTranslation from "./locales/ja/translation.json";

const resources = {
  en: {
    translation: enTranslation,
  },
  de: {
    translation: deTranslation,
  },
  sv: {
    translation: svTranslation,
  },
  ja: {
    translation: jaTranslation,
  },
};

i18n
  .use(initReactI18next)
  .init({
    resources,
    lng: "ja",
    fallbackLng: "en",
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;