import _ from "lodash";
import { FormInput, FormInputRemapperObject, SelectOption } from "@/types";
import { Box } from "@mui/material";

export const STATUS_FIELD = "_response_status";
export const CONTEXT_FIELD = "__context__";
export const COMMON_DATA_FIELD = "__commonData__";
export const MAX_INPUT_LOGIC_ID = 320;
export const FALLBACK_LANGUAGE = "en";
export const RESET_TOAST_INTERVAL = 5 * 1000; // 5 seconds

export const IP_REGEX =
  /^(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)$/;

export function comboOptions(pfx: string, min: number, max: number) {
  const list = [] as SelectOption[];
  for (let i = min; i <= max; i++) {
    list.push({
      value: "" + i,
      translationId: pfx + i,
    });
  }
  return list;
}

export function comboMiscOptions(pfx: string, values: number[]) {
  const list = [] as SelectOption[];
  for (let i = 0; i < values.length; i++) {
    list.push({
      value: "" + values[i],
      translationId: pfx + values[i],
    });
  }
  return list;
}

export function enableIfSwitchHasValue(
  field: string,
  value: string | number | boolean,
  config: {
    values: any;
    inputs: FormInput[];
    config: {
      t: (key: string) => string;
      commonData: any;
      get: (object: any, path: string) => any;
      remapValue: (
        remapper: FormInputRemapperObject,
        value: string | number | boolean
      ) => string | number | boolean;
    };
  }
) {
  const enablingInput = config.inputs.find((input) => input.field === field);
  const remappedValue = enablingInput?.remapper?.out
    ? typeof enablingInput?.remapper?.out === "function"
      ? enablingInput?.remapper?.out(
          config.values[field],
          config.values,
          config.config
        )
      : config.config.remapValue(
          enablingInput?.remapper?.out,
          config.values[field]
        )
    : {
        false: "0",
        true: "1",
      };
  return remappedValue === value;
}

export function categoryRemapper(data: any = {}, additionalFields: any = {}) {
  const elementsArray = Object.keys(data).map((key) => {
    return {
      ...data[key],
      id: key,
      ...additionalFields,
    };
  });
  return elementsArray;
}

export function labelComma(translatedText: string, text: string) {
  return text.length > 0 ? ", " + translatedText : translatedText;
}

export const remapperSwitchValues = {
  in: {
    "0": false,
    "1": true,
  },
  out: {
    false: "0",
    true: "1",
  },
};

export const yellow = "#ffc901";
export const purple = "#8401ff";
export const white = "#ffffff";
export const lightBlue = "#2793db";
export const gray = "#7f7f7f";
export const green = "#06b200";
export const lightGreen = "#09ff00";
export const red = "#ff0000";
export const orange = "#ff7900";

export function getLed(color: string, cell: any) {
  return (
    <Box
      width="20px"
      height="20px"
      bgcolor={!!cell ? color : white}
      flex="none"
      sx={{
        margin: "1px",
      }}
    />
  );
}

export function scenarioDataRemapper(data: any = []) {
  return data.map((item: any) => {
    return {
      value: item.DT_RowId,
      label: item.description,
    };
  });
}

export function optionScenarios(
  _values: any,
  tools: { t: (key: string) => string; commonData: any }
) {
  const none = tools.t("none");
  const scenarios = tools.commonData[COMMON_DATA_FIELD]?.scenarios || [];

  return scenarios.map((scenarioOption: any) => ({
    label:
      scenarioOption.label !== none
        ? `SC${Number(scenarioOption.value) + 1} - ${scenarioOption.label}`
        : none,
    value: scenarioOption.value,
  }));
}
