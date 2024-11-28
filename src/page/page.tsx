import _ from "lodash";
import ComponentGenerator from "@/components/ComponentGenerator";
import {
  Context,
  Dispatch,
  ReactNode,
  Reducer,
  Suspense,
  createContext,
  lazy,
  memo,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  useState,
} from "react";
import { t } from "i18next";
import useApi from "@/hook/useApi";
import useToast from "@/hook/useToast";
import { useLocation, useNavigate } from "react-router-dom";
import { ErrorBoundary } from "react-error-boundary";
import ErrorBoundaryMessage from "@/components/ErrorBoundaryMessage";
import Loader from "@/components/Loader";
import { Box } from "@mui/material";
import {
  COMMON_DATA_FIELD,
  DATA_COLUMMS_PROP_NAME,
  STATUS_FIELD,
} from "@/utils/constants";
import { Component, PageConfiguration, PageData } from "@/types";
import {
  deduplicatePageDataFields,
  extractData,
  getStaticData,
  getStaticDataFields,
  isPolling,
} from "@/utils/data";
import { useAuth } from "@/components/AuthProvider";
import { LAST_PAGE_STORAGE_KEY, save } from "@/utils/localStorage";

export type PageDataContextType = { [key: string]: any };
export interface PageContextInterface {
  data: PageDataContextType;
  setContextData: (data: any) => void;
  dispatch: Dispatch<PageActions>;
}
export const PageContext: Context<PageContextInterface> = createContext(
  {} as PageContextInterface
);

const EXCLUDE_DATA_FIELDS = [STATUS_FIELD];

interface PageState {
  canPoll: boolean;
}

export type PageActions = { type: "can_poll"; payload: boolean };

function pageReducer(state: PageState, action: PageActions) {
  switch (action.type) {
    case "can_poll":
      return { ...state, canPoll: action.payload };
    default:
      return state;
  }
}

