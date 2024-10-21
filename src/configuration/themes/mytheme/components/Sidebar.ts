import { Theme } from "@mui/material";

import minus from "../images/minus.svg";
import plus from "../images/plus.svg";

const Sidebar = (_theme: Theme) => {
  return {
    MuiStack: {
      styleOverrides: {
        root: {
          "&.sidebar": {
            paddingTop: "65px",
            paddingBottom: "25px",
            "& .logo": {
              width: "150px",
              height: "50px",
            },
            "& .menu": {
              flexDirection: "column-reverse",
              "& .menu-items": {
                paddingRight: 0,
                "& .MuiListItemButton-root": {
                  borderTopRightRadius: 0,
                  borderBottomRightRadius: 0,
                  "&.expandable": {
                    marginTop: "15px",
                    marginBottom: "15px",
                    transition: "margin 700ms",
                    "&.expanded": {
                      marginBottom: 0,
                    },
                    "& .expand": {
                      backgroundRepeat: "no-repeat",
                      backgroundPosition: "center",
                      backgroundSize: "12px",
                      "&.expand-less": {
                        backgroundImage: `url(${minus})`,
                      },
                      "&.expand-more": {
                        backgroundImage: `url(${plus})`,
                      },
                    },
                  },
                  "& .MuiListItemText-root .MuiTypography-root": {
                    fontWeight: 500,
                    fontSize: 17,
                    "&.is-edited": {
                      fontWeight: 700,
                    },
                  },
                },
                "& .MuiCollapse-root": {
                  "& .expandable": {
                    marginTop: 0,
                    marginBottom: 0,
                  },
                },
              },
            },
            "&::before, &::after": {
              content: '""',
              position: "absolute",
              backgroundRepeat: "no-repeat",
              zIndex: -1,
            },
          },
        },
      },
    },
  };
};

export default Sidebar;
