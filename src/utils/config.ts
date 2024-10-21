import { FormInputRemapperObject } from "@/types";

export const DRAWER_WIDTH = "275px";
export const DEFAULT_RESET_TOAST_TIME = 3 * 1000; // 3 seconds

export function remapValue(
  remapper: FormInputRemapperObject,
  value: string | number | boolean
) {
  return remapper[String(value)];
}

export function languageRemapper(value: number | string) {
  switch (value) {
    case 0:
    case "0":
      return "it";
    case 1:
    case "1":
      return "en";
    case 2:
    case "2":
      return "fr";
    case 3:
    case "3":
      return "de";
    case 4:
    case "4":
      return "sl";
    default:
      return "en";
  }
}
