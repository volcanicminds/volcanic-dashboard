import { Stack } from "@mui/material";
import React, { ReactNode, useMemo } from "react";

const DEFAULT_SPACING = 2;

interface StackComponentProps {
  spacing?: number;
  children: React.ReactNode;
}

const StackComponent: React.FC<StackComponentProps> = ({
  children = [],
  spacing = DEFAULT_SPACING,
}) => {
  const childrenLength = useMemo(
    () => React.Children.count(children) || 1,
    [children]
  );

  return (
    <Stack direction="column" spacing={spacing}>
      {Array.from({ length: childrenLength }).map((_, index) => {
        return (
          ((children as Array<ReactNode>) || [])[index] || children || null
        );
      })}
    </Stack>
  );
};

export default StackComponent;
