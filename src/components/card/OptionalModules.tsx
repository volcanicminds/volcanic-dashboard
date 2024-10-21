import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Grid } from "@mui/material";
import { useMemo } from "react";
import { normalizedFieldsOrder } from "@/utils/data";
import { DEFAULT_ND } from "@/utils/constants";
import DataGroup from "@/components/common/DataGroup";
import { DataField } from "@/types";

interface OptionalModulesProps {
  title: string;
  dataFields: DataField[];
  fieldsOrder: string[];
}

export default function OptionalModules({
  title,
  fieldsOrder = [],
  dataFields: fields = [],
}: OptionalModulesProps) {
  const normalizedFieldsOrderList = useMemo(
    () => normalizedFieldsOrder(fields, fieldsOrder),
    [fields, fieldsOrder]
  );

  const wifiValue = useMemo(() => {
    let resultValue = "";
    const field =
      fields.find((field) => field.alias === "WIFI") || ({} as DataField);
    if (field?.data === true) {
      resultValue = t("present");

      const wifiEquipped =
        fields.find((field) => field.alias === "wifi_equipped") ||
        ({} as DataField);
      if (wifiEquipped?.data === "1") {
        resultValue += ", " + t("enabled");

        const wifiConn =
          fields.find((field) => field.alias === "WIFI_CONN") ||
          ({} as DataField);
        if (wifiConn?.data === false) {
          resultValue += ", " + t("not-connected");
        } else {
          resultValue += ", " + t("connected");
        }

        const wifiRxlev =
          fields.find((field) => field.alias === "WIFI_RXLEV") ||
          ({} as DataField);
        resultValue +=
          ", " +
          t("cd-dev-signal") +
          ": " +
          Number((wifiRxlev?.data as number) || 0) * 25 +
          "%";
      } else {
        resultValue += ", " + t("not-enabled");
      }
    } else {
      resultValue = t("absent");
    }

    return resultValue;
  }, [fields]);

  const gsmValue = useMemo(() => {
    let resultValue = "";
    const field =
      fields.find((field) => field.alias === "GSM") || ({} as DataField);

    if (field?.data === true) {
      resultValue += t("present");
      const is4g =
        fields.find((field) => field.alias === "IS4G") || ({} as DataField);
      if (is4g?.data === false) {
        resultValue += "(" + t("2G") + ")";
        const gsmEquipped =
          fields.find((field) => field.alias === "gsm_equipped") ||
          ({} as DataField);
        if (gsmEquipped?.data === "1") {
          resultValue += ", " + t("enabled");

          const mobileFault =
            fields.find((field) => field.alias === "MOBILEFAULT") ||
            ({} as DataField);
          if (mobileFault?.data === true) {
            // statusOk = 2;
            resultValue += ", " + t("not-connected");
          } else {
            // statusOk = 1;
            resultValue += ", " + t("connected");
          }
        } else {
          resultValue += ", " + t("not-enabled");
        }
      } else {
        /// LTE Module
        resultValue += "(" + t("4G") + ")";
        const gsmEquipped =
          fields.find((field) => field.alias === "gsm_equipped") ||
          ({} as DataField);

        if (gsmEquipped?.data === "1") {
          resultValue += ", " + t("enabled");

          const mobileFault =
            fields.find((field) => field.alias === "MOBILEFAULT") ||
            ({} as DataField);
          if (mobileFault?.data === true) {
            // statusOk = 2;
            resultValue += ", " + t("not-connected");
          } else {
            // statusOk = 1;
            resultValue += ", " + t("connected");
          }
          const gsmRxlev =
            fields.find((field) => field.alias === "GSM_RXLEV") ||
            ({} as DataField);
          resultValue +=
            ", " +
            t("cd-dev-signal") +
            ": " +
            Number(gsmRxlev?.data) * 25 +
            "%";
        } else {
          resultValue += ", " + t("not-enabled");
        }
      }
    } else {
      resultValue += t("absent");
    }

    return resultValue;
  }, [fields]);

  const zigBeeValue = useMemo(() => {
    let resultValue = "";
    const field =
      fields.find((field) => field.alias === "ZIGBEE") || ({} as DataField);

    if (field?.data === true) {
      resultValue += t("present");
      const zigbeeEquipped =
        fields.find((field) => field.alias === "zigbee_equipped") ||
        ({} as DataField);
      if (zigbeeEquipped?.data === "1") {
        // statusOk = 1;
        resultValue += ", " + t("enabled");
      } else {
        resultValue += ", " + t("not-enabled");
      }
    } else {
      resultValue += t("absent");
    }

    return resultValue;
  }, [fields]);

  const pstnValue = useMemo(() => {
    let resultValue = "";
    const field =
      fields.find((field) => field.alias === "PSTN") || ({} as DataField);

    if (field?.data === true) {
      resultValue += t("present");
      const pstnEquipped =
        fields.find((field) => field.alias === "pstn_equipped") ||
        ({} as DataField);

      if (pstnEquipped?.data === "1") {
        resultValue += ", " + t("enabled");

        const pstInFault =
          fields.find((field) => field.alias === "PSTNFAULT") ||
          ({} as DataField);

        if (pstInFault?.data === true) {
          // statusOk = 2;
          resultValue += ", " + t("not-connected");
        } else {
          // statusOk = 1;
          resultValue += ", " + t("connected");
        }
      } else {
        resultValue += ", " + t("not-enabled");
      }
    } else {
      resultValue += t("absent");
    }

    return resultValue;
  }, [fields]);

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Grid container spacing={1}>
        {normalizedFieldsOrderList
          .filter((fieldId) =>
            ["WIFI", "GSM", "ZIGBEE", "PSTN"].includes(fieldId)
          )
          .map((fieldId, index) => {
            const field =
              fields.find((field) => field.alias === fieldId) ||
              ({} as DataField);

            const value =
              fieldId === "WIFI"
                ? wifiValue
                : fieldId === "GSM"
                  ? gsmValue
                  : fieldId === "ZIGBEE"
                    ? zigBeeValue
                    : fieldId === "PSTN"
                      ? pstnValue
                      : field.data;

            return (
              <Grid
                item
                xs={6}
                key={`OptionalModules-${index}-${Math.random()}`}
              >
                <DataGroup
                  title={t(field.label || "") || DEFAULT_ND}
                  data={field.data}
                  resultLabel={String(value)}
                />
              </Grid>
            );
          })}
      </Grid>
    </SimpleCard>
  );
}
