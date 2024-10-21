import { Theme } from "@emotion/react";
import { Card, CardContent, CardHeader, SxProps } from "@mui/material";
import { ReactNode } from "react";

type WidthType = string | { [key: string]: string };

interface CommonCardProps {
  title?: ReactNode;
  children?: ReactNode;
  sx?: SxProps<Theme>;
  fullHeight?: boolean;
  id?: string;
  className?: string;
  childrenYPadding?: number;
}

interface FullWidthProps extends CommonCardProps {
  fullWidth: boolean;
  width?: never;
}

interface WidthProps extends CommonCardProps {
  fullWidth?: never;
  width: WidthType;
}

type CardProps = FullWidthProps | WidthProps;

export default function SimpleCard({
  title,
  children,
  sx,
  fullWidth,
  fullHeight,
  id,
  width,
  className,
  childrenYPadding,
}: CardProps) {
  return (
    <Card
      sx={{
        width: fullWidth ? "100%" : width,
        height: fullHeight ? "100%" : undefined,
        maxWidth: "100%",
        ...sx,
      }}
      id={id}
      className={className}
    >
      {title && (
        <CardHeader title={title} titleTypographyProps={{ fontWeight: 700 }} />
      )}
      {children && (
        <CardContent
          children={children}
          sx={{
            py: childrenYPadding ? childrenYPadding : undefined,
            "&:last-child": {
              paddingBottom: childrenYPadding ? childrenYPadding : undefined,
            },
          }}
        />
      )}
    </Card>
  );
}
