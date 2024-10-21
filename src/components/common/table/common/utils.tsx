import { ColumnCellFormatter, ConfigColumn, Primitive } from "@/types";
import { checkValue } from "@/utils/strings";
import dayjs from "dayjs";
import _ from "lodash";
import { t } from "i18next";
import { Chip, Grid } from "@mui/material";

const DEFAULT_DATE_FORMAT_IN = "DD-MM-YYYY HH:mm:ss";
const DEFAULT_DATE_FORMAT_OUT = "DD-MM-YYYY HH:mm:ss";

export function getFormattedValue({
  cellValue,
  column: c,
  commonData = {},
  row,
  tableIdField,
  customizableEndpoint,
  addNotification,
  refreshTable,
}: {
  row: any;
  cellValue: any;
  column: ConfigColumn;
  commonData: any;
  tableIdField: string;
  customizableEndpoint: (path: string, args?: any) => Promise<any>;
  addNotification: (message: string, options?: any) => any;
  refreshTable: () => void;
}) {
  let normalizedRenderedCellValue = cellValue;

  if (c.formatter) {
    if (c.formatter.type === "date" && typeof cellValue === "string") {
      const formatIn = c.formatter.formatIn || DEFAULT_DATE_FORMAT_IN;
      const formatOut = c.formatter.formatOut || DEFAULT_DATE_FORMAT_OUT;

      normalizedRenderedCellValue = dayjs(cellValue, formatIn).format(
        formatOut
      );
    } else if (c.formatter.type === "number") {
      normalizedRenderedCellValue = t("_-formatNumber", {
        val: Number(cellValue),
      });
    } else if (c.formatter.type === "boolean") {
      let calculatedCellValue = cellValue;

      if (c.formatter?.remapper) {
        calculatedCellValue = Boolean(c.formatter.remapper[cellValue]);
      } else {
        calculatedCellValue = checkValue(cellValue);
      }
      if (calculatedCellValue === true) {
        normalizedRenderedCellValue = t("yes");
      } else {
        normalizedRenderedCellValue = t("no");
      }
    } else if (!c.formatter.type || c.formatter.type === "text") {
      if (c.formatter?.remapper) {
        const remapped = c.formatter.remapper[cellValue];

        normalizedRenderedCellValue = remapped || cellValue;
      } else {
        normalizedRenderedCellValue = cellValue;
      }
    } else if (c.formatter.type === "context" && c.formatter.context) {
      const options = commonData[c.formatter.context] || [];
      const cellOption = options.find((o: any) => o.value === cellValue);
      normalizedRenderedCellValue = cellOption?.label ?? t("none");
    } else if (
      c.formatter.type === "translationLabel" &&
      c.formatter.rootLabel
    ) {
      normalizedRenderedCellValue = t(`${c.formatter.rootLabel}${cellValue}`);
    } else if (c.formatter.type === "fromList" && c.formatter.list) {
      const translationId = (c.formatter.list || []).find(
        (option) => option.value === cellValue
      )?.translationId;

      normalizedRenderedCellValue = t(translationId || "");
    } else if (c.formatter.type === "sectors") {
      normalizedRenderedCellValue = (
        <Grid container spacing={1}>
          {(cellValue || "").split("").map((sector: any, index: number) => {
            return sector === "1" ? (
              <Grid
                xs={4}
                item
                key={`sector_in_cell_${index}-${Math.random()}`}
              >
                <Chip label={index + 1} variant="filled" />
              </Grid>
            ) : null;
          })}
        </Grid>
      );
    } else if (c.formatter.type === "scenarios") {
      let scenario = null as any;
      if (commonData) {
        const scenarios = _.get(commonData, "scenarios") || [];
        scenario = scenarios.find((s: any) => s.value === cellValue)?.label;
      }
      normalizedRenderedCellValue = scenario ?? t("none");
    } else if (c.formatter.type === "custom" && c.formatter.renderFunction) {
      normalizedRenderedCellValue = c.formatter.renderFunction(
        cellValue,
        row.original,
        {
          commonData,
          get: (object: any, path: string) => _.get(object, path),
          t,
          tableIdField,
          customizableEndpoint,
          addNotification,
          refreshTable,
        }
      );
    }
  }

  return normalizedRenderedCellValue;
}

export function getPrintFormatterByType(formatter: ColumnCellFormatter):
  | ((
      cell: any,
      row: any,
      tools: {
        t: (key: string) => string;
        get: (object: any, path: string) => any;
        commonData: any;
        tableIdField: string;
      }
    ) => Primitive)
  | undefined {
  if (!formatter) {
    return undefined;
  }

  switch (formatter.type) {
    case "boolean":
      return (cell: any, _row: any, { t }: { t: (key: string) => string }) => {
        const normalizedValue = checkValue(cell);
        if (normalizedValue === true) {
          return t("yes");
        }
        return t("no");
      };
    case "sectors":
      return (cell: any) => {
        const sectorsArray = (cell || "").split("");
        return sectorsArray
          .map((sector: any, index: number) => {
            return sector === "1" ? index + 1 : null;
          })
          .filter((sector: any) => sector)
          .join(", ");
      };
    case "scenarios":
      return (
        cell: any,
        _row: any,
        { t, commonData }: { t: (key: string) => string; commonData: any }
      ) => {
        let scenario = null as any;
        if (commonData) {
          const scenarios = _.get(commonData, "scenarios") || [];
          scenario = scenarios.find((s: any) => s.value === cell)?.label;
        }
        return scenario ?? t("none");
      };
    case "context":
      return (
        cell: any,
        _row: any,
        { t, commonData }: { t: (key: string) => string; commonData: any }
      ) => {
        if (formatter.context) {
          const options = commonData[formatter.context] || [];
          const cellOption = options.find((o: any) => o.value === cell);
          return cellOption?.label ?? t("none");
        }
        return t("none");
      };
    case "translationLabel":
      return (cell: any, _row: any, { t }: { t: (key: string) => string }) =>
        t(`${formatter.rootLabel}${cell}`);
    case "fromList":
      return (cell: any, _row: any, { t }: { t: (key: string) => string }) => {
        const translationId = (formatter.list || []).find(
          (option) => option.value === cell
        )?.translationId;

        return t(translationId || "");
      };
    default:
      return undefined;
  }
}

export function sortingFnPrimitives(rowA: any, rowB: any, columnId: string) {
  const valueA = isNaN(rowA.original[columnId])
    ? rowA.original[columnId]
    : Number(rowA.original[columnId]);
  const valueB = isNaN(rowB.original[columnId])
    ? rowB.original[columnId]
    : Number(rowB.original[columnId]);

  if (valueA < valueB) {
    return -1;
  }
  if (valueA > valueB) {
    return 1;
  }

  return 0;
}
