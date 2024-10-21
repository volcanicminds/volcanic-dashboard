import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import Button from "@/components/common/Button";
import { t } from "i18next";
import { Paper } from "@mui/material";

export interface ConfirmDialogProps {
  open: boolean;
  onDiscard: () => void;
  onConfirm: () => void;
  title?: string;
  content?: string;
  discardLabel?: string;
  confirmLabel?: string;
  isModal?: boolean;
}

export default function ConfirmDialog({
  open,
  onDiscard,
  onConfirm,
  title,
  content,
  discardLabel,
  confirmLabel,
  isModal = true,
}: ConfirmDialogProps) {
  const Content = () => (
    <>
      <DialogTitle id="alert-dialog-title">
        {title ?? t("confirmDialog-title")}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {content ?? t("confirmDialog-content")}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={onDiscard}>
          {discardLabel ?? t("confirmDialog-discard")}
        </Button>
        <Button variant="contained" onClick={onConfirm} autoFocus>
          {confirmLabel ?? t("confirmDialog-confirm")}
        </Button>
      </DialogActions>
    </>
  );
  return isModal ? (
    <Dialog
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
