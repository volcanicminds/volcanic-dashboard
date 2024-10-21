import { t } from "i18next";
import SimpleCard from "@/components/common/SimpleCard";
import { Dispatch, useCallback, useMemo, useState } from "react";
import Button from "../common/Button";
import { POLLING_INTERVAL } from "@/utils/constants";
import { useInterval } from "usehooks-ts";
import useToast from "@/hook/useToast";
import { AppActions } from "../mainlayout";
import { Location } from "react-router-dom";
import BasicTable from "../table/BasicTable";
import {
  ComponentFooter,
  ConfigColumn,
  Data,
  DefaultConfig,
  TableFeatures,
} from "@/types";
import { MRT_ColumnFiltersState, MRT_Row } from "material-react-table";
import { Alert, Box } from "@mui/material";

interface ContactsProps {
  title: string;
  id: string;
  commonData?: any;
  dataFields: any[];
  tableIdField?: string;
  dispatch: Dispatch<AppActions>;
  customizableEndpoint: (path: string, args?: any) => Promise<any>;
  customizableEndpointPost: (
    url: string,
    data?: any,
    config?: any
  ) => Promise<any>;
  forceReload: () => void;
  forceComponentReload: (id: string) => void;
  forceComponentReloadByName: (name: string) => void;
  location: Location<any>;
  features?: TableFeatures;
  columns?: ConfigColumn[];
  tableName: string;
  footer?: ComponentFooter;
  config?: DefaultConfig;
  data?: Data[];
  state?: {
    columnFilters?: MRT_ColumnFiltersState;
  };
}

