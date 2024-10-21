import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Alert, Box } from "@mui/material";
import { Dispatch, useState } from "react";
import Button from "../common/Button";
import { POLLING_INTERVAL } from "@/utils/constants";
import { useInterval } from "usehooks-ts";
import useToast from "@/hook/useToast";
import {
  ComponentFooter,
  ConfigColumn,
  Data,
  DataField,
  DefaultConfig,
  TableFeatures,
} from "@/types";
import BasicTable from "../table/BasicTable";
import { AppActions } from "../mainlayout";
import { Location } from "react-router-dom";
import { MRT_ColumnFiltersState } from "material-react-table";
import { isWorkingOnline } from "@/utils/data";

interface SearchOperatorsProps {
  title: string;
  dataFields: DataField[];
  id: string;
  commonData?: any;
  tableIdField?: string;
  dispatch: Dispatch<AppActions>;
  configurableEndpoint: (path: string, args?: any) => Promise<any>;
  configurableEndpointPost: (
    url: string,
    data?: any,
    config?: any
  ) => Promise<any>;
  forceReload: () => void;
  forceComponentReload: (id: string) => void;
  forceComponentReloadByName: (name: string) => void;
  location: Location<any>;
  tableName: string;
  features?: TableFeatures;
  columns?: ConfigColumn[];
  footer?: ComponentFooter;
  config?: DefaultConfig;
  data?: Data[];
  state?: {
    columnFilters?: MRT_ColumnFiltersState;
  };
}

export default function SearchOperators({
  title,
  dataFields: fields = [],
  configurableEndpoint,
  configurableEndpointPost,
  forceReload,
  id,
  commonData,
  tableIdField,
  // dataFields,
  dispatch,
  forceComponentReload,
  forceComponentReloadByName,
  location,
  columns,
  features,
  tableName,
  footer,
  config,
  data,
  state,
}: SearchOperatorsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [shouldPoll, setShouldPoll] = useState(false);
  const [result, setResult] = useState<string>();
  const { addNotification } = useToast();
  const [operators, setOperators] = useState<any[]>([]);

  useInterval(executeSearchOperators, shouldPoll ? POLLING_INTERVAL : null);

  function handleError(message: string) {
    setIsLoading(false);
    setShouldPoll(false);
    addNotification(message, { variant: "error" });
  }

  async function executeSearchOperators() {
    try {
      const searchOperatorsResponse =
        await configurableEndpoint("search-operators");

      if (searchOperatorsResponse?.result === "error") {
        handleError(searchOperatorsResponse.message);
      } else {
        if (searchOperatorsResponse?.result === "SEARCHING") {
          console.info("Polling for search operators");
        } else if (
          !(searchOperatorsResponse?.result || searchOperatorsResponse?.data) ||
          searchOperatorsResponse?.result === "SEARCH_ERROR" ||
          searchOperatorsResponse?.result === "OTHER_ERROR"
        ) {
          setShouldPoll(false);
          setIsLoading(false);
          setResult(t("cm-operators-error"));
        } else if (searchOperatorsResponse?.result) {
          setShouldPoll(false);
          setIsLoading(false);
          setResult(searchOperatorsResponse?.result);
        } else {
          setShouldPoll(false);
          setIsLoading(false);
          setResult(undefined);
          setOperators(searchOperatorsResponse.data);
          addNotification(t("search-success"), {
            variant: "success",
          });
        }
      }
    } catch (e: any) {
      handleError(e.message);
    }
  }

  async function startSearch() {
    setIsLoading(true);

    const online =
      fields.find((field) => field.alias === "online") || ({} as DataField);
    if (!isWorkingOnline(online.data as boolean)) {
      setResult(t("not-online"));
      return;
    }

    const gsm =
      fields.find((field) => field.alias === "GSM") || ({} as DataField);
    if (gsm.data === false) {
      setResult(t("cm-not-available"));
      return;
    }

    setResult(undefined);

    const searchOperatorsResponse = await configurableEndpoint(
      "search-operators?start"
    );
    if (searchOperatorsResponse?.result === "error") {
      handleError(searchOperatorsResponse.message);
    } else {
      if (searchOperatorsResponse?.result === "SEARCHING") {
        setShouldPoll(true);
        setIsLoading(true);
      } else if (
        !(searchOperatorsResponse?.result && searchOperatorsResponse?.data) ||
        searchOperatorsResponse?.result === "SEARCH_ERROR" ||
        searchOperatorsResponse?.result === "OTHER_ERROR"
      ) {
        setShouldPoll(false);
        setIsLoading(false);
        setResult(t("cm-operators-error"));
      } else if (searchOperatorsResponse?.result) {
        setShouldPoll(false);
        setIsLoading(false);
        setResult(searchOperatorsResponse.result);
      } else {
        setShouldPoll(false);
        setIsLoading(false);
        setResult(undefined);
        setOperators(searchOperatorsResponse.data);
        addNotification(t("search-success"), {
          variant: "success",
        });
      }
    }
  }

  async function initSearch() {
    const gsm =
      fields.find((field) => field.alias === "GSM") || ({} as DataField);
    const is4g =
      fields.find((field) => field.alias === "IS4G") || ({} as DataField);
    const scarReady =
      fields.find((field) => field.alias === "MOBILE_NETWORK_SCAN_READY") ||
      ({} as DataField);

    if (gsm?.data === false) {
      setResult(t("cm-not-available"));
    } else if (gsm?.data === true && is4g?.data === false) {
      startSearch();
    } else if (
      gsm?.data === true &&
      is4g?.data === true &&
      scarReady?.data === true
    ) {
      startSearch();
    } else {
      addNotification(t("searchOperators-not-available"), {
        variant: "warning",
      });
    }
  }

  return (
    <SimpleCard title={t(title)} fullWidth>
      <Button
        sx={{ mt: 2 }}
        variant="contained"
        isLoading={isLoading}
        onClick={initSearch}
      >
        {t("cm-find-operators")}
      </Button>
      <Box sx={{ mt: 2 }}>
        {result === t("cm-not-available") ? (
          <Alert severity="info">{result}</Alert>
        ) : result === t("cm-operators-error") ? (
          <Alert severity="error">{result}</Alert>
        ) : (
          result && <Alert severity="info">{result}</Alert>
        )}
      </Box>
      <Box sx={{ mt: 2 }}>
        <BasicTable
          id={`table-${id}`}
          title={""}
          columns={columns}
          features={features}
          dataFields={[{ alias: "state-operators", data: operators }]}
          data={data}
          commonData={commonData}
          config={config}
          tableIdField={tableIdField}
          tableName={tableName}
          dispatch={dispatch}
          configurableEndpoint={configurableEndpoint}
          configurableEndpointPost={configurableEndpointPost}
          forceReload={forceReload}
          forceComponentReload={forceComponentReload}
          forceComponentReloadByName={forceComponentReloadByName}
          location={location}
          footer={footer}
          state={state}
        />
      </Box>
    </SimpleCard>
  );
}
