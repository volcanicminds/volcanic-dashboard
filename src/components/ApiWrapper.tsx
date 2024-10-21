import { ApiContext } from "@/hook/api";
import { FC, ReactNode, useCallback, useState } from "react";
import useClient from "@/hook/useClient";
import { t } from "i18next";
import { AxiosError } from "axios";
import { buildQueryStringWithPrefix, getBackendError } from "@/utils/strings";
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

  const login = async (password: string) => {
    const params = new URLSearchParams();
    params.append("password", password);

    return {
      result: "123",
    };

    //TODO: to develop
    // return await client
    //   .get("login", { params })
    //   .then((res: any) => {
    //     return res.data;
    //   })
    //   .catch((err: any) => {
    //     //
    //     return res.data;

    //   });
  };

  const logout = async ({
    auth,
    password,
  }: {
    auth?: string;
    password?: string;
  }) => {
    const params = new URLSearchParams();

    if (auth) {
      params.append("auth", auth);
    } else if (password) {
      params.append("password", password);
    }

    return await client
      .get("logout", { params })
      .then((res: any) => {
        const status = res.status;
        switch (status) {
          case 200:
            return res.data;
          default:
            return {
              result: "error",
              message: `Logout error: ${status}`,
            };
        }
      })
      .catch((err: any) => {
        if (err.code === AXIOS_TIMOUT_ERROR) {
          return {
            result: "error",
            message: t("error-timeout"),
          };
        }
        return {
          result: "error",
          message: `Logout error: ${err.message}`,
        };
      });
  };

  const apply = async () => {
    return await client
      .get("commit")
      .then((res: any) => {
        const status = res.status;
        switch (status) {
          case 200:
            return res.data;
          default:
            return {
              result: "error",
              message: t("commitFailed"),
            };
        }
      })
      .catch((err: any) => {
        if (err.code === AXIOS_TIMOUT_ERROR) {
          return {
            result: "error",
            message: t("error-timeout"),
          };
        }
        return {
          result: "error",
          message: getBackendError(err, "commitFailed"),
        };
      });
  };

  const suspend = async ({ auth }: { auth: string }) => {
    const paramsKeepAlive = new URLSearchParams();
    paramsKeepAlive.append("auth", auth);
    paramsKeepAlive.append("renewTime", "1000");
    paramsKeepAlive.append("force", "1");
    await client
      .get("cfgSessionKeepAlive", { params: paramsKeepAlive })
      .catch((err: any) => {
        if (err.code === AXIOS_TIMOUT_ERROR) {
          return {
            result: "error",
            message: t("error-timeout"),
          };
        }
        return {
          result: "error",
          message: `Keep alive error: ${err.message}`,
        };
      });

    return await client.get("suspendSession").catch((err: any) => {
      if (err.code === AXIOS_TIMOUT_ERROR) {
        return {
          result: "error",
          message: t("error-timeout"),
        };
      }
      return {
        result: "error",
        message: `Suspend error: ${err.message}`,
      };
    });
  };

  const customizableEndpoint = async (
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

  const customizableEndpointPost = async (
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
        logout,
        apply,
        suspend,
        customizableEndpoint,
        customizableEndpointPost,
        reload,
        reloadComponent,
        reloadComponentByName,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};
