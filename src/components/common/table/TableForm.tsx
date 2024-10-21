import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogTitle from "@mui/material/DialogTitle";
import { Paper } from "@mui/material";
import CommonForm from "@/components/form/CommonForm";
import { Dispatch, useMemo } from "react";
import { DEFAULT_ND } from "@/utils/constants";
import { FormFooter, TableFormInputs } from "@/types";
import { AppActions } from "@/components/mainlayout";
import { Location } from "react-router-dom";

export interface TableFormDialogProps {
  open: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
  onDelete?: () => void;
  inputs: TableFormInputs;
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
  customizableEndpoint: (path: string, args?: any) => Promise<any>;
  location: Location<any>;
  footer?: FormFooter;
}

export default function TableFormDialog({
  open,
  onDiscard,
  onConfirm,
  onDelete,
  inputs,
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
  customizableEndpoint,
  location,
  footer,
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
          formId={formId}
          submit="confirm"
          inputs={inputs}
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
          customizableEndpoint={customizableEndpoint}
          location={location}
          footer={footer}
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
