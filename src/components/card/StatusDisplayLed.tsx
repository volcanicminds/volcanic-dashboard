import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Grid } from "@mui/material";
import { useMemo } from "react";
import { normalizedFieldsOrder } from "@/utils/data";
import { DEFAULT_ND } from "@/utils/constants";
import { getWhichRuleFullfilled } from "@/utils/rules";
import DataGroup from "@/components/common/DataGroup";
import { DataField, ComponentFooter } from "@/types";
import Footer from "../common/Footer";

interface StatusDisplayLedProps {
  title: string;
  dataFields: DataField[];
  fieldsOrder: string[];
  footer?: ComponentFooter;
}

export default function StatusDisplayLed({
  title,
  fieldsOrder = [],
  dataFields: fields = [],
  footer,
}: StatusDisplayLedProps) {
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

          const ruleFullfilled = getWhichRuleFullfilled(
            field.rules,
            field.alias,
            fields
          );

          return (
            <Grid
              item
              xs={6}
              key={`StatusDisplayLed-${index}-${Math.random()}`}
            >
              <DataGroup
                title={t(field.label || "") || DEFAULT_ND}
                data={((field.data || "") as string).toLowerCase()}
                result={ruleFullfilled?.result || undefined}
              />
            </Grid>
          );
        })}
      </Grid>
      {footer && <Footer footer={footer} />}
    </SimpleCard>
  );
}
