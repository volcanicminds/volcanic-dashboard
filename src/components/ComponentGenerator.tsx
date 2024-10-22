import { ErrorBoundary } from "react-error-boundary";
import {
  Suspense,
  lazy,
  memo,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import _ from "lodash";
import ErrorBoundaryMessage from "@/components/ErrorBoundaryMessage";
import Loader from "@/components/Loader";
import useApi from "@/hook/useApi";
import useToast from "@/hook/useToast";
import { t } from "i18next";
import { useLocation, useNavigate } from "react-router-dom";
import { checkRule } from "@/utils/rules";
import { PageContext, PageContextInterface } from "@/page/page";
import { COMMON_DATA_FIELD, CONTEXT_FIELD } from "@/utils/constants";
import { AppDispatchContext } from "@/components/layout/mainlayout";
import { Component, Data, DataField } from "@/types";
import {
  deduplicateComponentDataFields,
  extractData,
  isPolling,
} from "@/utils/data";
import { useAuth } from "@/components/AuthProvider";

function ComponentGenerator({ component }: { component: Component }) {
  const ComponentModule = useMemo(() => {
    if (component.componentType) {
      return lazy(
        () =>
          import(
            `../components/${component.componentType}/${component.componentName}.tsx`
          )
      );
    }
    return null;
  }, [component.componentType]);
  const [dataFields, setDataFields] = useState<DataField[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const location = useLocation();
  const {
    configurableEndpoint,
    configurableEndpointPost,
    reload,
    reloadComponent,
    reloadComponentByName,
    forceComponentReload,
    forceComponentReloadByName,
    forceReload,
    logout,
  } = useApi();
  const { setToken } = useAuth();
  const { addNotification } = useToast();
  const navigate = useNavigate();
  const { data: contextData } = useContext<PageContextInterface>(PageContext);

  const dispatch = useContext(AppDispatchContext);

  async function getRemoteData(data: Data) {
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

    const mappedData = (data.dataFields || []).map((field) => {
      //Extract data from the response also using the "remapper" function
      const remappedData = extractData(response, field);

      return {
        ...field,
        label: t(field.label || ""),
        data: remappedData,
        timestamp: field.timestamp
          ? _.get(response, String(field.timestamp))
          : undefined,
      };
    });

    setDataFields((prevDataFields) => {
      return deduplicateComponentDataFields(prevDataFields, mappedData);
    });
  }

  async function getParallelRemoteData(
    dataItems: Data[],
    startLoader: boolean = true
  ) {
    startLoader && setIsLoading(true);
    return await Promise.allSettled(
      dataItems.filter((data) => data.type === "remote").map(getRemoteData)
    ).finally(() => setIsLoading(false));
  }

  function getApiData() {
    const dataItems = component.data || ([] as Data[]);

    /* start REMOTE data management */
    //Start polling for remote data with config polling interval
    const intervalsApiData = dataItems.filter(isPolling).map((data) => {
      return setInterval(async () => {
        getRemoteData(data);
      }, data.config?.polling?.interval);
    });
    // setIntervals(intervalsApiData);

    //Get data from remote source without polling
    /*
      I don't filter for data.config.polling?.interval
      because I want to get their data immediately
      instead of waiting for the polling interval
    */
    getParallelRemoteData(dataItems);
    /* end REMOTE data management */

    //Returns a callback to clear all polling intervals
    return () => {
      intervalsApiData.forEach(
        (interval) => interval && clearInterval(interval)
      );
      // setIntervals([]);
    };
  }
  function getStaticData() {
    const dataItems = component.data || ([] as Data[]);
    /* start STATIC data management */
    const staticData = dataItems.filter((data) => data.type === "static");
    /* end STATIC data management */

    setDataFields((prevDataFields) => {
      const uniqueDataFields = [
        ...prevDataFields,
        ...staticData.flatMap((data) => {
          return data.dataFields.map((field) => {
            return {
              ...field,
              // Convenience field to store the alias value
              id: field.alias,
              label: t(field.label || ""),
              // The "remapper" function is not allowed here, since the static data should be already in the correct format
              data: field.data,
            };
          });
        }),
      ];

      const idMap = new Map<string, DataField & { id: string }>();

      // Iterate over uniqueDataFields and update the map with the current field
      (uniqueDataFields as (DataField & { id: string })[]).forEach((field) => {
        idMap.set(field.id, field);
      });

      // Convert the map values to an array
      return Array.from(idMap.values());
    });
  }
  function getContextData() {
    const dataItems = component.data || ([] as Data[]);
    /* start CONTEXT data management */
    const contextDataToReturn = dataItems.filter(
      (data) => data.type === "context"
    );
    /* end CONTEXT data management */

    setDataFields((prevDataFields) => {
      const uniqueDataFields = [
        ...prevDataFields,
        ...contextDataToReturn.flatMap((data) => {
          return data.dataFields.map((field) => {
            const commonData = (contextData || {})[COMMON_DATA_FIELD] || {};
            // Extract data from the response also using the "remapper" function
            const remappedData = extractData(commonData, field);

            return {
              ...field,
              // Convenience field to store the alias value
              id: field.alias,
              label: t(field.label || ""),
              data: remappedData,
            };
          });
        }),
      ];

      const idMap = new Map<string, DataField & { id: string }>();

      // Iterate over uniqueDataFields and update the map with the current field
      (uniqueDataFields as (DataField & { id: string })[]).forEach((field) => {
        idMap.set(field.id, field);
      });

      // Convert the map values to an array
      return Array.from(idMap.values());
    });
  }

  //Remote use effect
  useEffect(() => {
    const cleanup = getApiData();

    setDataFields([]);

    return () => {
      cleanup();
    };
  }, [component.data, reload]);
  //Static use effect
  useEffect(() => {
    getStaticData();

    if (!component.data) {
      setDataFields([]);
    }
  }, [component.data, reload]);
  //Context use effect
  useEffect(() => {
    getContextData();

    if (!component.data) {
      setDataFields([]);
    }
  }, [component.data, contextData, reload]);

  const id = useMemo(() => {
    return String(component.componentName + Math.random());
  }, []);

  useEffect(() => {
    if (reloadComponent?.id === id) {
      const dataItems = component.data || ([] as Data[]);

      getParallelRemoteData(dataItems, false);
    }
  }, [reloadComponent]);

  useEffect(() => {
    if (reloadComponentByName?.name === component.componentName) {
      const dataItems = component.data || ([] as Data[]);

      getParallelRemoteData(dataItems, false);
    }
  }, [reloadComponentByName]);

  const isVisible = useMemo(() => {
    if (component.visible == null) {
      return true;
    }
    if (!Array.isArray(component.visible)) {
      console.warn(
        "Component visible property should be an array of conditions"
      );
      return true;
    }

    let valuesToCheck = {} as any;
    dataFields.forEach((field) => {
      valuesToCheck[field.alias] = field.data;
    });
    valuesToCheck = { ...valuesToCheck, [CONTEXT_FIELD]: contextData };

    return component.visible.every((condition) => {
      const hasPassed = checkRule(condition, [
        {
          alias: condition.data,
          data: _.get(valuesToCheck, condition.data),
        },
      ]);

      return hasPassed;
    });
  }, [dataFields, contextData, component.visible]);

  return (
    <ErrorBoundary fallback={<ErrorBoundaryMessage />}>
      <Suspense fallback={<Loader />}>
        {ComponentModule && isVisible ? (
          isLoading ? (
            <Loader skeleton justifyContent="left" />
          ) : (
            <ComponentModule
              isLoading={isLoading}
              dataFields={dataFields}
              commonData={(contextData || {})[COMMON_DATA_FIELD]}
              id={id}
              dispatch={dispatch}
              configurableEndpoint={configurableEndpoint}
              configurableEndpointPost={configurableEndpointPost}
              forceComponentReload={forceComponentReload}
              forceComponentReloadByName={forceComponentReloadByName}
              forceReload={forceReload}
              location={location}
              addNotification={addNotification}
              logout={logout}
              navigate={navigate}
              setToken={setToken}
              {...component}
            />
          )
        ) : undefined}
      </Suspense>
    </ErrorBoundary>
  );
}

export default memo(ComponentGenerator);
