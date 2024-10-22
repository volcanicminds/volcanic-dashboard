import homePage from "@/configuration/pages/home";
import tablePage from "@/configuration/pages/tables";
import multistepPage from "@/configuration/pages/multistep";
import { NavigationLeaf, NavigationNode } from "@/configuration/types";

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
      {
        id: "multisptep",
        path: "/multistep/:step",
        config: multistepPage,
      },
    ],
  },
];

export default navigation;
