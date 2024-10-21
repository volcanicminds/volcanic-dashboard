import init from "./general";
import navigation, { isNavigationNode, isNavigationLeaf } from "./navigation";
import componentsList from "./themes/componentsIndex";
import componentsCustomization from "./themes/components";
import baseThemes from "./themes/themeIndex";
import typographies from "./themes/typographies";
import initTheme from "./themes/index";
import { comboOptions, comboMiscOptions, RESET_TOAST_INTERVAL } from "./utils";

const pages = import.meta.glob("./pages/*.{ts,tsx}", { eager: true });

const images = import.meta.glob("./themes/mytheme/images/*", {
  eager: true,
});

// Esporta tutto sotto un unico namespace
export {
  init,
  images,
  RESET_TOAST_INTERVAL,
  componentsList,
  initTheme,
  componentsCustomization,
  baseThemes,
  typographies,
  pages,
  navigation,
  isNavigationNode,
  isNavigationLeaf,
  comboOptions,
  comboMiscOptions,
};
