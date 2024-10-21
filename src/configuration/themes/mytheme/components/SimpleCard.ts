import { Theme } from "@mui/material";

const SimpleCard = (theme: Theme) => {
  return {
    MuiCard: {
      styleOverrides: {
        root: {
          backgroundColor: "rgb(220 221 221 / 10%)",
          borderRadius: 0,
          boxShadow: "none",
          color: theme.palette.common.white,
          backdropFilter: "blur(5px)",
          ".MuiCard-root &": {
            backdropFilter: "none",
          },
          "& .MuiCardHeader-root": {
            paddingBottom: 0,
            "& .MuiTypography-root": {
              fontSize: "35px",
            },
          },
          ".MuiDialogContent-root &": {
            backgroundColor: "#666666",
          },
        },
      },
    },
  };
};

export default SimpleCard;
