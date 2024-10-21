import { Box, Stack } from "@mui/material";
import Sidebar from "@/components/sidebar";
import Header from "./header/header";
import {
  Context,
  createContext,
  Dispatch,
  ReactNode,
  Reducer,
  useReducer,
} from "react";
import { t } from "i18next";
import { DrawerProvider } from "@/hook/useDrawer";
import { DRAWER_WIDTH } from "@/utils/config";
import FullScreenLoaderWrapper from "./FullScreenLoaderWrapper";

export interface MainLayoutProps {
  children: ReactNode;
  title?: string;
}

interface AppState {
  canPoll: boolean;
}

export type AppActions = { type: "can_poll"; payload: boolean };

function appReducer(state: AppState, action: AppActions) {
  switch (action.type) {
    case "can_poll":
      return { ...state, canPoll: action.payload };
    default:
      return state;
  }
}

type AppContextType = {
  canPoll: boolean;
};
type AppDispatchContextType = Dispatch<AppActions>;

export const AppContext: Context<AppContextType> =
  createContext<AppContextType>({
    canPoll: true,
  });

export const AppDispatchContext: Context<AppDispatchContextType> =
  createContext<AppDispatchContextType>(() => {});

export default function MainLayout({ children, title }: MainLayoutProps) {
  const [state, dispatch] = useReducer<Reducer<any, AppActions>>(appReducer, {
    canPoll: true,
  });

  return (
    <DrawerProvider>
      <FullScreenLoaderWrapper>
        <AppContext.Provider value={{ canPoll: state.canPoll }}>
          <AppDispatchContext.Provider value={dispatch}>
            <Stack
              direction="row"
              pl={{ sm: DRAWER_WIDTH }}
              className="global-container"
            >
              <Sidebar editedNodes={[]} />
              <Stack
                minHeight="100vh"
                flex={1}
                minWidth={0}
                position="relative"
                className="body-container"
                color={(theme) => theme.palette.bodyText?.main}
              >
                <Box
                  position="fixed"
                  width="100%"
                  top={0}
                  left={0}
                  zIndex={0}
                  className="background"
                />

                <Header title={t(title || "")} />
                <Box component="main" p={3} zIndex={1}>
                  {children}
                </Box>
              </Stack>
            </Stack>
          </AppDispatchContext.Provider>
        </AppContext.Provider>
      </FullScreenLoaderWrapper>
    </DrawerProvider>
  );
}
