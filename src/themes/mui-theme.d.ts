import { PaletteOptions, Palette } from "@mui/material/styles";

declare module "@mui/material/styles" {
  interface Palette {
    hamburgerIcon?: Palette["primary"];
    tableButtons?: Palette["primary"];
    sidebarBg?: Palette["primary"];
    sidebarText?: Palette["primary"];
    bodyText?: Palette["primary"];
  }
  interface PaletteOptions {
    hamburgerIcon?: PaletteOptions["primary"];
    tableButtons?: PaletteOptions["primary"];
    sidebarBg?: PaletteOptions["primary"];
    sidebarText?: PaletteOptions["primary"];
    bodyText?: PaletteOptions["primary"];
  }
}
