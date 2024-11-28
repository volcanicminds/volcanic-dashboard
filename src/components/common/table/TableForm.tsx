import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Paper } from "@mui/material";
import CommonForm from "@/components/form/CommonForm";
import { Dispatch, useMemo } from "react";
import { DEFAULT_ND } from "@/utils/constants";
import { FormFooter, TableFormInputs, TableFormValidation } from "@/types";
import { Location } from "react-router-dom";
import { AppActions } from "@/components/layout/mainlayout";

export interface TableFormDialogProps {
  open: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
  onDelete?: () => void;
  inputs: TableFormInputs;
  validation?: TableFormValidation;
  title?: string;
  discardLabel?: string;
  confirmLabel?: string;
  deleteLabel?: string;
  isModal?: boolean;
  tableName?: string;
  rowId?: string;
  formDataToEdit: any;
  refresh?: () => void;
  commonData: any;
  dispatch: Dispatch<AppActions>;
  configurableEndpoint: (path: string, args?: any) => Promise<any>;
  location: Location<any>;
  footer?: FormFooter;
  forceReload: () => void;
}

export default function TableFormDialog({
  open,
  onDiscard,
  onConfirm,
  onDelete,
  inputs,
  validation,
  title,
  discardLabel,
  confirmLabel,
  deleteLabel,
  isModal = true,
  tableName,
  rowId,
  formDataToEdit,
  refresh,
  commonData,
  dispatch,
  configurableEndpoint,
  location,
  footer,
  forceReload,
}: TableFormDialogProps) {
  const formId = useMemo(
    () => String((title || DEFAULT_ND) + Math.random()),
    [title]
  );

  const Content = () => (
    <>
      <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
      <DialogContent>
        <CommonForm
          title=""
          isDisabled={false}
          formId={formId}
          submit="confirm"
          inputs={inputs}
          validation={validation}
          dataFields={[
            {
              alias: tableName || DEFAULT_ND,
              data: [formDataToEdit],
            },
          ]}
          tableName={tableName}
          rowId={rowId}
          refresh={refresh}
          onDiscard={onDiscard}
          onConfirm={onConfirm}
          onDelete={onDelete}
          discardLabel={discardLabel}
          confirmLabel={confirmLabel}
          deleteLabel={deleteLabel}
          commonData={commonData}
          dispatch={dispatch}
          configurableEndpoint={configurableEndpoint}
          location={location}
          footer={footer}
          forceReload={forceReload}
        />
      </DialogContent>
    </>
  );

  return isModal ? (
    <Dialog
      fullWidth
      maxWidth="md"
      open={open}
      onClose={onDiscard}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <Content />
    </Dialog>
  ) : (
    <Paper style={{ padding: "20px", margin: "20px" }}>
      <Content />
    </Paper>
  );
}
