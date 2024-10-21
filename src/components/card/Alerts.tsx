import { t } from "i18next";
import SimpleCard from "../common/SimpleCard";
import { useMemo } from "react";
import { Box, Stack, Typography } from "@mui/material";
import EngineeringIcon from "@mui/icons-material/Engineering";
import DoneIcon from "@mui/icons-material/Done";
import WarningAmberIcon from "@mui/icons-material/WarningAmber";
import DataGroup from "@/components/common/DataGroup";
import { DataField } from "@/types";

interface AlertsProps {
  title: string;
  dataFields: DataField[];
}

type Alerts = {
  [id: string]: {
    category: number;
    text: string;
  };
};

export default function Alerts({
  title,
  dataFields: fields = [],
}: AlertsProps) {
  const events: Alerts = useMemo(() => {
    const events = fields.find((f) => f.alias === "Events");
    if (events) {
      return events.data as Alerts;
    }
    return {};
  }, [fields]);

  const isMaintenanceMode = useMemo(() => {
    const maintenanceMode = fields.find(
      (f) => f.alias === "isMaintenanceModeActive"
    )?.data;

    return maintenanceMode === "TRUE";
  }, [fields]);

  const [faults, tampers] = useMemo(() => {
    const dspFaults = [] as { id: string; text: string }[];
    const dspTampers = [] as { id: string; text: string }[];
    Object.keys(events || {}).forEach((id) => {
      if (events[id].category === 4) {
        dspFaults.push({
          id,
          text: events[id].text,
        });
      } else if (events[id].category === 3) {
        dspTampers.push({
          id,
          text: events[id].text,
        });
      }
    });
    return [dspFaults, dspTampers];
  }, [events]);

  const isOk = useMemo(
    () => faults.length + tampers.length === 0,
    [faults, tampers]
  );

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Stack direction="column" spacing={1}>
        {isMaintenanceMode && (
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
              <EngineeringIcon fontSize="large" />
            </Stack>
            <Typography pt={1} lineHeight={1.3} fontWeight={700}>
              {t("home-maintenance")}
            </Typography>
          </Stack>
        )}

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
              {t("home-ok")}
            </Typography>
          </Stack>
        )}

        {faults?.length > 0 && (
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
              title={t("home-faults")}
              data={faults.map((fault, index) => (
                <Typography
                  pt={1}
                  lineHeight={1.3}
                  key={`${fault.id}-${index}`}
                  display="inline"
                >
                  {fault.text}
                  {index < faults.length - 1 ? ", " : ""}
                </Typography>
              ))}
            />
          </Stack>
        )}

        {tampers?.length > 0 && (
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
              title={t("home-tampers")}
              data={tampers.map((tamper, index) => (
                <Typography
                  pt={1}
                  lineHeight={1.3}
                  key={`${tamper.id}-${index}`}
                  display="inline"
                >
                  {tamper.text}
                  {index < tampers.length - 1 ? ", " : ""}
                </Typography>
              ))}
            />
          </Stack>
        )}
      </Stack>
    </SimpleCard>
  );
}
