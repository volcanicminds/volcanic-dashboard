import { Theme } from "@mui/material";

const Accordion = (_theme: Theme) => {
  return {
    MuiAccordion: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(220 221 221 / 6%)",
          boxShadow: "none",
          "&:before": {
            content: "none",
          },
          "& .MuiAccordionSummary-root": {
            "& .MuiAccordionSummary-content": {
              alignItems: "center",
              gap: 15,
              minWidth: 0,
            },
          },
        },
      },
    },
  };
};

export default Accordion;
