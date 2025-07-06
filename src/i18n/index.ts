import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import deTranslation from "./locales/de/translation.json";
import enTranslation from "./locales/en/translation.json";
import jaTranslation from "./locales/ja/translation.json";
import svTranslation from "./locales/sv/translation.json";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
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
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    lng: "ja", // 変更
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    fallbackLng: "en", // 変更
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
