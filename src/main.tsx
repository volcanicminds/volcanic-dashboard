import React from "react";
import ReactDOM from "react-dom/client";
import { SnackbarProvider, SnackbarKey, closeSnackbar } from "notistack";
import { HashRouter } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import ThemeCustomization from "@/themes";
import AppRouter from "@/components/navigation/router";
import { DEFAULT_RESET_TOAST_TIME } from "@/utils/config";
import { ApiProvider } from "@/components/ApiWrapper";
import ClientWrapper from "@/components/ClientWrapper";
import { InitConfig } from "@/components/InitConfig";
import { ErrorBoundary } from "react-error-boundary";
import { Button } from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import i18next, { t } from "i18next";
import ErrorBoundaryMessage from "@/components/ErrorBoundaryMessage";
import { RESET_TOAST_INTERVAL } from "@/configuration";
import { AuthProvider } from "@/components/AuthProvider";
import { FALLBACK_LANGUAGE } from "@/utils/constants";
import "@formatjs/intl-numberformat/polyfill";
import "@formatjs/intl-numberformat/locale-data/en";
import "@formatjs/intl-numberformat/locale-data/it";
import "dayjs/locale/en";
import "dayjs/locale/it";

const action = (snackbarId: SnackbarKey) => (
  <>
    <Button
      onClick={() => {
        closeSnackbar(snackbarId);
      }}
    >
      {t("snackbar-close")}
    </Button>
  </>
);

const queryClient = new QueryClient();

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <ThemeCustomization>
      <ErrorBoundary fallback={<ErrorBoundaryMessage />}>
        <SnackbarProvider
          maxSnack={3}
          autoHideDuration={
            Number(RESET_TOAST_INTERVAL) || DEFAULT_RESET_TOAST_TIME
          }
          preventDuplicate
          action={action}
        >
          <LocalizationProvider
            dateAdapter={AdapterDayjs}
            adapterLocale={
              ["it-IT", "it", "IT", "ita"].includes(i18next.language)
                ? "it"
                : FALLBACK_LANGUAGE
            }
          >
            <QueryClientProvider client={queryClient}>
              <AuthProvider>
                <ClientWrapper>
                  <ApiProvider>
                    <InitConfig>
                      <HashRouter>
                        <AppRouter />
                      </HashRouter>
                    </InitConfig>
                  </ApiProvider>
                </ClientWrapper>
              </AuthProvider>
            </QueryClientProvider>
          </LocalizationProvider>
        </SnackbarProvider>
      </ErrorBoundary>
    </ThemeCustomization>
  </React.StrictMode>
);
