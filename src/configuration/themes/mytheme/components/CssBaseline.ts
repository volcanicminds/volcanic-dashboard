import { Theme } from "@mui/material";

import TTCommonsBlackItalic from "../fonts/TT_Commons_Black_Italic.otf";
import TTCommonsBlack from "../fonts/TT_Commons_Black.otf";
import TTCommonsBoldItalic from "../fonts/TT_Commons_Bold_Italic.otf";
import TTCommonsBold from "../fonts/TT_Commons_Bold.otf";
import TTCommonsDemiBoldItalic from "../fonts/TT_Commons_DemiBold_Italic.otf";
import TTCommonsDemiBold from "../fonts/TT_Commons_DemiBold.otf";
import TTCommonsExtraBoldItalic from "../fonts/TT_Commons_ExtraBold_Italic.otf";
import TTCommonsExtraBold from "../fonts/TT_Commons_ExtraBold.otf";
import TTCommonsExtraLightItalic from "../fonts/TT_Commons_ExtraLight_Italic.otf";
import TTCommonsExtraLight from "../fonts/TT_Commons_ExtraLight.otf";
import TTCommonsItalic from "../fonts/TT_Commons_Italic.otf";
import TTCommonsLightItalic from "../fonts/TT_Commons_Light_Italic.otf";
import TTCommonsLight from "../fonts/TT_Commons_Light.otf";
import TTCommonsMediumItalic from "../fonts/TT_Commons_Medium_Italic.otf";
import TTCommonsMedium from "../fonts/TT_Commons_Medium.otf";
import TTCommonsRegular from "../fonts/TT_Commons_Regular.otf";
import TTCommonsThinItalic from "../fonts/TT_Commons_Thin_Italic.otf";
import TTCommonsThin from "../fonts/TT_Commons_Thin.otf";

const CssBaseline = (_theme: Theme) => {
  return {
    MuiCssBaseline: {
      styleOverrides: `
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 100;
          src: url(${TTCommonsThin});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 200;
          src: url(${TTCommonsExtraLight});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 300;
          src: url(${TTCommonsLight});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 400;
          src: url(${TTCommonsRegular});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 500;
          src: url(${TTCommonsMedium});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 500;
          src: url(${TTCommonsDemiBold});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 700;
          src: url(${TTCommonsBold});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 800;
          src: url(${TTCommonsExtraBold});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: normal;
          font-weight: 900;
          src: url(${TTCommonsBlack});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 100;
          src: url(${TTCommonsThinItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 200;
          src: url(${TTCommonsExtraLightItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 300;
          src: url(${TTCommonsLightItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 400;
          src: url(${TTCommonsItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 500;
          src: url(${TTCommonsMediumItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 500;
          src: url(${TTCommonsDemiBoldItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 700;
          src: url(${TTCommonsBoldItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 800;
          src: url(${TTCommonsExtraBoldItalic});
        }
        @font-face {
          font-family: 'TTCommons';
          font-style: italic;
          font-weight: 900;
          src: url(${TTCommonsBlackItalic});
        }
        

        html,
        body,
        #root {
          width: 100%;
          height: 100%;
        }

        ::-webkit-calendar-picker-indicator {
          filter: invert(1);
        }

        .pulse {
          animation: pulse-animation 2s infinite;
        }

        .pulse-red {
          animation: pulse-red-animation 2s infinite;
        }

        .pulse-green {
          animation: pulse-green-animation 2s infinite;
        }

        @keyframes pulse-animation {
          0% {
            box-shadow: 0 0 0 0px rgba(255, 255, 255, 0.5);
          }
          100% {
            box-shadow: 0 0 0 7px rgba(255, 255, 255, 0);
          }
        }

        @keyframes pulse-red-animation {
          0% {
            box-shadow: 0 0 0 0px rgba(255, 0, 0, 0.5);
          }
          100% {
            box-shadow: 0 0 0 7px rgba(255, 0, 0, 0);
          }
        }

        @keyframes pulse-green-animation {
          0% {
            box-shadow: 0 0 0 0px rgba(0, 255, 0, 0.5);
          }
          100% {
            box-shadow: 0 0 0 7px rgba(0, 255, 0, 0);
          }
        }
      `,
    },
  };
};

export default CssBaseline;
