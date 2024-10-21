import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Grid } from "@mui/material";
import { useMemo } from "react";
import { normalizedFieldsOrder } from "@/utils/data";
import { DEFAULT_ND } from "@/utils/constants";
import { getWhichRuleFullfilled } from "@/utils/rules";
import DataGroup from "@/components/common/DataGroup";
import { DataField } from "@/types";

interface StatusDisplayProps {
  title: string;
  dataFields: DataField[];
  fieldsOrder: string[];
}

export default function StatusDisplay({
  title,
  fieldsOrder = [],
  dataFields: fields = [],
}: StatusDisplayProps) {
  const normalizedFieldsOrderList = useMemo(
    () => normalizedFieldsOrder(fields, fieldsOrder),
    [fields, fieldsOrder]
  );

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Grid container spacing={1}>
        {normalizedFieldsOrderList.map((fieldId, index) => {
          const field =
            fields.find((field) => field.alias === fieldId) ||
            ({} as DataField);

          let dataToEvaluate: number | boolean = 0;
          if (typeof field.data === "string") {
            dataToEvaluate = Number(
              field.data.replace(" V", "").replace(" mA", "")
            );
          } else if (typeof field.data === "number") {
            dataToEvaluate = field.data;
          } else if (typeof field.data === "boolean") {
            dataToEvaluate = field.data;
          }

          const ruleFullfilled = getWhichRuleFullfilled(
            field.rules,
            field.alias,
            [
              {
                alias: field.alias,
                data: dataToEvaluate,
              },
            ]
          );

          return (
            <Grid item xs={6} key={`StatusDisplay-${index}-${Math.random()}`}>
              <DataGroup
                title={t(field.label || "") || DEFAULT_ND}
                data={field.data}
                result={ruleFullfilled?.result || undefined}
                resultLabel={ruleFullfilled?.resultLabel || undefined}
              />
            </Grid>
          );
        })}
      </Grid>
    </SimpleCard>
  );
}
