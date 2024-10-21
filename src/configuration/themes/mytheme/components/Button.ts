import { Theme } from "@mui/material";

const Button = (theme: Theme) => {
  return {
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: "25px",
          ".notistack-MuiContent &": {
            color: theme.palette.common.white,
          },
        },
      },
    },
  };
};

export default Button;
