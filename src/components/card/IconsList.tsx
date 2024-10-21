import { t } from "i18next";
import SimpleCard from "../common/SimpleCard";
import { Box, Tooltip } from "@mui/material";
import { Fragment, useMemo } from "react";
import { normalizedFieldsOrder } from "@/utils/data";
import MUIIcon, { IconNames } from "@/components/common/MUIIcon";
import { getEventType, getWhichRuleFullfilled } from "@/utils/rules";
import { interpretIcon } from "@/utils/strings";
import { DataField } from "@/types";

interface IconsListProps {
  title: string;
  dataFields: DataField[];
  fieldsOrder: string[];
}

export default function IconsList({
  title,
  fieldsOrder = [],
  dataFields: fields = [],
}: IconsListProps) {
  const normalizedFieldsOrderList = useMemo(
    () => normalizedFieldsOrder(fields, fieldsOrder),
    [fields, fieldsOrder]
  );

  return (
    <SimpleCard title={t(title)} fullWidth>
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

          const isIcon = ruleFullfilled && ruleFullfilled.icon;

          const isEvents = fieldId === "Events";

          const item =
            isEvents || isIcon ? (
              <Fragment key={`IconsList-${index}-${Math.random()}`}>
                {isEvents && <span>{getEventType(field.data)}</span>}
                {isIcon && ruleFullfilled.icon && (
                  <Box>
                    <Tooltip title={t(ruleFullfilled.tooltip || field.alias)}>
                      <span>
                        <MUIIcon
                          iconName={
                            interpretIcon(
                              ruleFullfilled.icon,
                              fields
                            ) as IconNames
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
                      </span>
                    </Tooltip>
                  </Box>
                )}
              </Fragment>
            ) : null;

          return item;
        })
        .filter((item) => !!item)}
    </SimpleCard>
  );
}
