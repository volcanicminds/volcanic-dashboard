import { useMemo } from "react";
import type { Preview } from "@storybook/react";
import { Theme } from "@mui/material/styles";
import { createTheme, CssBaseline, ThemeProvider } from "@mui/material";
import {
  componentsCustomization,
  baseThemes,
  typographies,
} from "../src/configuration";

import "./i18n";
import i18next from "i18next";
import React from "react";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";

i18next.addResourceBundle(
  "it",
  "translation",
  {
    id: "ID",
    timestamp: "Data",
    "none-btn": "Nessuno",
    all: "Tutti",
    "not-online": "Non online",
  },
  true,
  true
);
i18next.addResourceBundle(
  "en",
  "translation",
  {
    id: "ID",
    timestamp: "Date",
    "none-btn": "None",
    all: "All",
    "not-online": "Not online",
  },
  true,
  true
);

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      values: [
        { name: "Dark", value: "#333" },
        { name: "Light", value: "#F7F9F2" },
      ],
    },
    tags: ["autodocs"],
  },

  initialGlobals: {
    backgrounds: { value: "light" },
  },
};

export const withMuiTheme = (Story, context) => {
  const { theme: themeKey } = context.globals;

  const theme = useMemo(() => baseThemes[themeKey] as Theme, [themeKey]);
  const overrideTypography = useMemo(
    () =>
      (
        typographies as {
          [key: string]: any;
        }
      )[themeKey],

    [typographies, themeKey]
  );

  const themeOptions = useMemo(
    () => ({
      palette: theme.palette,
      typography: overrideTypography,
    }),
    [theme, overrideTypography]
  );

  const muiTheme = createTheme(themeOptions);
  muiTheme.components = componentsCustomization(themeKey, muiTheme);

  return (
    <ThemeProvider theme={muiTheme}>
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <CssBaseline />
        <Story />
      </LocalizationProvider>
    </ThemeProvider>
  );
};

export const decorators = [withMuiTheme];

export const globalTypes = {
  theme: {
    name: "Theme",
    title: "Theme",
    description: "Theme for your components",
    defaultValue: "mytheme",
    toolbar: {
      icon: "paintbrush",
      dynamicTitle: true,
      items: [{ value: "mytheme", title: "My Theme" }],
    },
  },
};

export default preview;
