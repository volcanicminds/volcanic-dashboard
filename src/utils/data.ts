import {
  Data,
  DataField,
  DataFieldRemapper,
  PageData,
  PageDataField,
  Rule,
} from "@/types";
import _ from "lodash";
import { COMMON_DATA_FIELD, DEFAULT_ND } from "@/utils/constants";
import { PageDataContextType } from "@/page/page";

export function getStaticData(dataItems: PageData[] | Data[], key: string) {
  return dataItems
    .filter((data) => data.type === "static" && (data as any)[key])
    .map((data) => ({
      [(data as any)[key] as string]: data.dataFields,
    }));
}

export function getStaticDataFields(
  dataItems: PageData[] | Data[],
  key: string
) {
  return dataItems
    .filter((data) => data.type === "static")
    .flatMap((data) => data.dataFields as any[])
    .filter((field) => (field as any)[key])
    .map((field) => ({
      [(field as any)[key] as string]: field.data,
    }));
}

export function extractData(data: any, field: DataField | PageDataField) {
  const gotData = _.get(data, String(field.data));
  const alias =
    (field as DataField).alias ||
    (field as PageDataField).context ||
    DEFAULT_ND;

  return field.remapper && typeof field.remapper === "function"
    ? field.remapper(gotData, alias)
    : gotData;
}

export function isPolling(data: PageData | Data) {
  return !!data.config?.polling?.interval && data.type === "remote";
}

export function deduplicatePageDataFields(
  prevContextData: PageDataContextType,
  mappedData: {
    data: any;
    context?: string;
    remapper?: DataFieldRemapper;
  }[]
) {
  const commonData = prevContextData[COMMON_DATA_FIELD] || {};
  const dataFieldMap = new Map<string, PageDataField>(
    Object.entries(commonData)
  );

  // Add all data fields from mappedData to the map, overwriting any duplicates
  for (const dataField of mappedData.filter((data) => !!data)) {
    dataFieldMap.set(String(dataField.context), dataField.data);
  }

  //converts the Map variable dataFieldMap to a plain object
  return Object.fromEntries(dataFieldMap);
}

export function deduplicateComponentDataFields(
  prevDataFields: DataField[],
  mappedData: {
    label: string;
    data: any;
    timestamp: any;
    alias: string;
    remapper?: DataFieldRemapper;
    icon?: string;
    rules?: Rule[] | ((fields: string) => Rule[]);
  }[]
) {
  const dataFieldMap = new Map<string, DataField>();

  // Add all data fields from prevDataFields to the map
  for (const dataField of prevDataFields) {
    dataFieldMap.set(dataField.alias, dataField);
  }

  // Add all data fields from mappedData to the map, overwriting any duplicates
  for (const dataField of mappedData.filter((data) => !!data)) {
    const dataFieldIdString = { ...dataField, id: String(dataField.alias) };
    dataFieldMap.set(dataFieldIdString.id, dataFieldIdString);
  }

  // Convert the map values to an array
  return Array.from(dataFieldMap.values());
}

export function isWorkingOnline(online: boolean | undefined) {
  return online === undefined || online === true;
}

export function normalizedFieldsOrder(
  fields: DataField[],
  fieldsOrder: string[]
) {
  const fieldAliases = fields.map((field) => field.alias);
  const filteredFields = fieldsOrder.filter((alias) =>
    fieldAliases.includes(alias)
  );
  const missingFields = fieldAliases.filter(
    (alias) => !fieldsOrder.includes(alias)
  );

  return [...filteredFields, ...missingFields];
}
