import { Grid } from "@mui/material";
import React, { useMemo } from "react";

const DEFAULT_SPACING = 3;

interface GridDimensions {
  xs?: number;
  sm?: number;
  md?: number;
  lg?: number;
  xl?: number;
}

interface GridComponentProps {
  children: React.ReactNode;
  numItems?: number;
  gridDimensions?: GridDimensions[];
  gridSpacing?: number;
}

const GridComponent: React.FC<GridComponentProps> = ({
  children = [],
  gridDimensions = [],
  gridSpacing = DEFAULT_SPACING,
}) => {
  const childrenLength = useMemo(
    () => React.Children.count(children) || 1,
    [children]
  );

  const getChild = (index: number) => {
    return (
      ((children as Array<React.ReactNode>) || [])[index] || children || null
    );
  };

  return (
    <Grid container spacing={gridSpacing}>
      {Array.from({ length: childrenLength }).map((_, index) => {
        const dimensions = (gridDimensions || [])[index] || {};

        return (
          <Grid
            display="flex"
            item
            xs={dimensions.xs}
            sm={dimensions.sm}
            md={dimensions.md}
            lg={dimensions.lg}
            xl={dimensions.xl}
            key={index}
          >
            {getChild(index)}
          </Grid>
        );
      })}
    </Grid>
  );
};

export default GridComponent;
