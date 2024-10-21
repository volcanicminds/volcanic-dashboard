import { Theme } from "@mui/material";

const Dialog = (theme: Theme) => {
  return {
    MuiDialog: {
      styleOverrides: {
        container: {
          backdropFilter: "blur(5px)",
          "& .MuiDialog-paper": {
            borderRadius: 0,
            [theme.breakpoints.only("xs")]: {
              height: "100vh",
              width: "100vw",
              maxWidth: "unset",
              maxHeight: "unset",
              margin: 0,
            },
            [theme.breakpoints.up("sm")]: {
              minWidth: "400px",
            },
            "& .MuiDialogTitle-root": {
              color: theme.palette.common.black,
            },
            "& .MuiDialogContent-root": {
              padding: "24px",
              display: "flex",
              flexDirection: "column",
              "& .MuiDialogContentText-root": {
                flex: 1,
                display: "flex",
                flexDirection: "column",
              },
            },
          },
        },
      },
    },
  };
};

export default Dialog;
