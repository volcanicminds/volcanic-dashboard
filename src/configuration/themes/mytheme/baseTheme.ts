import { createTheme, PaletteMode } from "@mui/material";

declare module "@mui/material/styles" {
  interface Palette {
    tableButtons: Palette["primary"];
    bodyText: Palette["primary"];
    loginModalBg: Palette["primary"];
    loginText: Palette["primary"];
    hamburgerIcon: Palette["primary"];
    sidebarBg: Palette["primary"];
    sidebarText: Palette["primary"];
  }

  interface PaletteOptions {
    tableButtons?: PaletteOptions["primary"];
    bodyText?: PaletteOptions["primary"];
    loginModalBg?: PaletteOptions["primary"];
    loginText?: PaletteOptions["primary"];
    hamburgerIcon?: PaletteOptions["primary"];
    sidebarBg?: PaletteOptions["primary"];
    sidebarText?: PaletteOptions["primary"];
  }
}

export default function Palette(mode: PaletteMode) {
  const baseMuiTheme = createTheme();
  const baseMuiThemeDark = createTheme({
    palette: {
      mode: "dark",
    },
  });

  const white = "#ffffff";

  return {
    ...baseMuiTheme,
    palette: {
      ...(mode === "light"
        ? {
            ...baseMuiTheme.palette,
            primary: {
              main: "#1976d2",
              contrastText: white,
            },
            secondary: {
              main: white,
            },
            success: {
              main: "#2e7d32",
            },
            error: {
              main: "#d32f2f",
            },
            tableButtons: {
              main: white,
            },
            loginModalBg: {
              main: white,
            },
            loginText: {
              main: "rgba(0, 0, 0, 0.87)",
            },
            bodyText: {
              main: white,
            },
            hamburgerIcon: {
              main: white,
            },
            sidebarBg: {
              main: "#f5f5f5",
            },
            sidebarText: {
              main: "#757575",
            },
          }
        : {
            ...baseMuiThemeDark.palette,
            primary: {
              main: "#1976d2",
            },
            secondary: {
              main: white, //dark form fix
            },
            success: {
              main: "#2e7d32",
            },
            error: {
              main: "#d32f2f",
            },
            tableButtons: {
              main: white,
            },
            loginModalBg: {
              main: white,
            },
            loginText: {
              main: "rgba(0, 0, 0, 0.87)",
            },
            bodyText: {
              main: white,
            },
            hamburgerIcon: {
              main: white,
            },
            sidebarBg: {
              main: "#f5f5f5",
            },
            sidebarText: {
              main: "#757575",
            },
          }),
    },
  };
}
