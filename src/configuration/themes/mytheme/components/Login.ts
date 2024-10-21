import { Theme } from "@mui/material";

const Login = (_theme: Theme) => {
  return {
    MuiStack: {
      styleOverrides: {
        root: {
          "&.login": {
            justifyContent: "center",
            background: "linear-gradient(220deg, #9e9e9e 0%, #424242 100%)",
            "& .right-side": {
              alignItems: "center",
              flexDirection: "column-reverse",
              paddingBottom: 100,
              "& .MuiCard-root": {
                paddingTop: 90,
                paddingBottom: 90,
                "&::before, &::after": {
                  content: '""',
                  position: "absolute",
                  backgroundRepeat: "no-repeat",
                  zIndex: -1,
                },
                "& .welcome-title": {
                  textAlign: "center",
                },
                "& input[type='password']": {
                  border: "none",
                  borderBottom: "1px solid rgba(51, 54, 74, 0.2)",
                },
              },
              "& .logo-container": {
                "& .logo": {
                  width: 200,
                  maxWidth: "80%",
                },
              },
            },
          },
        },
      },
    },
  };
};

export default Login;
