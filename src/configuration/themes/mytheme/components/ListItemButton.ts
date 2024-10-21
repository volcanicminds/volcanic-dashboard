import { Theme } from "@mui/material";

const ListItemButton = (theme: Theme) => {
  return {
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: "30px",
          "&.Mui-selected, &.Mui-selected:hover": {
            backgroundColor: theme.palette.primary.main,
            color: theme.palette.common.white,
          },
        },
      },
    },
  };
};

export default ListItemButton;
