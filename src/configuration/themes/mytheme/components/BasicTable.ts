import { Theme } from "@mui/material";

const BasicTable = (_theme: Theme) => {
  return {
    MuiTableContainer: {
      styleOverrides: {
        root: {
          "& .MuiTableHead-root": {
            background: "rgb(255 255 255 / 5%)",
            "& .MuiTableRow-head": {
              backgroundColor: "transparent",
              boxShadow: "none",
              "& .MuiTableCell-root": {
                backgroundColor: "transparent",
                paddingTop: "12px",
                paddingBottom: "12px",
                borderBottom: "none",
                "& .Mui-TableHeadCell-Content-Wrapper": {
                  fontWeight: "700",
                  fontSize: "16px",
                },
                "& .MuiBadge-root .MuiButtonBase-root": {
                  opacity: 1,
                },
              },
            },
          },
          "& .MuiTableBody-root": {
            background: "rgb(255 255 255 / 5%)",
            "& .MuiTableRow-root": {
              backgroundColor: "transparent !important", // "important" is mandatory to override library behaviour
            },
          },
        },
      },
    },
    MuiList: {
      styleOverrides: {
        root: {
          ".MuiPopover-paper.MuiMenu-paper &.MuiMenu-list": {
            backgroundColor: "transparent",
          },
        },
      },
    },
  };
};

export default BasicTable;
