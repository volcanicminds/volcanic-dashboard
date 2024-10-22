import StarIcon from "@mui/icons-material/Star";
import { t } from "i18next";
import { Box, Chip, Stack, Typography } from "@mui/material";

interface LicenceCardProps {
  hasAssessment: boolean;
  option: {
    code: string;
    name: string;
    subtitle: string;
    sections: {
      title: string;
      chips: string[];
    }[];
  };
  numericValue: number;
  isPrice: boolean;
  suggested: boolean;
  selected: boolean;
  disabled: boolean;
  setSelectedOption: (selected: string) => void;
  mode: "filled" | "transparent";
}

export default function LicenceCard({
  hasAssessment,
  option,
  numericValue,
  isPrice,
  suggested,
  selected,
  disabled,
  setSelectedOption,
  mode,
}: LicenceCardProps) {
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
        opacity: disabled ? 0.5 : 1,
        cursor: disabled ? "not-allowed" : "pointer",
        boxShadow: selected ? "none" : "0 0 10px rgb(0 0 0 / 10%)",
      }}
      onClick={() => {
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
        {!hasAssessment && (
          <Typography fontWeight={700} fontSize={20}>
            {numericValue} {isPrice ? "€" : ""}{" "}
            <Typography
              variant="caption"
              fontSize={12}
              textTransform="uppercase"
            >
              / {t("general.year")}
            </Typography>
          </Typography>
        )}
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

      {suggested ? (
        <Chip
          sx={{
            mt: 3,
            bgcolor: "#FF8200",
            color: "#ffffff",
            height: "23px",
            borderRadius: "7px",
            py: 1.7,
            fontWeight: "700",
            textTransform: "uppercase",
          }}
          icon={<StarIcon sx={{ color: "#ffffff !important" }} />}
          label={t("option.suggested")}
        />
      ) : (
        <></>
      )}

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
