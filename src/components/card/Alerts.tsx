import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import DoneIcon from "@mui/icons-material/Done";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DataGroup from "@/components/common/DataGroup";
import { DataField } from "@/types";

interface AlertsProps {
  title: string;
  dataFields: DataField & { id: string }[];
}

type Alerts = {
  ok: boolean;
  text: string;
}[];

export default function Alerts({ title, dataFields: fields }: AlertsProps) {
  const alerts: Alerts = useMemo(() => {
    const allFields = fields
      .map((field) => {
        return (field as DataField & { id: string }).data;
      })
      .flat();

    const alerts = allFields.map((field) => {
      return {
        ok: field.ok,
        text: field.text,
      };
    });

    return alerts;
  }, [fields]);

  const isOk = useMemo(() => {
    return alerts.every((alert) => alert.ok);
  }, [alerts]);

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Stack direction="column" spacing={1}>
        {isOk && (
          <Stack direction="row" spacing={1}>
            <Stack position="relative">
              <Box
                position="absolute"
                left={0}
                top={0}
                width="35px"
                height="35px"
                borderRadius="50%"
                zIndex={-1}
                className="pulse-green"
              />
              <DoneIcon fontSize="large" />
            </Stack>
            <Typography pt={1} lineHeight={1.3} fontWeight={700}>
              {t("all-ok")}
            </Typography>
          </Stack>
        )}
        {!isOk && (
          <Stack direction="row" spacing={1}>
            <Stack position="relative">
              <Box
                position="absolute"
                left={0}
                top={0}
                width="35px"
                height="35px"
                borderRadius="50%"
                zIndex={-1}
                className="pulse-red"
              />
              <WarningAmberIcon fontSize="large" />
            </Stack>
            <DataGroup
              title={t("faults")}
              data={alerts
                .filter((alert) => !alert.ok)
                .map((alert, index) => (
                  <Typography
                    pt={1}
                    lineHeight={1.3}
                    key={`${Math.random()}-${index}`}
                    display="inline"
                  >
                    {alert.text}
                  </Typography>
                ))}
            />
          </Stack>
        )}
      </Stack>
    </SimpleCard>
  );
}
