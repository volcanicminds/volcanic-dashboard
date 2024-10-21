export interface NavigationNode {
  id: string;
  path: string;
  subItems: Array<NavigationNode | NavigationLeaf>;
  icon?: string;
}
export interface NavigationLeaf {
  id: string;
  path: string;
  config: any;
  icon?: string;
}
declare module "urmet-anti-intrusion-alarm-config" {
  import { FC } from "react";
  import { NavigationNode, NavigationLeaf } from "./src/types";

  export { NavigationNode, NavigationLeaf };

  export function init(i18next: i18n): void;

  export const elkronImages: {
    [path: string]: any;
  };
  export const urmetImages: {
    [path: string]: any;
  };

  export const RESET_TOAST_INTERVAL: string;

  export const componentsList: {
    [key: string]: any;
  };

  export function initTheme(i18next: i18n): { name: string; theme: theme }[];

  export function componentsCustomization(themeName: string, theme: Theme): any;

  export const baseThemes: {
    [key: string]: Theme;
  };
  export const typographies: {
    [key: string]: any;
  };

  export function comboOptions(
    prefix: string,
    start: number,
    end: number
  ): {
    value: string;
    label?: string;
    translationId?: string;
  }[];

  export function comboMiscOptions(
    prefix: string,
    start: number,
    end: number
  ): {
    value: string;
    label?: string;
    translationId?: string;
  }[];

  export const pages: FC[];

  export const navigation: Array<NavigationNode | NavigationLeaf>;

  export function isNavigationNode(
    item: NavigationNode | NavigationLeaf
  ): boolean;

  export function isNavigationLeaf(
    item: NavigationNode | NavigationLeaf
  ): boolean;
}
