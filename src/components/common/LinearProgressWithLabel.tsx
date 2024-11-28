import {
  Box,
  LinearProgress,
  LinearProgressProps,
  Typography,
} from "@mui/material";
import { useMemo } from "react";

export default function LinearProgressWithLabel(
  props: LinearProgressProps & { value?: number } & { label?: string }
) {
  const label = useMemo(() => {
    if (props.label != null) return props.label;
    else if (props.value != null) return `${Math.round(props.value)}%`;
    else return "";
  }, [props.value]);

  return (
    <Box sx={{ display: "flex", alignItems: "center" }}>
      <Box sx={{ width: "100%", mr: 1 }}>
        <LinearProgress variant="determinate" {...props} />
      </Box>
      <Box sx={{ minWidth: 35 }}>
        <Typography variant="body2" sx={{ color: "text.secondary" }}>
          {label}
        </Typography>
      </Box>
    </Box>
  );
}
