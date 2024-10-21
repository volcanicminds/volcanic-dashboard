import homePage from "./pages/home";
import tablePage from "./pages/tables";
import { NavigationLeaf, NavigationNode } from "./types";

export const isNavigationNode = (
  item: NavigationNode | NavigationLeaf
): item is NavigationNode => {
  return "subItems" in item;
};

export const isNavigationLeaf = (
  item: NavigationNode | NavigationLeaf
): item is NavigationLeaf => {
  return "path" in item && "page" in item && "config" in item;
};

const navigation: Array<NavigationNode | NavigationLeaf> = [
  {
    id: "home",
    path: "",
    config: homePage,
    icon: "Home",
  },
  {
    id: "subsection",
    path: "subsection",
    icon: "FormatListBulleted",
    subItems: [
      {
        id: "table",
        path: "table",
        config: tablePage,
      },
    ],
  },
];

export default navigation;
