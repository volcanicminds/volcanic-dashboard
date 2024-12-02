import { useEffect, useState } from "react";
import i18next from "i18next";

const useI18nEvents = () => {
  const [isI18nInitialized, setIsI18nInitialized] = useState(0);

  useEffect(() => {
    const handleLoaded = () => {
      setIsI18nInitialized(Math.random());
    };

    const handleAdded = () => {
      setIsI18nInitialized(Math.random());
    };

    i18next.on("loaded", handleLoaded);
    if (i18next.store) {
      i18next.store.on("added", handleAdded);
    }

    return () => {
      i18next.off("loaded", handleLoaded);
      if (i18next.store) {
        i18next.store.off("added", handleAdded);
      }
    };
  }, []);

  return isI18nInitialized;
};

export default useI18nEvents;
