import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Grid, Stack, Typography } from "@mui/material";
import { useMemo } from "react";
import { normalizedFieldsOrder } from "@/utils/data";
import MUIIcon, { IconNames } from "@/components/common/MUIIcon";
import { getWhichRuleFullfilled } from "@/utils/rules";
import { interpretIcon } from "@/utils/strings";
import { DataField } from "@/types";

interface ConnectivityListProps {
  title: string;
  dataFields: DataField[];
  fieldsOrder: string[];
}

export default function ConnectivityList({
  title,
  fieldsOrder = [],
  dataFields: fields = [],
}: ConnectivityListProps) {
  const normalizedFieldsOrderList = useMemo(
    () => normalizedFieldsOrder(fields, fieldsOrder),
    [fields, fieldsOrder]
  );

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Grid container spacing={1}>
        {normalizedFieldsOrderList
          .map((fieldId, index) => {
            const field =
              fields.find((field) => field.alias === fieldId) ||
              ({} as DataField);

            const ruleFullfilled = getWhichRuleFullfilled(
              field.rules,
              field.alias,
              fields
            );

            const item =
              ruleFullfilled && ruleFullfilled.icon ? (
                <Grid
                  item
                  width={150}
                  key={`ConnectivityList-${index}-${Math.random()}`}
                  alignItems="center"
                  display="flex"
                  flexDirection="row"
                  gap={1}
                >
                  <Stack spacing={1} direction="row">
                    <MUIIcon
                      iconName={
                        interpretIcon(ruleFullfilled.icon, fields) as IconNames
                      }
                    />
                    {ruleFullfilled.additionalIcon && (
                      <MUIIcon
                        iconName={
                          interpretIcon(
                            ruleFullfilled.additionalIcon,
                            fields
                          ) as IconNames
                        }
                      />
                    )}
                  </Stack>
                  <Typography fontWeight={700} noWrap fontSize={14}>
                    {t(field.label || field.alias)}
                  </Typography>
                </Grid>
              ) : null;

            return item;
          })
          .filter((item) => !!item)}
      </Grid>
    </SimpleCard>
  );
}
