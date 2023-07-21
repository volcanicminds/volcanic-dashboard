import React from "react";
import ReactDOM from "react-dom/client";
import { Provider } from "react-redux";
import { SnackbarProvider } from "notistack";
import { BrowserRouter } from "react-router-dom";
import { IntlProvider } from "react-intl";
import { store } from "@/app/store";
import ThemeCustomization from "@/themes";
import Italian from "@/lang/it.json";
import English from "@/lang/en.json";
import Router from "@/components/navigation/router";
import ToastWrapper from "@/components/toastwrapper";
import { RESET_TOAST_INTERVAL } from "@/utils/config";
import "@/index.css";

const locale = navigator.language;
let lang;
if (locale === "it-IT") {
  lang = Italian;
} else {
  lang = English;
}

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <IntlProvider locale={locale} messages={lang}>
      <Provider store={store}>
        <ThemeCustomization>
          <SnackbarProvider
            maxSnack={3}
            autoHideDuration={RESET_TOAST_INTERVAL}
          >
            <ToastWrapper>
              <BrowserRouter>
                <Router />
              </BrowserRouter>
            </ToastWrapper>
          </SnackbarProvider>
        </ThemeCustomization>
      </Provider>
    </IntlProvider>
  </React.StrictMode>
);
