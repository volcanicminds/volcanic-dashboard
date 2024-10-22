import { Stack, Typography, Box } from "@mui/material";
import { t } from "i18next";
import LinearProgressWithLabel from "@/components/common/LinearProgressWithLabel";
import { DataField } from "@/types";
import { useMemo } from "react";
import SimpleCard from "@/components/common/SimpleCard";

interface ProgressBarsInterface {
  title: string;
  dataFields: DataField[];
}

type ProgressBar = {
  value: number;
  label: string;
};

export default function ProgressBars({
  title,
  dataFields: fields = [],
}: ProgressBarsInterface) {
  const values = useMemo(
    () => fields.map((field) => field.data as ProgressBar).flat(),
    [fields]
  );

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Stack direction="column" sx={{ width: "100%" }}>
        {values.map((valueItem, index) => {
          const value = valueItem.value;
          const label = t(valueItem.label);

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
      </Stack>
    </SimpleCard>
  );
}