function PageWrapper({
  config,
  children,
}: {
  config: PageConfiguration;
  children: ReactNode;
}) {
  const { checkAuth, reload, configurableEndpoint } = useApi();
  const { token, setToken } = useAuth();
  const { addNotification } = useToast();
  const [contextData, setContextData] = useState<PageDataContextType>({});
  const navigate = useNavigate();
  const intervalsRef = useRef<NodeJS.Timeout[]>([]);
  const [state, dispatch] = useReducer<Reducer<any, PageActions>>(pageReducer, {
    canPoll: true,
  });

  const Layout = useMemo(
    () => lazy(() => import(`../layouts/${config?.layout}.tsx`)),
    [config.layout]
  );

  async function getRemoteData(data: PageData) {
    const response = await configurableEndpoint(
      data.config?.url,
      data.config?.params
    );

    if (response.result === "error") {
      addNotification(response.message, { variant: "error" });
      if (response.redirect) {
        navigate(response.redirect);
      }
      return;
    }

    //Is there is a global context field, the entire response will be stored in the context by that context name
    if (data.context) {
      setContextData((prevContextData) => {
        const keyMap = new Map<string, { value: any; label: string }>();

        Object.keys(response)
          .filter((key) => !EXCLUDE_DATA_FIELDS.includes(key))
          .forEach((key: string) => {
            const field = response[key];
            keyMap.set(key, {
              value: key,
              label: field,
            });
          });

        const newData = {
          ...prevContextData[COMMON_DATA_FIELD],
          [data.context as string]: Array.from(keyMap.values()),
        };

        return {
          ...prevContextData,
          [COMMON_DATA_FIELD]: newData,
        };
      });
    }

    //The dataFields inner context items are stored in the context by the context name
    if (data.dataFields) {
      const mappedData = data.dataFields.map((field) => {
        //Extract data from the response also using the "remapper" function
        const dataValues = extractData(response, field);

        return {
          ...field,
          data: dataValues,
        };
      });

      setContextData((prevContextData) => {
        const deduplicatedDataFields = deduplicatePageDataFields(
          prevContextData,
          mappedData
        );

        return {
          ...prevContextData,
          [COMMON_DATA_FIELD]: deduplicatedDataFields,
        };
      });
    }
  }

  function clearCurentIntervals() {
    intervalsRef.current.forEach(
      (interval) => interval && clearInterval(interval)
    );
    intervalsRef.current = [];
  }

  function getPollingData() {
    clearCurentIntervals();

    const dataItems = (config.data as PageData[]) || ([] as PageData[]);
    //Start polling for remote data with config polling interval
    const intervalsData = dataItems.filter(isPolling).map((data) => {
      return setInterval(async () => {
        getRemoteData(data);
      }, data.config?.polling?.interval);
    });
    intervalsRef.current = intervalsData;
    return () => {
      clearCurentIntervals();
    };
  }

  function getData(dataItems: PageData[] = []) {
    /* start REMOTE not polling data management */
    Promise.allSettled(
      dataItems.filter((data) => data.type === "remote").map(getRemoteData)
    );
    /* end REMOTE data management */

    /* start STATIC data management */
    const staticData = getStaticData(dataItems, "context");
    const staticDataFields = getStaticDataFields(dataItems, "context");
    /* end STATIC data management */

    /* start CONTEXT data management */
    setContextData((prevContextData) => {
      const processedKeys = new Set<string>();

      const mergeWithoutDuplicates = (target: any, source: any) => {
        for (const key of Object.keys(source)) {
          if (!processedKeys.has(key)) {
            processedKeys.add(key);
            target[key] = source[key];
          }
        }
      };

      const newData = { ...prevContextData[COMMON_DATA_FIELD] };
      mergeWithoutDuplicates(newData, staticData);
      mergeWithoutDuplicates(newData, staticDataFields);

      return {
        ...prevContextData,
        [COMMON_DATA_FIELD]: newData,
      };
    });
    /* end CONTEXT data management */
  }

  useEffect(() => {
    if (state.canPoll) {
      const cleanup = getPollingData();

      return () => {
        cleanup();
      };
    } else if (!state.canPoll) {
      clearCurentIntervals();
    }
  }, [state.canPoll]);

  const memoizedConfigData = useMemo(() => {
    return config.data || ([] as PageData[]);
  }, [config.data]);

  const memoizedReload = useMemo(() => {
    return reload;
  }, [reload]);

  useEffect(() => {
    if (memoizedConfigData) {
      getData(memoizedConfigData);
    } else {
      const newContextData = Object.assign({}, contextData);
      newContextData[COMMON_DATA_FIELD] = null;

      setContextData(newContextData);
    }
  }, [memoizedConfigData, memoizedReload]);

  useEffect(() => {
    checkAuth(token)
      .then((res: any) => {
        if (res?.result !== "OK") {
          console.error(res.message);
          addNotification(t("auth-end-session "), { variant: "error" });
          setToken(null);
          navigate("/login");
        }
      })
      .catch((err: any) => {
        console.error(err);
      });
  }, [config]);

  return (
    <ErrorBoundary fallback={<ErrorBoundaryMessage />}>
      <Suspense fallback={<Loader source="page" />}>
        <PageContext.Provider
          value={{ data: contextData, setContextData, dispatch }}
        >
          <Layout {...(config.layoutProps || {})}>{children}</Layout>
        </PageContext.Provider>
      </Suspense>
    </ErrorBoundary>
  );
}

const Page = memo(({ config }: { config: PageConfiguration }) => {
  const location = useLocation();

  useEffect(() => {
    save(LAST_PAGE_STORAGE_KEY, location.pathname);
  }, [location.pathname]);

  const components = useMemo(() => config?.components || [], [config]);
  const generatedComponents = useMemo(
    () =>
      components.map((element: Component, index: number) => {
        return (
          <Box
            display="flex"
            flex={1}
            minWidth={0}
            key={`component-box-${config.title}-${index}`}
            {...{
              [DATA_COLUMMS_PROP_NAME]: element[DATA_COLUMMS_PROP_NAME],
            }}
          >
            <ComponentGenerator component={element} />
          </Box>
        );
      }),
    [components, config.title]
  );

  return <PageWrapper config={config}>{generatedComponents}</PageWrapper>;
});

export default Page;
