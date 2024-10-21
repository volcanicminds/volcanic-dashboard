import { FC, ReactNode, useEffect, useMemo, useState } from "react";
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
  const core: TranslationType = useMemo(
    () => ({
      it: Italian,
      en: English,
    }),
    []
  );
  const [config, setConfig] = useState<TranslationType | undefined>();

  useEffect(() => {
    if (!i18next.isInitialized) {
      i18next
        .use(LanguageDetector)
        .use(initReactI18next)
        .init({
          debug: false,
          fallbackLng: currentLanguage || FALLBACK_LANGUAGE,

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
  }, [core, config, i18next.language, is18nInitialized, currentLanguage]);

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

  const handleCloseDialog = () => {
    setOpen(false);
  };

  const isLanguageInitialized = useMemo(() => {
    return is18nInitialized && core && config;
  }, [is18nInitialized, core, config]);

  return (
    <>
      {(!is18nInitialized || isLoadingGeneral) && <Loader page />}
      {isLanguageInitialized && children}
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
    </>
  );
};
