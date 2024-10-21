import { Stack } from "@mui/material";
import React, { useMemo } from "react";

const DEFAULT_COLUMN_NUMBER = 2;
const DEFAULT_COLUMN_WEIGHT = 1;
const DEFAULT_COLUMN_SPACE = 2;
const DEFAULT_ROW_SPACE = 2;
export const DATA_COLUMMS_PROP_NAME = "data-column";

interface ColumnsComponentProps {
  columnNumber?: number;
  rowSpacing?: number;
  columnWeights?: number[];
  columnSpaces?: number[];
  children: React.ReactNode;
}

const ColumnsComponent: React.FC<ColumnsComponentProps> = ({
  //Children components must have a data-column prop to be inserted in the correct column
  children = [],
  columnNumber = DEFAULT_COLUMN_NUMBER,
  columnWeights = [],
  columnSpaces = [DEFAULT_COLUMN_SPACE, DEFAULT_COLUMN_SPACE],
  rowSpacing = DEFAULT_ROW_SPACE,
}) => {
  const weights = useMemo(() => {
    if (columnWeights && columnWeights.length === columnNumber) {
      return columnWeights;
    }
    return Array.from({ length: columnNumber }).map(
      () => DEFAULT_COLUMN_WEIGHT
    );
  }, [columnNumber, columnWeights]);

  const columns = useMemo(() => {
    const cols = Array.from({ length: columnNumber }).map(
      () => [] as React.ReactNode[]
    );
    React.Children.forEach(children, (child) => {
      if (
        React.isValidElement(child) &&
        child.props[DATA_COLUMMS_PROP_NAME] != null &&
        cols[child.props[DATA_COLUMMS_PROP_NAME]] != null
      ) {
        cols[child.props[DATA_COLUMMS_PROP_NAME]].push(child);
      } else {
        console.warn(
          `ColumnsComponent: child is not a valid element or does not have a ${DATA_COLUMMS_PROP_NAME} prop`
        );
      }
    });
    return cols;
  }, [children, columnNumber]);

  return (
    <Stack direction="row" spacing={rowSpacing}>
      {columns.map((item, index) => (
        <Stack
          direction="column"
          key={index}
          flex={weights[index]}
          spacing={columnSpaces[index] || DEFAULT_COLUMN_SPACE}
        >
          {item}
        </Stack>
      ))}
    </Stack>
  );
};

export default ColumnsComponent;
