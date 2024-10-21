import { Theme } from "@mui/material";

const MainLayout = (_theme: Theme) => {
  return {
    MuiStack: {
      styleOverrides: {
        root: {
          "&.global-container": {
            "& .body-container": {
              "& .background": {
                height: "100vh",
                background: "linear-gradient(220deg, #9e9e9e 0%, #424242 100%)",
              },
            },
          },
        },
      },
    },
  };
};

export default MainLayout;
