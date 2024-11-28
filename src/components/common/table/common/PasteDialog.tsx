import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@/components/common/Button";
import { t } from "i18next";
import { Box, Grid, Paper, Stack, Typography } from "@mui/material";
import { TableCopyPasteField } from "@/types";
import { Dispatch, useCallback, useEffect, useMemo, useState } from "react";
import { Location } from "react-router-dom";
import { useInterval } from "usehooks-ts";
import LinearProgressWithLabel from "@/components/common/LinearProgressWithLabel";
import _ from "lodash";
import Switch from "../../form/inputs/Switch";

export interface UpdateVocalsDialoggProps {
  copiedRow: any;
  tableIdField: string;
  open: boolean;
  tableName: string;
  onClose: (reset: boolean) => void;
  configurableEndpoint: (path: string, args?: any) => Promise<any>;
  dispatch: Dispatch<any>;
  location: Location<any>;
  rowsToPaste: any[];
  addNotification: (message: string, options?: any) => any;
  copyPasteFields?: TableCopyPasteField[];
  //For storybook
  isModal?: boolean;
}

const LOOP_TIMER = 1000; // 1 second
const STOPPING_TIMER = 1500; // 1,5 seconds

export default function PasteDialog({
  copiedRow,
  tableIdField,
  open,
  tableName,
  onClose,
  configurableEndpoint,
  dispatch,
  rowsToPaste = [],
  copyPasteFields = [],
  addNotification,
  isModal = true,
  location,
}: UpdateVocalsDialoggProps) {
  const [selectedFields, setSelectedFields] = useState<TableCopyPasteField[]>(
    copyPasteFields.filter(
      (field) => (field.selected && !field.disabled) || field.readOnly
    )
  );

  const [internalState, setInternalState] = useState<{
    copyingRow: number | null;
    isStopped: boolean;
    completed: boolean;
    isCompletingThePromiseAll: boolean;
  }>({
    copyingRow: null,
    isStopped: false,
    completed: false,
    isCompletingThePromiseAll: false,
  });

  const shouldLoop = useMemo(
    () =>
      !internalState?.isCompletingThePromiseAll &&
      !internalState?.completed &&
      !internalState?.isStopped &&
      internalState?.copyingRow != null,
    [internalState]
  );
  useInterval(executeEdit, shouldLoop ? LOOP_TIMER : null);

  const getRemappedValue = (
    item: TableCopyPasteField | undefined,
    value: any
  ) => {
    return item?.remapper?.value &&
      typeof item.remapper.value === "function" &&
      value != null
      ? item.remapper.value(value)
      : value;
  };

  const getRemappedField = (
    field: string,
    item: TableCopyPasteField | undefined,
    value: any
  ) => {
    return item?.remapper?.field &&
      typeof item.remapper.field === "function" &&
      value != null
      ? item.remapper.field(value)
      : field;
  };

  const resetStates = () => {
    setSelectedFields(
      copyPasteFields.filter(
        (field) => (field.selected && !field.disabled) || field.readOnly
      )
    );

    setInternalState({
      copyingRow: null,
      isStopped: false,
      completed: false,
      isCompletingThePromiseAll: false,
    });
  };

  function handleOnClose(
    _event?: any,
    reason?: string,
    reset?: boolean,
    withTimer?: boolean
  ) {
    if (reason && ["escapeKeyDown", "backdropClick"].includes(reason)) {
      return;
    }

    const shouldReset = reset != null ? reset : true;
    if (withTimer) {
      setTimeout(() => {
        onClose(shouldReset);
        if (internalState.completed) {
          addNotification(t("paste-dialog-success"), { variant: "success" });
        }
      }, STOPPING_TIMER);
    } else {
      onClose(shouldReset);
    }
  }

  function selectAll() {
    setSelectedFields(copyPasteFields.filter((field) => !field.disabled));
  }

  function deselectAll() {
    //deselect all the fields in the selectedFields array and also the selected fields on copyPasteFields, but keeo the readOnly fields
    const newSelectedFields = selectedFields.filter((field) => field.readOnly);
    const newCopyPasteFields = newSelectedFields.map((field) => {
      if (field.selected && !field.disabled && !field.readOnly) {
        return { ...field, selected: false };
      }
      return field;
    });

    setSelectedFields(newCopyPasteFields);
  }

  useEffect(() => {
    const { isStopped, completed } = internalState || {};
    if (completed) {
      handleOnClose(undefined, undefined, true, true);
    } else if (isStopped) {
      setTimeout(() => {
        handleOnClose(undefined, undefined, false, false);
      }, STOPPING_TIMER);
    }
  }, [internalState?.completed, internalState?.isStopped]);

  async function executeEdit() {
    const index = internalState?.copyingRow ?? 1;
    const row = rowsToPaste[index - 1];

    if (!internalState.isStopped && !internalState.completed) {
      try {
        const newInternalState = {
          ...internalState,
          copyingRow: index + 1,
          isCompletingThePromiseAll: true,
        };
        setInternalState(newInternalState);
        await Promise.all(
          selectedFields.map(async (selectedField) => {
            const unmappedField = selectedField.field;
            const unmappedValue = copiedRow[unmappedField];

            const foundCopyPasteField = copyPasteFields.find(
              (cpf) => cpf.field === unmappedField
            );

            const field = getRemappedField(
              unmappedField,
              foundCopyPasteField,
              row
            );
            const value = getRemappedValue(foundCopyPasteField, unmappedValue);

            let response = null;
            if (value != null) {
              if (foundCopyPasteField?.binding) {
                response = await foundCopyPasteField.binding({
                  data: row,
                  value,
                  configurableEndpoint,
                });
              } else {
                response = await configurableEndpoint("edit", {
                  type: tableName,
                  name: field,
                  value,
                  DT_RowId: row[tableIdField],
                });
              }

              if (response?.result === "error") {
                addNotification(response.message, { variant: "error" });
                setInternalState({
                  ...newInternalState,
                  isStopped: true,
                });
                throw new Error(response.message);
              }
            }
          })
        );

        if (index < rowsToPaste.length) {
          setInternalState({
            ...newInternalState,
            isCompletingThePromiseAll: false,
          });
        } else {
          setInternalState({
            ...newInternalState,
            completed: true,
            isCompletingThePromiseAll: false,
          });
        }
      } catch (e: any) {
        console.error(e);
        addNotification(e.message, { variant: "error" });
      }
    }
  }

  const pasteFields = async () => {
    dispatch({ type: "change_dirty", payload: location.pathname });
    setInternalState({ ...internalState, copyingRow: 1 });
  };

  const handleStop = () => {
    setInternalState((prevState) => ({ ...prevState, isStopped: true }));
  };

  const isCopying = useMemo(
    () => internalState?.copyingRow !== null,
    [internalState?.copyingRow]
  );

  const DialogActionsComponents = useCallback(
    () => (
      <DialogActions>
        <Button disabled={isCopying} variant="outlined" onClick={handleOnClose}>
          {t("cancel")}
        </Button>
        <Button
          disabled={
            !isCopying ||
            !!internalState?.completed ||
            !!internalState?.isStopped
          }
          isLoading={!!internalState?.isStopped}
          loaderSize="25px"
          variant="outlined"
          color="error"
          onClick={handleStop}
        >
          {t("stop")}
        </Button>
        <Button
          disabled={isCopying}
          variant="contained"
          onClick={pasteFields}
          isLoading={isCopying && !internalState?.isStopped}
          loaderSize="25px"
        >
          {t("ok")}
        </Button>
      </DialogActions>
    ),
    [isCopying, internalState?.completed, internalState?.isStopped]
  );

  const Content = useCallback(
    () => (
      <>
        <DialogTitle id="alert-dialog-title">
          {t("paste-dialog-title")}
        </DialogTitle>
        <DialogContent>
          {isCopying && (
            <Box sx={{ py: 5 }}>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {t("paste-dialog-copying-row")}
              </Typography>
              <LinearProgressWithLabel
                value={Math.round(
                  (((internalState?.copyingRow ?? 1) - 1) /
                    rowsToPaste.length) *
                    100
                )}
                label={`${(internalState?.copyingRow ?? 1) - 1}/${
                  rowsToPaste?.length || 0
                }`}
              />
            </Box>
          )}
          {!isCopying && (
            <>
              <Typography variant="body1">
                {t("paste-dialog-description")}
              </Typography>
              <Stack direction="row" spacing={2} sx={{ mt: 2 }}>
                <Button onClick={selectAll} variant="contained">
                  {t("all")}
                </Button>
                <Button onClick={deselectAll} variant="outlined">
                  {t("none-btn")}
                </Button>
              </Stack>
              <Grid sx={{ mt: 2 }} container spacing={1}>
                {copyPasteFields?.map((field, index) => {
                  const isSelected = selectedFields.includes(field);

                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      key={`PasteDialogSwitches-${index}-${Math.random()}`}
                      alignItems="center"
                      display="flex"
                      flexDirection="row"
                      gap={1}
                    >
                      <Switch
                        id={`PasteDialogSwitches-${index}-${Math.random()}`}
                        disabled={field.disabled || field.readOnly}
                        label={t(field.label)}
                        value={isSelected}
                        onChange={(checked: any) => {
                          if (checked) {
                            setSelectedFields([...selectedFields, field]);
                          } else {
                            setSelectedFields(
                              selectedFields.filter(
                                (selectedField) => selectedField !== field
                              )
                            );
                          }
                        }}
                        sx={{ width: "100%" }}
                      />
                    </Grid>
                  );
                })}
              </Grid>
            </>
          )}
        </DialogContent>
      </>
    ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isCopying,
      internalState?.copyingRow,
      rowsToPaste.length,
      copyPasteFields,
      selectedFields,
    ]
  );

  return isModal ? (
    <Dialog
      open={open}
      onClose={handleOnClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      onTransitionExited={resetStates}
    >
      <Content />
      <DialogActionsComponents />
    </Dialog>
  ) : (
    <Paper style={{ padding: "20px", margin: "20px" }}>
      <Content />
      <DialogActionsComponents />
    </Paper>
  );
}
