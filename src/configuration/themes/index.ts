import { createTheme, Theme } from "@mui/material/styles";
import componentsCustomization from "@/configuration/themes/components";
import baseThemes from "@/configuration/themes/themeIndex";
import typographies from "@/configuration/themes/typographies";
import { i18n } from "i18next";
import { enUS, itIT } from "@mui/material/locale";

export const DEFAULT_THEME = import.meta.env.VITE_DEFAULT_THEME as string;

export default function getConfigurationTheme(i18next: i18n) {
  const themeToInstantiate = (
    baseThemes as {
      [key: string]: any;
    }
  )[DEFAULT_THEME];

  const themeLight: Theme = themeToInstantiate.default("light");
  const themeDark: Theme = themeToInstantiate.default("dark");

  const overrideTypography = (
    typographies as {
      [key: string]: any;
    }
  )[DEFAULT_THEME];

  const themeOptionsLight = {
    palette: themeLight.palette,
    typography: overrideTypography,
    components: componentsCustomization(DEFAULT_THEME, themeLight),
  };

  const mergedThemeLight = createTheme(
    themeOptionsLight,
    ["it-IT", "it", "IT", "ita"].includes(i18next.language) ? itIT : enUS
  );

  const themeOptionsDark = {
    palette: themeDark.palette,
    typography: overrideTypography,
    components: componentsCustomization(DEFAULT_THEME, themeDark),
  };

  const mergedThemeDark = createTheme(
    themeOptionsDark,
    ["it-IT", "it", "IT", "ita"].includes(i18next.language) ? itIT : enUS
  );

  return [
    { name: `${DEFAULT_THEME}-light`, theme: mergedThemeLight },
    { name: `${DEFAULT_THEME}-dark`, theme: mergedThemeDark },
  ];
}
