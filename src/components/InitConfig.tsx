import dayjs from "dayjs";
import { FC, ReactNode, useEffect, useMemo, useState } from "react";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Loader from "@/components/Loader";
import { init } from "@/configuration";
import { FALLBACK_LANGUAGE } from "@/utils/constants";
import Italian from "@/lang/it.json";
import English from "@/lang/en.json";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { itIT, enUS } from "@mui/x-date-pickers/locales";

type TranslationType = {
  [locale: string]: any;
};

export const InitConfig: FC<{ children: ReactNode }> = ({ children }) => {
  const [currentLanguage, setCurrentLanguage] = useState<string | undefined>(
    i18next.language
  );
  const [isI18nInitialized, setIsI18nInitialized] = useState(false);
  const core: TranslationType = useMemo(
    () => ({
      it: Italian,
      en: English,
    }),
    []
  );
  const [config, setConfig] = useState<TranslationType | undefined>();

  const setDayjsLocale = async (locale: string) => {
    const it = await import("dayjs/locale/it.js");
    // const en = await import("dayjs/locale/en.js");
    const fr = await import("dayjs/locale/fr.js");
    const de = await import("dayjs/locale/de.js");
    const sl = await import("dayjs/locale/sl.js");

    if (locale === "it") {
      dayjs.locale(it);
    } else if (locale === "en") {
      dayjs.locale(FALLBACK_LANGUAGE);
    } else if (locale === "fr") {
      dayjs.locale(fr);
    } else if (locale === "de") {
      dayjs.locale(de);
    } else if (locale === "sl") {
      dayjs.locale(sl);
    } else {
      console.warn(
        `Locale ${locale} not supported, falling back to '${FALLBACK_LANGUAGE}'`
      );
      dayjs.locale(FALLBACK_LANGUAGE);
    }
  };

  useEffect(() => {
    const language = currentLanguage || FALLBACK_LANGUAGE;
    setDayjsLocale(language);
    if (!i18next.isInitialized) {
      i18next
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          debug: false,
          fallbackLng: language,

          interpolation: {
            escapeValue: false, // not needed for react as it escapes by default
          },
        } as any)
        .then(() => {
          setIsI18nInitialized(i18next.isInitialized);
        });
    }
  }, [currentLanguage, isI18nInitialized]);

  useEffect(() => {
    if (i18next.isInitialized) {
      const language = currentLanguage || i18next.language || FALLBACK_LANGUAGE;

      i18next.addResourceBundle(
        language,
        "translation",
        core[language] || {},
        true,
        true
      );

      config &&
        i18next.addResourceBundle(
          language,
          "translation",
          config[language] || {},
          true,
          true
        );
    }
  }, [core, config, currentLanguage]);

  useEffect(() => {
    setCurrentLanguage(i18next.language || FALLBACK_LANGUAGE);
    try {
      const translations = init();
      setConfig(translations);
    } catch (error) {
      console.error("Cannot init the general configuration", error);
    }
  }, []);

  const isIta = useMemo(
    () => ["it-IT", "it", "IT", "ita"].includes(currentLanguage || ""),
    [currentLanguage]
  );
  const isEn = useMemo(
    () =>
      [
        "en-US",
        "en",
        "EN",
        "en-GB",
        "en-AU",
        "en-CA",
        "en-NZ",
        "en-IN",
        "eng",
      ].includes(currentLanguage || ""),
    [currentLanguage]
  );

  const { adapterLocale, localeText } = useMemo(() => {
    const adapterLocale = isIta ? "it" : isEn ? "en" : FALLBACK_LANGUAGE;

    const localeText = isIta
      ? itIT.components.MuiLocalizationProvider.defaultProps.localeText
      : isEn
      ? enUS.components.MuiLocalizationProvider.defaultProps.localeText
      : enUS.components.MuiLocalizationProvider.defaultProps.localeText;

    return {
      adapterLocale,
      localeText,
    };
  }, [isIta, isEn]);

  return (
    <LocalizationProvider
      dateAdapter={AdapterDayjs}
      adapterLocale={adapterLocale}
      localeText={localeText}
    >
      {!isI18nInitialized && <Loader page />}
      {isI18nInitialized && children}
    </LocalizationProvider>
  );
};
