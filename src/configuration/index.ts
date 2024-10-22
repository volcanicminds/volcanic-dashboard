import init from "@/configuration/general";
import navigation, { isNavigationNode, isNavigationLeaf } from "@/configuration/navigation";
import componentsList from "@/configuration/themes/componentsIndex";
import componentsCustomization from "@/configuration/themes/components";
import baseThemes from "@/configuration/themes/themeIndex";
import typographies from "@/configuration/themes/typographies";
import initTheme from "@/configuration/themes/index";
import { comboOptions, comboMiscOptions, RESET_TOAST_INTERVAL } from "@/configuration/utils";

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
