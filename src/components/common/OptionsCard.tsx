import { t } from "i18next";
import { Box, Chip, Stack, Typography } from "@mui/material";

export type Option = {
  code: string;
  name: string;
  subtitle: string;
  numericValue: number;
  isPrice: boolean;
  sections: {
    title: string;
    chips: string[];
  }[];
};

export interface OptionsCardProps {
  option: Option;
  selected: boolean;
  setSelectedOption: (selected: string) => void;
  mode: "filled" | "transparent";
}

export default function OptionsCard({
  option,
  selected,
  setSelectedOption,
  mode,
}: OptionsCardProps) {
  return (
    <Stack
      flex="0 0 350px"
      alignItems="center"
      border="1px solid"
      borderRadius={1}
      px={4}
      pt={4}
      pb={7}
      bgcolor={mode === "filled" ? "transparent" : "#131D1C"}
      sx={{
        borderColor: selected
          ? (theme) => theme.palette.primary.main
          : "transparent",
        cursor: "pointer",
        boxShadow: selected ? "none" : "0 0 10px rgb(0 0 0 / 10%)",
      }}
      onClick={() => {
        if (selected) {
          setSelectedOption("");
          return;
        }
        setSelectedOption(option.code);
      }}
      position="relative"
    >
      {selected ? (
        <Chip
          sx={{
            bgcolor: (theme) => theme.palette.primary.main,
            color: "#ffffff",
            paddingLeft: "10px",
            paddingRight: "10px",
            height: "23px",
            borderRadius: "7px",
            fontWeight: "700",
            position: "absolute",
            top: "-13px",
            textTransform: "uppercase",
          }}
          label={t("option.selected")}
        />
      ) : (
        <></>
      )}

      {/* Price */}
      <Box
        position="absolute"
        bottom="-1px"
        right="-1px"
        bgcolor={(theme) => theme.palette.primary.main}
        color="#ffffff"
        px={3}
        py={0.5}
        sx={{ borderTopLeftRadius: "4px", borderBottomRightRadius: "3px" }}
      >
        <Typography fontWeight={700} fontSize={20}>
          {option.numericValue} {option.isPrice ? "€" : ""}{" "}
          <Typography variant="caption" fontSize={12} textTransform="uppercase">
            / {t("general.year")}
          </Typography>
        </Typography>
      </Box>

      <Typography
        variant="h2"
        textAlign="center"
        textTransform="uppercase"
        fontWeight="700"
      >
        {option.name}
      </Typography>
      <Typography
        variant="caption"
        textAlign="center"
        color="#8692A6"
        lineHeight="16px"
      >
        {option.subtitle}
      </Typography>

      {option.sections.map((section, index) => {
        return (
          <Stack
            key={`section-${index}`}
            direction="column"
            alignItems="center"
            spacing={1}
            mt={3}
          >
            <Typography variant="h5">{section.title}</Typography>
            {section.chips.map((chip, chipIndex) => (
              <Chip
                key={`section-${index}-chip-${chipIndex}`}
                label={chip}
                sx={{
                  bgcolor: "transparent",
                  color: (theme) => theme.palette.primary.main,
                  borderWidth: "1px",
                  borderStyle: "solid",
                  borderColor: (theme) => theme.palette.primary.main,
                  height: "auto",
                  padding: "5px",
                  "& .MuiChip-label": {
                    display: "block",
                    whiteSpace: "normal",
                    textAlign: "center",
                  },
                  borderRadius: "7px",
                  fontWeight: "700",
                }}
              />
            ))}
            {index < option.sections.length - 1 && (
              <Box
                height="1px"
                width={120}
                bgcolor="#E5E5E5"
                style={{ marginTop: "30px" }}
              />
            )}
          </Stack>
        );
      })}
    </Stack>
  );
}
