import { Theme } from "@mui/material";

const FileInput = (theme: Theme) => {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          "&.MuiFileInput-TextField": {
            "& .MuiInputBase-root": {
              padding: 0,
              "& label": {
                "& .MuiInputBase-input": {
                  paddingTop: "6.5px",
                  paddingBottom: "6.5px",
                  "& + * > *": {
                    color: theme.palette.common.white,
                    fontSize: "14px",
                  },
                },
                "& .MuiFileInput-placeholder": {
                  color: theme.palette.common.white,
                  fontSize: "14px",
                },
                "&:hover span": {
                  cursor: "pointer",
                  opacity: 1,
                },
                "& span": {
                  opacity: 0.75,
                },
              },
              "& .MuiInputAdornment-root": {
                "& .MuiTypography-root": {
                  color: theme.palette.common.white,
                },
              },
              "& .MuiOutlinedInput-notchedOutline": {
                border: "none",
                backgroundColor: "rgb(0 0 0 / 17%)",
              },
            },
          },
        },
      },
    },
  };
};

export default FileInput;
