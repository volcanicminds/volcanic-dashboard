import { DataField } from "@/types";
import { Stack, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import ScrollContainer from "react-indiana-drag-scroll";
import OptionsCard, { Option } from "@/components/common/OptionsCard";

interface OptionsCardsProps {
  title: string;
  dataFields: DataField[];
  fieldsOrder: string[];
}

export default function OptionsCards({
  title,
  dataFields: fields = [],
}: OptionsCardsProps) {
  const [selectedOption, setSelectedOption] = useState<string>();

  const options = useMemo(
    () => fields.map((field) => field.data as Option).flat(),
    [fields]
  );

  return (
    <Stack spacing={2} sx={{ width: "100%" }}>
      <Typography variant="h5">{title}</Typography>
      <ScrollContainer className="scroll-container-licences">
        <Stack spacing={2} py={5} direction="row" className="scroll-content">
          {options.map((option) => {
            return (
              <OptionsCard
                key={option.code}
                option={option}
                selected={selectedOption === option.code}
                setSelectedOption={setSelectedOption}
                mode="filled"
              />
            );
          })}
        </Stack>
      </ScrollContainer>
    </Stack>
  );
}