export default function Contacts({
  title,
  customizableEndpoint,
  customizableEndpointPost,
  forceReload,
  id,
  commonData,
  tableIdField,
  dataFields,
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
}: ContactsProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingContactId, setIsLoadingContactId] = useState("");
  const [shouldPoll, setShouldPoll] = useState(false);
  const { addNotification } = useToast();

  function handleEnd(
    message: string,
    variant: "error" | "success" | "info" | "warning" = "error"
  ) {
    setIsLoading(false);
    setShouldPoll(false);
    setIsLoadingContactId("");
    addNotification(message, { variant });
  }

  const executeContactsData = useCallback(
    async function executeContactsData() {
      try {
        const contactTextResponse = await customizableEndpoint("test-call", {
          cntId: isLoadingContactId,
        });
        if (contactTextResponse?.result == "error") {
          handleEnd(contactTextResponse.message);
        } else {
          if (
            contactTextResponse?.result === undefined ||
            contactTextResponse?.result === "CALL_ERROR" ||
            contactTextResponse?.result === "OTHER_ERROR"
          ) {
            handleEnd(t("test-call-error"));
          } else if (contactTextResponse.result === "CALL_STOP") {
            handleEnd(t("test-call-completed"), "success");
          } else if (contactTextResponse.result === "SMS_SENT") {
            handleEnd(t("test-sms-completed"), "success");
          } else if (contactTextResponse.result !== "CALLING") {
            handleEnd(contactTextResponse.result, "info");
          }
        }
      } catch (e: any) {
        handleEnd(e.message);
      }
    },
    [isLoadingContactId]
  );

  useInterval(executeContactsData, shouldPoll ? POLLING_INTERVAL : null);

  async function startTest(contactId: string) {
    setIsLoading(true);
    const contactTextResponse = await customizableEndpoint("test-call?start", {
      cntId: contactId,
    });
    if (contactTextResponse?.result === "error") {
      handleEnd(contactTextResponse.message);
    } else {
      if (contactTextResponse?.result === "CALLING") {
        setShouldPoll(true);
      } else if (
        contactTextResponse?.result === undefined ||
        contactTextResponse?.result === "CALL_ERROR" ||
        contactTextResponse?.result === "OTHER_ERROR"
      ) {
        handleEnd(t("test-call-error"));
      } else if (contactTextResponse?.result) {
        handleEnd(contactTextResponse.result, "info");
      }
    }
  }

  const { isContactsEnabled, disabled_contact, lanOk } = useMemo(() => {
    const GSM = dataFields.find((f) => f.alias === "GSM")?.data;
    const IS4G = dataFields.find((f) => f.alias === "IS4G")?.data;
    const gsm_equipped = dataFields.find(
      (f) => f.alias === "gsm_equipped"
    )?.data;
    const MOBILEFAULT = dataFields.find((f) => f.alias === "MOBILEFAULT")?.data;

    let disabled_contact = true;

    if (GSM === true) {
      disabled_contact = true;
      if (IS4G === false) {
        if (gsm_equipped === "1") {
          disabled_contact = true;
          if (MOBILEFAULT === true) {
            disabled_contact = false;
          } else {
            disabled_contact = true;
          }
        } else {
          disabled_contact = false;
        }
      } else {
        if (gsm_equipped === "1") {
          disabled_contact = true;
          if (MOBILEFAULT === true) {
            disabled_contact = false;
          } else {
            disabled_contact = true;
          }
        } else {
          disabled_contact = false;
        }
      }
    } else {
      disabled_contact = false;
    }

    let lanOk = false;

    const Ethernet = dataFields.find((f) => f.alias === "Ethernet")?.data;
    const Wifi = dataFields.find((f) => f.alias === "Wifi")?.data;
    if (Ethernet === true || Wifi === true) {
      lanOk = true;
    }

    return {
      isContactsEnabled: disabled_contact || lanOk,
      disabled_contact,
      lanOk,
    };
  }, [dataFields]);

  const customFeature = useCallback(
    ({ row }: { row: MRT_Row<any> }) => {
      const contactId = String(
        row.original[
          tableIdField || import.meta.env.VITE_DEFAULT_TABLE_FIELD_ID || "id"
        ]
      );
      const isSendFormatSIAIP = row.original["format"] === "4";

      return (
        <Button
          sx={{ mt: 2 }}
          disabled={
            isLoading ||
            (!disabled_contact && !isSendFormatSIAIP) ||
            (isSendFormatSIAIP && !disabled_contact && !lanOk)
          }
          isLoading={isLoading && contactId === isLoadingContactId}
          variant="contained"
          onClick={(e) => {
            e.stopPropagation();
            setIsLoadingContactId(contactId);
            startTest(contactId);
          }}
        >
          {t("contacts-table-startTest")}
        </Button>
      );
    },
    [isLoading, isLoadingContactId]
  );

  const tableData = useMemo(() => {
    const phoneNumbersField = dataFields.find(
      (f) => f.alias === "phone-numbers"
    );
    if (phoneNumbersField) {
      return [phoneNumbersField];
    } else {
      return [];
    }
  }, [data]);

  return (
    <>
      {!isContactsEnabled && (
        <SimpleCard title={t(title)} fullWidth>
          <Alert severity="info">{t("missing-module")}</Alert>
        </SimpleCard>
      )}
      {isContactsEnabled && (
        <Box sx={{ mt: 2, width: "100%" }}>
          <BasicTable
            id={`table-${id}`}
            title={t(title)}
            columns={columns}
            features={{
              ...features,
              actions: {
                ...features?.actions,
                positionActionsColumn: "first",
                custom: customFeature,
              },
            }}
            dataFields={tableData}
            data={data}
            commonData={commonData}
            config={config}
            tableIdField={tableIdField}
            tableName={tableName}
            dispatch={dispatch}
            customizableEndpoint={customizableEndpoint}
            customizableEndpointPost={customizableEndpointPost}
            forceReload={forceReload}
            forceComponentReload={forceComponentReload}
            forceComponentReloadByName={forceComponentReloadByName}
            location={location}
            footer={footer}
            state={state}
          />
        </Box>
      )}
    </>
  );
}
