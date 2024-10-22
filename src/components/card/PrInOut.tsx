import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Grid, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { DataField } from "@/types";

interface PrInOutProps {
  title: string;
  dataFields: DataField[];
}

export default function PrInOut({
  title,
  dataFields: fields = [],
}: PrInOutProps) {
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
      <Stack spacing={1}>
        <Typography
          color={count >= max ? "error" : ""}
          fontWeight={700}
          noWrap
          fontSize={14}
        >
          {t("cp-available")} {count}
          {t("cp-of")} {max}
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
              {t("cp-inputs")}
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
              {t("cp-outputs")}
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
              {free === 1 ? t("cp-free") : t("cp-free2")}
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
    </SimpleCard>
  );
}
