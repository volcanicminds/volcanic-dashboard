import { t } from "i18next";
import SimpleCard from "../common/SimpleCard";
import { Alert, Grid, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { DataField } from "@/types";

interface VirtualInOutProps {
  title: string;
  dataFields: DataField[];
}

export default function VirtualInOut({
  title,
  dataFields: fields = [],
}: VirtualInOutProps) {
  const max = useMemo(() => {
    const max = fields.find((field) => field.alias === "max") || { data: 0 };
    return Number(max.data);
  }, [fields]);

  const ins = useMemo(() => {
    const inField = fields.find((field) => field.alias === "in") || { data: 0 };
    return Number(inField.data);
  }, [fields]);

  const outs = useMemo(() => {
    const out = fields.find((field) => field.alias === "out") || { data: 0 };
    return Number(out.data);
  }, [fields]);

  const count = useMemo(() => {
    return ins + outs;
  }, [ins, outs]);

  const free = useMemo(() => {
    return max - count;
  }, [count, max]);

  return (
    <SimpleCard title={t(title)} fullWidth>
      {max === 0 ? (
        <Alert severity="warning">{t("virtio-notload")}</Alert>
      ) : (
        <Stack spacing={1}>
          <Typography fontWeight={700} noWrap fontSize={14}>
            {t("vp-available")} {count}
            {t("vp-of")} {max}
          </Typography>
          <Grid container spacing={1}>
            <Grid
              item
              width={150}
              alignItems="center"
              display="flex"
              flexDirection="row"
              gap={1}
            >
              <Typography fontWeight={700} noWrap fontSize={14}>
                {t("vp-inputs")}
              </Typography>
              <Stack
                width={30}
                height={30}
                bgcolor={(theme) => theme.palette.primary.main}
                color={(theme) => theme.palette.common.white}
                fontWeight="700"
                borderRadius="50%"
                alignItems="center"
                justifyContent="center"
              >
                {ins}
              </Stack>
            </Grid>
            <Grid
              item
              width={150}
              alignItems="center"
              display="flex"
              flexDirection="row"
              gap={1}
            >
              <Typography fontWeight={700} noWrap fontSize={14}>
                {t("vp-outputs")}
              </Typography>
              <Stack
                width={30}
                height={30}
                bgcolor={(theme) => theme.palette.primary.main}
                color={(theme) => theme.palette.common.white}
                fontWeight="700"
                borderRadius="50%"
                alignItems="center"
                justifyContent="center"
              >
                {outs}
              </Stack>
            </Grid>
            <Grid
              item
              width={150}
              alignItems="center"
              display="flex"
              flexDirection="row"
              gap={1}
            >
              <Typography fontWeight={700} noWrap fontSize={14}>
                {free === 1 ? t("vp-free") : t("vp-free2")}
              </Typography>
              <Stack
                width={30}
                height={30}
                bgcolor={(theme) => theme.palette.primary.main}
                color={(theme) => theme.palette.common.white}
                fontWeight="700"
                borderRadius="50%"
                alignItems="center"
                justifyContent="center"
              >
                {free}
              </Stack>
            </Grid>
          </Grid>
        </Stack>
      )}
    </SimpleCard>
  );
}
