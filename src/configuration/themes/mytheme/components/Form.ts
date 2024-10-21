import { Theme } from "@mui/material";

const Form = (_theme: Theme) => {
  return {
    MuiFormControl: {
      styleOverrides: {
        root: {
          "& .MuiFormLabel-root": {
            transform: "translate(0, -9px) scale(0.75)",
            "&.MuiInputLabel-root.Mui-focused": {
              color: "inherit",
            },
          },
          "& .MuiInputBase-input": {
            "&.MuiInput-input": {
              paddingTop: "4px",
            },
          },
          "&.MuiTextField-root": {
            width: "100%",
          },
        },
      },
    },
  };
};

export default Form;
