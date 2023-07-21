import { useMemo } from "react";
import { Routes, Route } from "react-router-dom";
import { useSelector } from "react-redux";
import { useIntl } from "react-intl";
import Dashboard from "@/page/dashboard";
import Login from "@/page/login";
import ForgotPassword from "@/page/forgotpassword";
import ResetPassword from "@/page/resetpassword";
import Protected from "@/components/navigation/protectedroute";
import MainLayout from "@/components/mainlayout";
// import SimplifiedLayout from "@/components/simplifiedlayout";
import PublicLayout from "@/components/publiclayout";
import type { RootState } from "@/app/store";
import NoMatch from "@/page/404";
import Notifications from "@/page/notifications";
import Settings from "@/page/settings";

export default function Router() {
  const token = useSelector((state: RootState) => state.auth.token);
  const isLoggedIn = useMemo(() => !!token, [token]);
  const intl = useIntl();

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Protected isLoggedIn={isLoggedIn}>
            <MainLayout
              title={intl.formatMessage({
                id: "route.dashboard",
                description: "Dashboard page title",
              })}
              children={[<Dashboard key="DashboardPage" />]}
            />
          </Protected>
        }
      />
      <Route
        path="/notifications"
        element={
          <Protected isLoggedIn={isLoggedIn}>
            <MainLayout
              title={intl.formatMessage({
                id: "route.notifications",
                description: "Notifications page title",
              })}
              children={[<Notifications key="NotificationsPage" />]}
            />
          </Protected>
        }
      />
      <Route
        path="settings"
        element={
          <Protected isLoggedIn={isLoggedIn}>
            <MainLayout
              title={intl.formatMessage({
                id: "route.settings",
                description: "Settings page title",
              })}
              children={[<Settings key="SettingsPage" />]}
            />
          </Protected>
        }
      />
      <Route
        path="/login"
        element={<PublicLayout children={[<Login key="LoginPage" />]} />}
      />
      <Route
        path="/forgotpassword"
        element={
          <PublicLayout
            children={[<ForgotPassword key="ForgotPasswordPage" />]}
          />
        }
      />
      <Route
        path="/expiredpassword"
        element={
          <PublicLayout
            children={[
              <ResetPassword key="ResetPasswordPage" expiredPassword={true} />,
            ]}
          />
        }
      />
      <Route
        path="/resetpassword"
        element={
          <PublicLayout
            children={[<ResetPassword key="ResetPasswordPage" />]}
          />
        }
      />
      <Route
        path="*"
        element={<PublicLayout children={[<NoMatch key="NoMatchPage" />]} />}
      />
    </Routes>
  );
}
