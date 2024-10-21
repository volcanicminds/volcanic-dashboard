import { Theme } from "@mui/material";

const DataGroup = (_theme: Theme) => {
  return {
    MuiStack: {
      styleOverrides: {
        root: {
          "& .label": {
            fontWeight: 400,
            fontSize: 14,
          },
          "& .value": {
            fontWeight: 700,
          },
        },
      },
    },
  };
};

export default DataGroup;
