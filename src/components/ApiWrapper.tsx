import { ApiContext } from "@/hook/api";
import { FC, ReactNode, useCallback, useState } from "react";
import useClient from "@/hook/useClient";
import { t } from "i18next";
import { AxiosError } from "axios";
import { buildQueryStringWithPrefix } from "@/utils/strings";
import { AXIOS_TIMOUT_ERROR } from "@/utils/constants";
import { useAuth } from "@/components/AuthProvider";

export const DEFAULT_SESSION_MODE = "web";
export const STATUS_FIELD = "_response_status";

export const ApiProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [reload, setReload] = useState();
  const [reloadComponent, setReloadComponent] = useState<
    { id?: string } | undefined
  >();
  const [reloadComponentByName, setReloadComponentByName] = useState<
    { name?: string } | undefined
  >();
  const { setToken } = useAuth();

  const { client } = useClient();

  const forceReload = useCallback(() => {
    setReload({} as any);
  }, []);

  const forceComponentReload = useCallback((id: string) => {
    setReloadComponent({ id });
  }, []);

  const forceComponentReloadByName = useCallback((name: string) => {
    setReloadComponentByName({ name });
  }, []);

  const login = async (email: string, password: string) => {
    return await client
      .post("login", { email, password })
      .then((res: any) => {
        return res.data;
      })
      .catch((err: any) => {
        return {
          result: "error",
          message: err.message,
        };
      });
  };

  const configurableEndpoint = async (
    path: string,
    args: any = {},
    {
      serialize = true,
    }: {
      serialize?: boolean;
    } = {}
  ) => {
    const params = new URLSearchParams();
    if (serialize) {
      for (const key in args) {
        params.append(key, args[key]);
      }
    } else {
      const query = buildQueryStringWithPrefix(path, args);
      path = `${path}${query}`;
    }

    return await client
      .get(path, { params })
      .then((res: any) => {
        if (res.status < 200 || res.status >= 300) {
          throw new Error(`Network error: ${res.status}, ${res.data}`);
        }

        return { ...res.data, [STATUS_FIELD]: res.status };
      })
      .catch((err: AxiosError) => {
        if (err.code === AXIOS_TIMOUT_ERROR) {
          return {
            result: "error",
            message: t("error-timeout"),
          };
        }
        if ([401, 406].includes(err.response?.status || -1)) {
          setToken(null);
          return {
            result: "error",
            message: t("error-unauthorized"),
            redirect: "/login",
          };
        }

        return {
          result: "error",
          message: err.message,
          data: err.response?.data,
          [STATUS_FIELD]: err.response?.status,
        };
      });
  };

  const configurableEndpointPost = async (
    path: string,
    body: any = {},
    options?: {
      headers?: { [key: string]: string };
      timeout?: number;
    }
  ) => {
    return await client
      .post(path, body, options)
      .then((res: any) => {
        if (res.status < 200 || res.status >= 300) {
          throw new Error(`Network error: ${res.status}, ${res.data}`);
        }

        return { ...res.data, [STATUS_FIELD]: res.status };
      })
      .catch((err: AxiosError) => {
        if (err.code === AXIOS_TIMOUT_ERROR) {
          return {
            result: "error",
            message: t("error-timeout"),
          };
        }
        if ([401, 406].includes(err.response?.status || -1)) {
          setToken(null);
          return {
            result: "error",
            message: t("error-unauthorized"),
            redirect: "/login",
          };
        }

        return {
          result: "error",
          message: err.message,
          [STATUS_FIELD]: err.response?.status,
        };
      });
  };

  return (
    <ApiContext.Provider
      value={{
        forceReload,
        forceComponentReload,
        forceComponentReloadByName,
        login,
        configurableEndpoint,
        configurableEndpointPost,
        reload,
        reloadComponent,
        reloadComponentByName,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
