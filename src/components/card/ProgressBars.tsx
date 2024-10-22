import { Stack, Typography, Box, Skeleton } from "@mui/material";
import { t } from "i18next";
import LinearProgressWithLabel from "@/components/common/LinearProgressWithLabel";

interface ProgressBarsInterface {
  isLoading: boolean;
  values: {
    label?: string;
    translationId?: string;
    value: number;
  }[];
}

export default function ProgressBars(props: ProgressBarsInterface) {
  const { isLoading, values } = props;
  return (
    <Stack direction="column">
      {!isLoading &&
        values.map((valueItem, index) => {
          const value = valueItem.value;
          const label = valueItem.label
            ? valueItem.label
            : valueItem.translationId
            ? t(valueItem.translationId)
            : "";
          return (
            <Stack
              key={`progress-bars-${index}`}
              direction="row"
              alignItems="center"
              marginY={1}
            >
              <Typography width="150px" marginRight={3}>
                {label}
              </Typography>
              <Box flexGrow={1}>
                <LinearProgressWithLabel value={value} />
              </Box>
            </Stack>
          );
        })}
      {isLoading &&
        [...Array(6)].map((_, index) => {
          return (
            <Skeleton
              key={`partner-${index}`}
              variant="text"
              sx={{ fontSize: "1rem", width: "100%" }}
            />
          );
        })}
    </Stack>
  );
}
