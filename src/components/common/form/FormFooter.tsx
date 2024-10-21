import { FormFooter as FormFooterType } from "@/types";
import { checkRule } from "@/utils/rules";
import { Box, Stack } from "@mui/material";
import _ from "lodash";

function FormFooter({
  footer,
  values,
}: {
  footer: FormFooterType;
  values: any;
}) {
  return (
    <Stack direction="column" spacing={2} py={2}>
      {(footer.images || [])
        .filter((item) => {
          if (!item.conditions || item.conditions.length === 0) return true;

          return item.conditions.every((condition) => {
            const value = _.get(values, condition.data);
            return checkRule(condition, [
              {
                alias: condition.data,
                data: value,
              },
            ]);
          });
        })
        .map((item, index) => (
          <Box
            key={`form-footer-image-${Math.random()}-${index}`}
            component="img"
            src={item.image?.path}
            width={item.image?.width}
          />
        ))}
    </Stack>
  );
}

export default FormFooter;
