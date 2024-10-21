import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import { FALLBACK_LANGUAGE } from "@/utils/constants";
import Italian from "@/lang/it.json";
import English from "@/lang/en.json";

i18next
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    debug: false,
    fallbackLng: FALLBACK_LANGUAGE,

    interpolation: {
      escapeValue: false, // not needed for react as it escapes by default
    },
    resources: {
      en: {
        translation: English,
      },
      it: {
        translation: Italian,
      },
    },
  } as any);

export default i18next;
