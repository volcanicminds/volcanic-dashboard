import {
  Context,
  createContext,
  ReactNode,
  useEffect,
  useMemo,
  useState,
} from "react";
import { CssBaseline, StyledEngineProvider } from "@mui/material";
import { createTheme, Theme, ThemeProvider } from "@mui/material/styles";
import { deepmerge } from "@mui/utils";
import i18next from "i18next";
import { enUS, itIT } from "@mui/material/locale";
import { DEFAULT_THEME_NAME } from "@/utils/constants";
import { initTheme } from "@/configuration";

type ThemeType = { name: string; theme: Theme };

type ThemesContextType = {
  [key: string]: Theme;
};

export const ThemesContext: Context<ThemesContextType> = createContext({});

export default function ThemeCustomization({
  children,
}: {
  children: ReactNode;
}) {
  const [configThemes, setConfigThemes] = useState<ThemeType[] | null>(null);

  useEffect(() => {
    initTheme && setConfigThemes(initTheme(i18next));
  }, []);

  const defaultTheme = useMemo(
    () =>
      createTheme(
        {},
        ["it-IT", "it", "IT", "ita"].includes(i18next.language) ? itIT : enUS
      ),
    [i18next.language]
  );

  const muiThemes = useMemo(() => {
    let mergedConfigThemes = [] as ThemeType[];
    if (configThemes) {
      mergedConfigThemes = configThemes.map((item) => {
        const mergedThemeOptions = deepmerge(defaultTheme, item.theme);

        return {
          name: item.name,
          theme: createTheme(mergedThemeOptions),
        };
      });
    }
    mergedConfigThemes.push({
      name: DEFAULT_THEME_NAME,
      theme: defaultTheme,
    });

    return mergedConfigThemes;
  }, [defaultTheme, configThemes, i18next.language]);

  const defaultMergedTheme = useMemo(() => {
    const lightTheme = muiThemes.find((theme) => theme.name.includes("light"));

    return lightTheme ? lightTheme.theme : defaultTheme;
  }, [muiThemes, defaultTheme]);

  const remappedMergedThemesForContext = useMemo(() => {
    const themes = {} as ThemesContextType;
    muiThemes.forEach((theme) => {
      themes[theme.name] = theme.theme;
    });

    return themes;
  }, [muiThemes]);

  return (
    <StyledEngineProvider injectFirst>
      <ThemeProvider theme={defaultMergedTheme}>
        <CssBaseline />
        <ThemesContext.Provider value={remappedMergedThemesForContext}>
          {children}
        </ThemesContext.Provider>
      </ThemeProvider>
    </StyledEngineProvider>
  );
}
