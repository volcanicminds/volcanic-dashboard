import dayjs from "dayjs";
import { FC, ReactNode, useEffect, useMemo, useRef, useState } from "react";
import i18next from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import Loader from "@/components/Loader";
import { init } from "@/configuration";
import { FALLBACK_LANGUAGE } from "@/utils/constants";
import Button from "@/components/common/Button";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { t } from "i18next";
import Italian from "@/lang/it.json";
import English from "@/lang/en.json";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { itIT, enUS } from "@mui/x-date-pickers/locales";

type TranslationType = {
  [locale: string]: any;
};

export const InitConfig: FC<{ children: ReactNode }> = ({ children }) => {
  const [is18nInitialized, setIs18nInitialized] = useState(false);
  const [open, setOpen] = useState(false);
  const [isLoadingGeneral, setIsLoadingGeneral] = useState(false);
  const [currentLanguage, setCurrentLanguage] = useState<string | undefined>(
    i18next.language
  );
  const schedulerDialogAlreadyOpened = useRef(false);
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
          setIs18nInitialized(true);
        });
    }
  }, [currentLanguage]);

  useEffect(() => {
    if (is18nInitialized) {
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
  }, [core, config, is18nInitialized, currentLanguage]);

  useEffect(() => {
    setCurrentLanguage(i18next.language || FALLBACK_LANGUAGE);
    setIsLoadingGeneral(true);
    try {
      const translations = init();
      setConfig(translations);
    } catch (error) {
      console.error("Cannot init the general configuration", error);
    } finally {
      setIsLoadingGeneral(false);
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

  useEffect(() => {
    if (is18nInitialized && !schedulerDialogAlreadyOpened.current) {
      schedulerDialogAlreadyOpened.current = true;
      setOpen(true);
    }
  }, [is18nInitialized]);

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const isLanguageInitialized = useMemo(() => {
    return is18nInitialized && core && config;
  }, [is18nInitialized, core, config]);

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
      {(!is18nInitialized || isLoadingGeneral) && (
        <Loader page source="init-config" />
      )}
      {isLanguageInitialized && children}
      {isLanguageInitialized && children}
      {!isLanguageInitialized && children}
      {!isLanguageInitialized && children}
      <Dialog onClose={handleCloseDialog} open={open}>
        <DialogTitle
          sx={{
            fontSize: "1.2rem",
          }}
        >
          {t("warning")}
        </DialogTitle>
        <DialogContent>{t("prg-active-warning")}</DialogContent>
        <DialogActions>
          <Button variant="contained" onClick={handleCloseDialog}>
            {t("ok")}
          </Button>
        </DialogActions>
      </Dialog>
    </LocalizationProvider>
  );
};
